import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  // =========================
  // Types & Shared State
  // =========================

  public type Product = {
    id : Text;
    name : Text;
    description : Text;
    category : Text;
    price : Nat;
    discount : ?Nat;
    images : [Storage.ExternalBlob];
    vendor : Principal;
    ratings : [Review];
    stock : Nat;
    active : Bool;
  };

  module Product {
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      Text.compare(product1.name, product2.name);
    };

    public func compareByPrice(product1 : Product, product2 : Product) : Order.Order {
      switch (Nat.compare(product1.price, product2.price)) {
        case (#equal) { Text.compare(product1.name, product2.name) };
        case (order) { order };
      };
    };
  };

  public type Category = {
    id : Text;
    name : Text;
    image : Storage.ExternalBlob;
  };

  public type Review = {
    reviewer : Principal;
    rating : Nat;
    comment : Text;
  };

  public type CartItem = {
    productId : Text;
    quantity : Nat;
  };

  public type Discount = {
    code : Text;
    percentage : Nat;
    vendor : ?Principal;
  };

  public type Vendor = {
    principal : Principal;
    name : Text;
    verified : Bool;
  };

  public type OrderItem = {
    productId : Text;
    quantity : Nat;
    price : Nat;
  };

  public type OrderStatus = {
    #pending;
    #processing;
    #shipped;
    #delivered;
    #cancelled;
  };

  public type Order = {
    id : Text;
    customer : Principal;
    items : [OrderItem];
    total : Nat;
    status : OrderStatus;
    timestamp : Time.Time;
    vendor : Principal;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
    address : Text;
  };

  let products = Map.empty<Text, Product>();
  let categories = Map.empty<Text, Category>();
  let carts = Map.empty<Principal, List.List<CartItem>>();
  let discounts = Map.empty<Principal, List.List<Discount>>();
  let vendors = Map.empty<Principal, Vendor>();
  let orders = Map.empty<Text, Order>();
  let wishlists = Map.empty<Principal, List.List<Text>>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Track vendor assignments separately (since we use #user role for both vendors and customers)
  let vendorPrincipals = Map.empty<Principal, Bool>();

  // =========================
  // Authorization
  // =========================

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public query ({ caller }) func isAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public query ({ caller }) func isVendor() : async Bool {
    switch (vendorPrincipals.get(caller)) {
      case (?true) { true };
      case (_) { false };
    };
  };

  // Helper function to check if caller is a vendor
  func callerIsVendor(caller : Principal) : Bool {
    switch (vendorPrincipals.get(caller)) {
      case (?true) { true };
      case (_) { false };
    };
  };

  // =========================
  // User Profile APIs
  // =========================

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // =========================
  // Product APIs
  // =========================

  public query ({ caller }) func getProducts(sortBy : Text) : async [Product] {
    products.values().toArray().sort(
      switch (sortBy) {
        case ("price") { Product.compareByPrice };
        case (_) { Product.compare };
      }
    );
  };

  public query ({ caller }) func getProduct(id : Text) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public shared ({ caller }) func addProduct(product : Product) : async () {
    // Only admins or vendors can add products
    if (not AccessControl.isAdmin(accessControlState, caller) and not callerIsVendor(caller)) {
      Runtime.trap("Unauthorized: Only admins or vendors can add products");
    };

    // If vendor, ensure they're adding product under their own name
    if (callerIsVendor(caller) and product.vendor != caller) {
      Runtime.trap("Unauthorized: Vendors can only add products under their own name");
    };

    products.add(product.id, product);
  };

  public shared ({ caller }) func updateProduct(id : Text, product : Product) : async () {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?existingProduct) {
        // Admins can update any product
        if (AccessControl.isAdmin(accessControlState, caller)) {
          products.add(id, product);
          return;
        };

        // Vendors can only update their own products
        if (callerIsVendor(caller) and existingProduct.vendor == caller) {
          // Ensure vendor doesn't change ownership
          if (product.vendor != caller) {
            Runtime.trap("Unauthorized: Cannot change product ownership");
          };
          products.add(id, product);
          return;
        };

        Runtime.trap("Unauthorized: Only admins or product owner can update products");
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Text) : async () {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?existingProduct) {
        // Admins can delete any product
        if (AccessControl.isAdmin(accessControlState, caller)) {
          products.remove(id);
          return;
        };

        // Vendors can only delete their own products
        if (callerIsVendor(caller) and existingProduct.vendor == caller) {
          products.remove(id);
          return;
        };

        Runtime.trap("Unauthorized: Only admins or product owner can delete products");
      };
    };
  };

  public query ({ caller }) func getVendorProducts() : async [Product] {
    if (not callerIsVendor(caller)) {
      Runtime.trap("Unauthorized: Only vendors can view their products");
    };

    products.values().filter(func(p) { p.vendor == caller }).toArray();
  };

  // =========================
  // Cart APIs
  // =========================

  public shared ({ caller }) func addItemToCart(productId : Text, quantity : Nat) : async () {
    // Require authenticated user (not guest)
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Please sign in to add items to cart");
    };

    let cart = switch (carts.get(caller)) {
      case (null) { List.empty<CartItem>() };
      case (?existing) { existing };
    };
    cart.add({ productId; quantity });
    carts.add(caller, cart);
  };

  public query ({ caller }) func getCart() : async [CartItem] {
    // Require authenticated user (not guest)
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Please sign in to view cart");
    };

    switch (carts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart.toArray() };
    };
  };

  public shared ({ caller }) func clearCart() : async () {
    // Require authenticated user (not guest)
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Please sign in to clear cart");
    };

    carts.remove(caller);
  };

  public shared ({ caller }) func updateCartQuantity(productId : Text, quantity : Nat) : async () {
    // Require authenticated user (not guest)
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Please sign in to update cart");
    };

    switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart does not exist") };
      case (?existingCart) {
        let updatedCart = existingCart.toArray().map(
          func(item) {
            if (item.productId == productId) {
              { item with quantity };
            } else {
              item;
            };
          }
        );
        let newCart = List.fromArray<CartItem>(updatedCart);
        carts.add(caller, newCart);
      };
    };
  };

  public shared ({ caller }) func removeCartItem(productId : Text) : async () {
    // Require authenticated user (not guest)
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Please sign in to remove items from cart");
    };

    switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart does not exist") };
      case (?existingCart) {
        let filteredCart = existingCart.filter(
          func(item) { item.productId != productId }
        );
        carts.add(caller, filteredCart);
      };
    };
  };

  // =========================
  // Review APIs
  // =========================

  public shared ({ caller }) func addReview(productId : Text, review : Review) : async () {
    // Require authenticated user (not guest)
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Please sign in to add reviews");
    };

    // Ensure reviewer matches caller
    if (review.reviewer != caller) {
      Runtime.trap("Unauthorized: Cannot submit review on behalf of another user");
    };

    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        let reviewsList = List.fromArray<Review>(product.ratings);
        reviewsList.add(review);
        let updatedReviews = reviewsList.toArray();
        let updatedProduct = { product with ratings = updatedReviews };
        products.add(productId, updatedProduct);
      };
    };
  };

  // =========================
  // Category APIs
  // =========================

  public query ({ caller }) func getCategories() : async [Category] {
    categories.values().toArray();
  };

  public query ({ caller }) func getCategory(id : Text) : async Category {
    switch (categories.get(id)) {
      case (null) { Runtime.trap("Category not found") };
      case (?category) { category };
    };
  };

  public shared ({ caller }) func addCategory(category : Category) : async () {
    // Admin only
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add categories");
    };

    categories.add(category.id, category);
  };

  public shared ({ caller }) func updateCategory(id : Text, category : Category) : async () {
    // Admin only
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update categories");
    };

    switch (categories.get(id)) {
      case (null) { Runtime.trap("Category not found") };
      case (?_) {
        categories.add(id, category);
      };
    };
  };

  public shared ({ caller }) func deleteCategory(id : Text) : async () {
    // Admin only
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete categories");
    };

    categories.remove(id);
  };

  // =========================
  // Vendor Management APIs
  // =========================

  public shared ({ caller }) func addVendor(vendorPrincipal : Principal, vendor : Vendor) : async () {
    // Admin only
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add vendors");
    };

    vendors.add(vendorPrincipal, vendor);
    vendorPrincipals.add(vendorPrincipal, true);

    // Assign user role to vendor
    AccessControl.assignRole(accessControlState, caller, vendorPrincipal, #user);
  };

  public shared ({ caller }) func updateVendor(vendorPrincipal : Principal, vendor : Vendor) : async () {
    // Admin only
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update vendors");
    };

    switch (vendors.get(vendorPrincipal)) {
      case (null) { Runtime.trap("Vendor not found") };
      case (?_) {
        vendors.add(vendorPrincipal, vendor);
      };
    };
  };

  public shared ({ caller }) func removeVendor(vendorPrincipal : Principal) : async () {
    // Admin only
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove vendors");
    };

    vendors.remove(vendorPrincipal);
    vendorPrincipals.remove(vendorPrincipal);
  };

  public query ({ caller }) func getVendors() : async [Vendor] {
    // Admin only
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all vendors");
    };

    vendors.values().toArray();
  };

  public query ({ caller }) func getVendor(vendorPrincipal : Principal) : async ?Vendor {
    vendors.get(vendorPrincipal);
  };

  // =========================
  // Order APIs
  // =========================

  public shared ({ caller }) func createOrder(order : Order) : async () {
    // Require authenticated user (not guest)
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Please sign in to create orders");
    };

    // Ensure customer matches caller
    if (order.customer != caller) {
      Runtime.trap("Unauthorized: Cannot create order on behalf of another user");
    };

    orders.add(order.id, order);
  };

  public query ({ caller }) func getCustomerOrders() : async [Order] {
    // Require authenticated user (not guest)
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Please sign in to view orders");
    };

    orders.values().filter(func(o) { o.customer == caller }).toArray();
  };

  public query ({ caller }) func getVendorOrders() : async [Order] {
    // Require vendor
    if (not callerIsVendor(caller)) {
      Runtime.trap("Unauthorized: Only vendors can view their orders");
    };

    orders.values().filter(func(o) { o.vendor == caller }).toArray();
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    // Admin only
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };

    orders.values().toArray();
  };

  public query ({ caller }) func getOrder(orderId : Text) : async Order {
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        // Customer can view their own orders
        if (order.customer == caller) {
          return order;
        };

        // Vendor can view their orders
        if (callerIsVendor(caller) and order.vendor == caller) {
          return order;
        };

        // Admin can view any order
        if (AccessControl.isAdmin(accessControlState, caller)) {
          return order;
        };

        Runtime.trap("Unauthorized: Cannot view this order");
      };
    };
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Text, status : OrderStatus) : async () {
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        // Vendor can update their own orders
        if (callerIsVendor(caller) and order.vendor == caller) {
          let updatedOrder = { order with status };
          orders.add(orderId, updatedOrder);
          return;
        };

        // Admin can update any order
        if (AccessControl.isAdmin(accessControlState, caller)) {
          let updatedOrder = { order with status };
          orders.add(orderId, updatedOrder);
          return;
        };

        Runtime.trap("Unauthorized: Only vendor or admin can update order status");
      };
    };
  };

  // =========================
  // Wishlist APIs
  // =========================

  public shared ({ caller }) func addToWishlist(productId : Text) : async () {
    // Require authenticated user (not guest)
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Please sign in to add to wishlist");
    };

    let wishlist = switch (wishlists.get(caller)) {
      case (null) { List.empty<Text>() };
      case (?existing) { existing };
    };
    wishlist.add(productId);
    wishlists.add(caller, wishlist);
  };

  public shared ({ caller }) func removeFromWishlist(productId : Text) : async () {
    // Require authenticated user (not guest)
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Please sign in to remove from wishlist");
    };

    switch (wishlists.get(caller)) {
      case (null) { Runtime.trap("Wishlist does not exist") };
      case (?existingWishlist) {
        let filteredWishlist = existingWishlist.filter(
          func(id) { id != productId }
        );
        wishlists.add(caller, filteredWishlist);
      };
    };
  };

  public query ({ caller }) func getWishlist() : async [Text] {
    // Require authenticated user (not guest)
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Please sign in to view wishlist");
    };

    switch (wishlists.get(caller)) {
      case (null) { [] };
      case (?wishlist) { wishlist.toArray() };
    };
  };

  // =========================
  // Analytics APIs (Admin only)
  // =========================

  public query ({ caller }) func getAnalytics() : async {
    totalOrders : Nat;
    totalRevenue : Nat;
    totalProducts : Nat;
    totalVendors : Nat;
  } {
    // Admin only
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view analytics");
    };

    let allOrders = orders.values().toArray();
    let totalRevenue = allOrders.foldLeft(0, func(acc, order) { acc + order.total });

    {
      totalOrders = allOrders.size();
      totalRevenue;
      totalProducts = products.size();
      totalVendors = vendors.size();
    };
  };
};
