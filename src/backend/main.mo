import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  // Redefine City type
  public type City = {
    #kanpur;
    #unnao;
    #other;
  };

  // =========================
  // Types & Shared State
  // =========================

  public type UserRole = {
    #admin;
    #vendor;
    #customer;
  };

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
    outletName : Text;
    outletStatus : OutletStatus;
    walletDue : Nat;
    documents : [Storage.ExternalBlob];
  };

  public type OutletStatus = {
    #enabled;
    #disabled;
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
    city : City;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
    address : Text;
  };

  let products = Map.empty<Text, Product>();
  let categories = Map.empty<Text, Category>();
  let carts = Map.empty<Principal, [CartItem]>();
  let discounts = Map.empty<Principal, [Discount]>();
  let vendors = Map.empty<Principal, Vendor>();
  let orders = Map.empty<Text, Order>();
  let wishlists = Map.empty<Principal, [Text]>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let vendorPrincipals = Map.empty<Principal, Bool>();

  // Track if we've initialized the first admin
  var hasInitializedAdmin = false;

  // =========================
  // Authorization with Persistent State
  // =========================

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Initialize first caller as admin (only once, in shared functions)
  func ensureAdminExists(caller : Principal) {
    if (not hasInitializedAdmin and caller != Principal.fromText("2vxsx-fae")) {
      if (not AccessControl.isAdmin(accessControlState, caller)) {
        AccessControl.assignRole(accessControlState, caller, caller, #admin);
      };
      hasInitializedAdmin := true;
    };
  };

  // Helper to check if caller is a vendor
  func callerIsVendor(caller : Principal) : Bool {
    switch (vendorPrincipals.get(caller)) {
      case (null) { false };
      case (?isVendor) { isVendor };
    };
  };

  // Helper to check if caller is admin
  func callerIsAdmin(caller : Principal) : Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  // Helper to check if caller is authenticated (not anonymous)
  func callerIsAuthenticated(caller : Principal) : Bool {
    caller != Principal.fromText("2vxsx-fae");
  };

  // =========================
  // User Profile Management
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
    ensureAdminExists(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // =========================
  // Roles & Access
  // =========================

  public query ({ caller }) func getCallerRole() : async UserRole {
    if (AccessControl.isAdmin(accessControlState, caller)) { return #admin };
    if (callerIsVendor(caller)) { return #vendor };
    #customer;
  };

  public query ({ caller }) func isVendor() : async Bool {
    callerIsVendor(caller);
  };

  // =========================
  // Product Management
  // =========================

  public shared ({ caller }) func addProduct(product : Product) : async () {
    ensureAdminExists(caller);
    if (not callerIsVendor(caller) and not callerIsAdmin(caller)) {
      Runtime.trap("Unauthorized: Only vendors can add products");
    };
    if (callerIsVendor(caller) and product.vendor != caller) {
      Runtime.trap("Unauthorized: Vendors can only add their own products");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func updateProduct(productId : Text, product : Product) : async () {
    ensureAdminExists(caller);
    let existingProduct = switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?p) { p };
    };
    if (not callerIsAdmin(caller) and existingProduct.vendor != caller) {
      Runtime.trap("Unauthorized: Can only update your own products");
    };
    products.add(productId, product);
  };

  public shared ({ caller }) func deleteProduct(productId : Text) : async () {
    ensureAdminExists(caller);
    let existingProduct = switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?p) { p };
    };
    if (not callerIsAdmin(caller) and existingProduct.vendor != caller) {
      Runtime.trap("Unauthorized: Can only delete your own products");
    };
    products.remove(productId);
  };

  public query func getProduct(productId : Text) : async ?Product {
    products.get(productId);
  };

  public query func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public query ({ caller }) func getVendorProducts() : async [Product] {
    if (not callerIsVendor(caller)) {
      Runtime.trap("Unauthorized: Only vendors can view their products");
    };
    let allProducts = products.values().toArray();
    allProducts.filter(func(p) { p.vendor == caller });
  };

  // =========================
  // Category Management
  // =========================

  public shared ({ caller }) func addCategory(category : Category) : async () {
    ensureAdminExists(caller);
    if (not callerIsAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can add categories");
    };
    categories.add(category.id, category);
  };

  public query func getAllCategories() : async [Category] {
    categories.values().toArray();
  };

  // =========================
  // Cart Management
  // =========================

  public shared ({ caller }) func addToCart(item : CartItem) : async () {
    ensureAdminExists(caller);
    if (not callerIsAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Please sign in to add items to cart");
    };
    let currentCart = switch (carts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart };
    };
    let updatedCart = currentCart.concat([item]);
    carts.add(caller, updatedCart);
  };

  public query ({ caller }) func getCart() : async [CartItem] {
    if (not callerIsAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Please sign in to view cart");
    };
    switch (carts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart };
    };
  };

  public shared ({ caller }) func clearCart() : async () {
    ensureAdminExists(caller);
    if (not callerIsAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Please sign in to clear cart");
    };
    carts.remove(caller);
  };

  // =========================
  // Review Management
  // =========================

  public shared ({ caller }) func addReview(productId : Text, review : Review) : async () {
    ensureAdminExists(caller);
    if (not callerIsAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Please sign in to add reviews");
    };
    if (review.reviewer != caller) {
      Runtime.trap("Unauthorized: Cannot add review on behalf of another user");
    };
    let product = switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?p) { p };
    };
    let newRatings = product.ratings.concat([review]);
    let updatedProduct = { product with ratings = newRatings };
    products.add(productId, updatedProduct);
  };

  // =========================
  // Wishlist Management
  // =========================

  public shared ({ caller }) func addToWishlist(productId : Text) : async () {
    ensureAdminExists(caller);
    if (not callerIsAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Please sign in to add to wishlist");
    };
    let currentWishlist = switch (wishlists.get(caller)) {
      case (null) { [] };
      case (?wl) { wl };
    };
    let updatedWishlist = currentWishlist.concat([productId]);
    wishlists.add(caller, updatedWishlist);
  };

  public query ({ caller }) func getWishlist() : async [Text] {
    if (not callerIsAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Please sign in to view wishlist");
    };
    switch (wishlists.get(caller)) {
      case (null) { [] };
      case (?wl) { wl };
    };
  };

  // =========================
  // Vendor Management (Admin-only)
  // =========================

  public shared ({ caller }) func addOrUpdateVendor(vendorPrincipal : Principal, vendor : Vendor) : async () {
    ensureAdminExists(caller);
    if (not callerIsAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can update vendors");
    };
    vendors.add(vendorPrincipal, vendor);
    vendorPrincipals.add(vendorPrincipal, true);
    AccessControl.assignRole(accessControlState, caller, vendorPrincipal, #user);
  };

  public query ({ caller }) func getAllVendors() : async [Vendor] {
    if (not callerIsAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can view all vendors");
    };
    vendors.values().toArray();
  };

  public shared ({ caller }) func approveVendor(vendorPrincipal : Principal) : async () {
    ensureAdminExists(caller);
    if (not callerIsAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can approve vendors");
    };
    let vendor = switch (vendors.get(vendorPrincipal)) {
      case (null) { Runtime.trap("Vendor not found") };
      case (?vendor) { vendor };
    };
    let updatedVendor = { vendor with verified = true };
    vendors.add(vendorPrincipal, updatedVendor);
  };

  public shared ({ caller }) func rejectVendor(vendorPrincipal : Principal) : async () {
    ensureAdminExists(caller);
    if (not callerIsAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can reject vendors");
    };
    vendors.remove(vendorPrincipal);
    vendorPrincipals.remove(vendorPrincipal);
  };

  public shared ({ caller }) func setVendorOutletStatus(vendorPrincipal : Principal, status : OutletStatus) : async () {
    ensureAdminExists(caller);
    if (not callerIsAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can change outlet status");
    };
    let vendor = switch (vendors.get(vendorPrincipal)) {
      case (null) { Runtime.trap("Vendor not found") };
      case (?vendor) { vendor };
    };
    let updatedVendor = { vendor with outletStatus = status };
    vendors.add(vendorPrincipal, updatedVendor);
  };

  public query ({ caller }) func getVendorDocuments(vendorPrincipal : Principal) : async [Storage.ExternalBlob] {
    if (not callerIsAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can view vendor documents");
    };
    let vendor = switch (vendors.get(vendorPrincipal)) {
      case (null) { Runtime.trap("Vendor not found") };
      case (?vendor) { vendor };
    };
    vendor.documents;
  };

  // DOWN PAYMENT MANAGEMENT FEATURE

  public shared ({ caller }) func markVendorAsPaid(vendorPrincipal : Principal) : async () {
    ensureAdminExists(caller);
    if (not callerIsAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can mark vendor payments");
    };
    let vendor = switch (vendors.get(vendorPrincipal)) {
      case (null) { Runtime.trap("Vendor not found") };
      case (?vendor) { vendor };
    };

    let updatedVendor = {
      vendor with
      walletDue = 0;
      outletStatus = #enabled;
    };
    vendors.add(vendorPrincipal, updatedVendor);
  };

  // =========================
  // Order Management
  // =========================

  public shared ({ caller }) func createOrder(order : Order) : async () {
    ensureAdminExists(caller);
    if (not callerIsAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Please sign in to create orders");
    };
    if (order.customer != caller) {
      Runtime.trap("Unauthorized: Cannot create order on behalf of another customer");
    };
    orders.add(order.id, order);

    let vendor = switch (vendors.get(order.vendor)) {
      case (null) { Runtime.trap("Vendor not found") };
      case (?vendor) { vendor };
    };

    let commission = order.total / 10;
    let newWalletDue = vendor.walletDue + commission;
    let newStatus = if (newWalletDue >= 1000) { #disabled } else { #enabled };

    let updatedVendor = {
      vendor with
      walletDue = newWalletDue;
      outletStatus = newStatus;
    };
    vendors.add(order.vendor, updatedVendor);
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not callerIsAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  public query ({ caller }) func getOrdersByCity(city : City) : async [Order] {
    if (not callerIsAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can view orders by city");
    };
    let allOrders = orders.values().toArray();
    allOrders.filter(func(order) { order.city == city });
  };

  public query ({ caller }) func getOrdersByStatus(status : OrderStatus) : async [Order] {
    if (not callerIsAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can view orders by status");
    };
    let allOrders = orders.values().toArray();
    allOrders.filter(func(order) { order.status == status });
  };

  public query ({ caller }) func getCustomerOrders() : async [Order] {
    if (not callerIsAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Please sign in to view orders");
    };
    let allOrders = orders.values().toArray();
    allOrders.filter(func(order) { order.customer == caller });
  };

  public query ({ caller }) func getVendorOrders() : async [Order] {
    if (not callerIsVendor(caller)) {
      Runtime.trap("Unauthorized: Only vendors can view their orders");
    };
    let allOrders = orders.values().toArray();
    allOrders.filter(func(order) { order.vendor == caller });
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Text, status : OrderStatus) : async () {
    ensureAdminExists(caller);
    let order = switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?o) { o };
    };
    if (not callerIsAdmin(caller) and order.vendor != caller) {
      Runtime.trap("Unauthorized: Can only update your own orders");
    };
    let updatedOrder = { order with status = status };
    orders.add(orderId, updatedOrder);
  };

  // =========================
  // Discount Management
  // =========================

  public shared ({ caller }) func addDiscount(discount : Discount) : async () {
    ensureAdminExists(caller);
    if (not callerIsVendor(caller) and not callerIsAdmin(caller)) {
      Runtime.trap("Unauthorized: Only vendors can add discounts");
    };
    let currentDiscounts = switch (discounts.get(caller)) {
      case (null) { [] };
      case (?d) { d };
    };
    let updatedDiscounts = currentDiscounts.concat([discount]);
    discounts.add(caller, updatedDiscounts);
  };

  public query func getDiscounts() : async [Discount] {
    let allDiscounts = discounts.values();
    allDiscounts.toArray().flatten();
  };
};
