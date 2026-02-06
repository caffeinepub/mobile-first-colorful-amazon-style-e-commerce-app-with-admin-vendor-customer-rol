import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";


// use migration on actor for state migration between different versions

actor {
  include MixinStorage();

  public type AnalyticsData = {
    totalVendors : Nat;
    totalOrders : Nat;
    totalSales : Nat;
    totalCommission : Nat;
  };

  public type City = {
    #kanpur;
    #unnao;
    #other;
  };

  public type UserRole = {
    #admin;
    #vendor;
    #customer;
  };

  public type StoreCategory = {
    #clothStore;
    #cosmeticStore;
    #groceryStore;
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
    mobile : Text;
    city : City;
    area : Text;
    aadhaar : Text;
    gst : ?Text;
    outletPhoto : Storage.ExternalBlob;
    storeCategory : StoreCategory;
  };

  // Safe public vendor profile for customer browsing - excludes sensitive fields
  public type PublicVendorProfile = {
    principal : Principal;
    name : Text;
    verified : Bool;
    outletName : Text;
    outletStatus : OutletStatus;
    mobile : Text;
    city : City;
    area : Text;
    outletPhoto : Storage.ExternalBlob;
    storeCategory : StoreCategory;
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
    commissionApplied : Bool;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
    address : Text;
  };

  public type VendorApplication = {
    principal : Principal;
    name : Text;
    outletName : Text;
    mobile : Text;
    city : City;
    area : Text;
    aadhaar : Text;
    gst : ?Text;
    outletPhoto : Storage.ExternalBlob;
    storeCategory : StoreCategory;
    documents : [Storage.ExternalBlob];
    timestamp : Time.Time;
  };

  let products = Map.empty<Text, Product>();
  let categories = Map.empty<Text, Category>();
  let carts = Map.empty<Principal, [CartItem]>();
  let discounts = Map.empty<Principal, [Discount]>();
  let vendors = Map.empty<Principal, Vendor>();
  let orders = Map.empty<Text, Order>();
  let wishlists = Map.empty<Principal, [Text]>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let vendorApplications = Map.empty<Principal, VendorApplication>();

  let vendorPrincipals = Map.empty<Principal, Bool>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  func callerIsVendor(caller : Principal) : Bool {
    switch (vendorPrincipals.get(caller)) {
      case (null) { false };
      case (?isVendor) { isVendor };
    };
  };

  func hasCustomerPurchasedProduct(customer : Principal, productId : Text) : Bool {
    let allOrders = orders.values().toArray();
    let customerOrders = allOrders.filter(func(order) { order.customer == customer });
    for (order in customerOrders.vals()) {
      for (item in order.items.vals()) {
        if (item.productId == productId) {
          return true;
        };
      };
    };
    false;
  };

  // Helper function to convert Vendor to PublicVendorProfile (safe for customer browsing)
  func toPublicVendorProfile(vendor : Vendor) : PublicVendorProfile {
    {
      principal = vendor.principal;
      name = vendor.name;
      verified = vendor.verified;
      outletName = vendor.outletName;
      outletStatus = vendor.outletStatus;
      mobile = vendor.mobile;
      city = vendor.city;
      area = vendor.area;
      outletPhoto = vendor.outletPhoto;
      storeCategory = vendor.storeCategory;
    };
  };

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

  public shared ({ caller }) func getOutletProfile() : async Vendor {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view outlet profiles");
    };
    if (not callerIsVendor(caller)) {
      Runtime.trap("Unauthorized: Only vendors can view outlet profiles");
    };
    let outlet = vendors.get(caller);
    switch (outlet) {
      case (null) {
        Runtime.trap("Outlet not found");
      };
      case (?outlet) {
        return outlet;
      };
    };
  };

  public shared ({ caller }) func updateOutletProfile(name : Text, outletName : Text, mobile : Text, area : Text, outletPhoto : Storage.ExternalBlob, city : City, gst : ?Text, storeCategory : StoreCategory) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update outlet profiles");
    };
    if (not callerIsVendor(caller)) {
      Runtime.trap("Unauthorized: Only vendors can update outlet profiles");
    };
    let oldVendor = switch (vendors.get(caller)) {
      case (null) { Runtime.trap("Vendor not found") };
      case (?vendor) { vendor };
    };
    let updatedVendor : Vendor = {
      principal = oldVendor.principal;
      name = name;
      verified = oldVendor.verified;
      outletName = outletName;
      outletStatus = oldVendor.outletStatus;
      walletDue = oldVendor.walletDue;
      documents = oldVendor.documents;
      mobile = mobile;
      city = city;
      area = area;
      aadhaar = oldVendor.aadhaar;
      gst = gst;
      outletPhoto = outletPhoto;
      storeCategory = storeCategory;
    };
    vendors.add(caller, updatedVendor);
  };

  public query ({ caller }) func getCallerRole() : async UserRole {
    if (AccessControl.isAdmin(accessControlState, caller)) { return #admin };
    if (callerIsVendor(caller)) { return #vendor };
    #customer;
  };

  // Customer-facing: Returns safe public vendor profiles (no sensitive data)
  // Accessible to all users including guests
  public query func getOutletsByName(name : Text) : async [PublicVendorProfile] {
    let outletValues = vendors.values().toArray();
    let filtered = outletValues.filter(
      func(v) {
        v.outletName.toLower().contains(#text(name.toLower()));
      }
    );
    filtered.map(toPublicVendorProfile);
  };

  // Customer-facing: Returns safe public vendor profiles (no sensitive data)
  // Accessible to all users including guests
  public query func getOutletsByCity(city : City) : async [PublicVendorProfile] {
    let outletValues = vendors.values().toArray();
    let filtered = outletValues.filter(
      func(v) {
        v.city == city;
      }
    );
    filtered.map(toPublicVendorProfile);
  };

  // Customer-facing: Returns safe public vendor profiles by store category (no sensitive data)
  // Accessible to all users including guests for browsing
  public query func getOutletsByStoreCategory(category : StoreCategory) : async [PublicVendorProfile] {
    let outletValues = vendors.values().toArray();
    let filtered = outletValues.filter(
      func(v) {
        v.storeCategory == category;
      }
    );
    filtered.map(toPublicVendorProfile);
  };

  public query ({ caller }) func isVendor() : async Bool {
    callerIsVendor(caller);
  };

  // Vendor self-registration: Any authenticated user can apply to become a vendor
  public shared ({ caller }) func applyAsVendor(application : VendorApplication) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can apply as vendors");
    };
    if (application.principal != caller) {
      Runtime.trap("Unauthorized: Cannot apply on behalf of another user");
    };
    if (callerIsVendor(caller)) {
      Runtime.trap("Already registered as vendor");
    };
    vendorApplications.add(caller, application);
  };

  public query ({ caller }) func getVendorApplications() : async [VendorApplication] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view vendor applications");
    };
    vendorApplications.values().toArray();
  };

  public shared ({ caller }) func addProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can add products");
    };
    if (not callerIsVendor(caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only vendors can add products");
    };
    if (callerIsVendor(caller) and product.vendor != caller) {
      Runtime.trap("Unauthorized: Vendors can only add their own products");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func updateProduct(productId : Text, product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update products");
    };
    let existingProduct = switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?p) { p };
    };
    if (not AccessControl.isAdmin(accessControlState, caller) and existingProduct.vendor != caller) {
      Runtime.trap("Unauthorized: Can only update your own products");
    };
    if (not callerIsVendor(caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only vendors can update products");
    };
    products.add(productId, product);
  };

  public shared ({ caller }) func deleteProduct(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can delete products");
    };
    let existingProduct = switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?p) { p };
    };
    if (not AccessControl.isAdmin(accessControlState, caller) and existingProduct.vendor != caller) {
      Runtime.trap("Unauthorized: Can only delete your own products");
    };
    if (not callerIsVendor(caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only vendors can delete products");
    };
    products.remove(productId);
  };

  // Public access: Anyone can view a single product (including guests)
  public query func getProduct(productId : Text) : async ?Product {
    products.get(productId);
  };

  // Customer-facing: Only returns products from vendors with enabled outlets
  // Accessible to all users including guests
  public query func getCustomerProducts() : async [Product] {
    let allProducts = products.values().toArray();
    let filteredProducts = allProducts.filter(
      func(product) {
        switch (vendors.get(product.vendor)) {
          case (null) { false };
          case (?vendor) { vendor.outletStatus == #enabled };
        };
      }
    );
    filteredProducts;
  };

  public query ({ caller }) func getVendorProducts() : async [Product] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view vendor products");
    };
    if (not callerIsVendor(caller)) {
      Runtime.trap("Unauthorized: Only vendors can view their products");
    };
    let allProducts = products.values().toArray();
    allProducts.filter(func(p) { p.vendor == caller });
  };

  public shared ({ caller }) func addCategory(category : Category) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add categories");
    };
    categories.add(category.id, category);
  };

  public query func getAllCategories() : async [Category] {
    categories.values().toArray();
  };

  public shared ({ caller }) func addToCart(item : CartItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Please sign in to add items to cart");
    };
    let currentCart = switch (carts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart };
    };
    let updatedCart = currentCart.concat([item]);
    carts.add(caller, updatedCart);
  };

  public shared ({ caller }) func removeFromCart(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Please sign in to remove items from cart");
    };
    let currentCart = switch (carts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart };
    };
    let updatedCart = currentCart.filter(func(item) { item.productId != productId });
    carts.add(caller, updatedCart);
  };

  public query ({ caller }) func getCart() : async [CartItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Please sign in to view cart");
    };
    switch (carts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart };
    };
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Please sign in to clear cart");
    };
    carts.remove(caller);
  };

  public shared ({ caller }) func addReview(productId : Text, review : Review) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Please sign in to add reviews");
    };
    if (review.reviewer != caller) {
      Runtime.trap("Unauthorized: Cannot add review on behalf of another user");
    };
    // Security: Only customers who purchased the product can review it
    if (not hasCustomerPurchasedProduct(caller, productId)) {
      Runtime.trap("Unauthorized: You can only review products you have purchased");
    };
    let product = switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?p) { p };
    };
    let newRatings = product.ratings.concat([review]);
    let updatedProduct = { product with ratings = newRatings };
    products.add(productId, updatedProduct);
  };

  public shared ({ caller }) func addToWishlist(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Please sign in to add to wishlist");
    };
    let currentWishlist = switch (wishlists.get(caller)) {
      case (null) { [] };
      case (?wl) { wl };
    };
    let updatedWishlist = currentWishlist.concat([productId]);
    wishlists.add(caller, updatedWishlist);
  };

  public shared ({ caller }) func removeFromWishlist(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Please sign in to remove from wishlist");
    };
    let currentWishlist = switch (wishlists.get(caller)) {
      case (null) { [] };
      case (?wl) { wl };
    };
    let updatedWishlist = currentWishlist.filter(func(id) { id != productId });
    wishlists.add(caller, updatedWishlist);
  };

  public query ({ caller }) func getWishlist() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Please sign in to view wishlist");
    };
    switch (wishlists.get(caller)) {
      case (null) { [] };
      case (?wl) { wl };
    };
  };

  public shared ({ caller }) func addOrUpdateVendor(vendorPrincipal : Principal, vendor : Vendor) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update vendors");
    };
    vendors.add(vendorPrincipal, vendor);
    vendorPrincipals.add(vendorPrincipal, true);
    AccessControl.assignRole(accessControlState, caller, vendorPrincipal, #user);
  };

  public query ({ caller }) func getAllVendors() : async [Vendor] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all vendors");
    };
    vendors.values().toArray();
  };

  public query ({ caller }) func getCallerVendor() : async ?Vendor {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authorized users can view vendor data");
    };
    vendors.get(caller);
  };

  public shared ({ caller }) func approveVendor(vendorPrincipal : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve vendors");
    };
    let application = switch (vendorApplications.get(vendorPrincipal)) {
      case (null) { Runtime.trap("Vendor application not found") };
      case (?app) { app };
    };
    
    let newVendor : Vendor = {
      principal = application.principal;
      name = application.name;
      verified = true;
      outletName = application.outletName;
      outletStatus = #enabled;
      walletDue = 0;
      documents = application.documents;
      mobile = application.mobile;
      city = application.city;
      area = application.area;
      aadhaar = application.aadhaar;
      gst = application.gst;
      outletPhoto = application.outletPhoto;
      storeCategory = application.storeCategory;
    };
    
    vendors.add(vendorPrincipal, newVendor);
    vendorPrincipals.add(vendorPrincipal, true);
    vendorApplications.remove(vendorPrincipal);
    AccessControl.assignRole(accessControlState, caller, vendorPrincipal, #user);
  };

  public shared ({ caller }) func rejectVendor(vendorPrincipal : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reject vendors");
    };
    vendorApplications.remove(vendorPrincipal);
  };

  public shared ({ caller }) func setVendorOutletStatus(vendorPrincipal : Principal, status : OutletStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view vendor documents");
    };
    let vendor = switch (vendors.get(vendorPrincipal)) {
      case (null) { Runtime.trap("Vendor not found") };
      case (?vendor) { vendor };
    };
    vendor.documents;
  };

  public shared ({ caller }) func markVendorAsPaid(vendorPrincipal : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
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

  // Only add commission when order is marked as delivered without retrying
  public shared ({ caller }) func createOrder(order : Order) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Please sign in to create orders");
    };
    if (order.customer != caller) {
      Runtime.trap("Unauthorized: Cannot create order on behalf of another customer");
    };
    orders.add(order.id, order);
  };

  // Add commission due for vendor only if status transitions from non-delivered to delivered
  // Only vendors can update their own orders, admins can update any order
  public shared ({ caller }) func updateOrderStatus(orderId : Text, status : OrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update order status");
    };

    let existingOrder = switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?o) { o };
    };

    // Authorization: Only the vendor who owns the order or an admin can update the order status
    if (not AccessControl.isAdmin(accessControlState, caller) and existingOrder.vendor != caller) {
      Runtime.trap("Unauthorized: Only the order's vendor or an admin can update order status");
    };

    // Only apply commission if updating from non-delivered to delivered and commission wasn't applied already
    if (existingOrder.status != #delivered and status == #delivered and not existingOrder.commissionApplied) {
      let vendor = switch (vendors.get(existingOrder.vendor)) {
        case (null) { Runtime.trap("Vendor not found") };
        case (?vendor) { vendor };
      };

      let commission = existingOrder.total / 10;
      let newWalletDue = vendor.walletDue + commission;

      let newStatus = if (newWalletDue >= 1000) { #disabled } else {
        #enabled;
      };

      let updatedVendor = {
        vendor with
        walletDue = newWalletDue;
        outletStatus = newStatus;
      };

      let updatedOrder = {
        existingOrder with
        status = status;
        commissionApplied = true;
      };

      orders.add(orderId, updatedOrder);
      vendors.add(existingOrder.vendor, updatedVendor);
      return;
    };

    // Otherwise, just update the status without modifying the vendor's wallet/non-commissionable transition
    let updatedOrder = {
      existingOrder with
      status = status;
    };
    orders.add(orderId, updatedOrder);
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  public query ({ caller }) func getOrdersByCity(city : City) : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view orders by city");
    };
    let allOrders = orders.values().toArray();
    allOrders.filter(func(order) { order.city == city });
  };

  public query ({ caller }) func getOrdersByStatus(status : OrderStatus) : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view orders by status");
    };
    let allOrders = orders.values().toArray();
    allOrders.filter(func(order) { order.status == status });
  };

  public query ({ caller }) func getCustomerOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Please sign in to view orders");
    };
    let allOrders = orders.values().toArray();
    allOrders.filter(func(order) { order.customer == caller });
  };

  public query ({ caller }) func getVendorOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view vendor orders");
    };
    if (not callerIsVendor(caller)) {
      Runtime.trap("Unauthorized: Only vendors can view their orders");
    };
    let allOrders = orders.values().toArray();
    allOrders.filter(func(order) { order.vendor == caller });
  };

  public shared ({ caller }) func addDiscount(discount : Discount) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can add discounts");
    };
    if (not callerIsVendor(caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only vendors and admins can add discounts");
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

  public query ({ caller }) func getAnalyticsData() : async AnalyticsData {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access analytics");
    };

    let totalVendors = vendors.size();
    let totalOrders = orders.size();
    var totalSales = 0;
    let orderIter = orders.values();
    orderIter.forEach(
      func(order) {
        totalSales += order.total;
      }
    );
    let totalCommission = totalSales / 10;

    {
      totalVendors;
      totalOrders;
      totalSales;
      totalCommission;
    };
  };
};
