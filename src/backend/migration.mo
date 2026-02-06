import Map "mo:core/Map";
import Array "mo:core/Array";
import List "mo:core/List";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";

module {
  type City = {
    #kanpur;
    #unnao;
    #other;
  };

  type OutletStatus = {
    #enabled;
    #disabled;
  };

  type OrderStatus = {
    #pending;
    #processing;
    #shipped;
    #delivered;
    #cancelled;
  };

  type OrderItem = {
    productId : Text;
    quantity : Nat;
    price : Nat;
  };

  type Review = {
    reviewer : Principal.Principal;
    rating : Nat;
    comment : Text;
  };

  type Product = {
    id : Text;
    name : Text;
    description : Text;
    category : Text;
    price : Nat;
    discount : ?Nat;
    images : [Storage.ExternalBlob];
    vendor : Principal.Principal;
    ratings : [Review];
    stock : Nat;
    active : Bool;
  };

  type Category = {
    id : Text;
    name : Text;
    image : Storage.ExternalBlob;
  };

  type CartItem = {
    productId : Text;
    quantity : Nat;
  };

  type Discount = {
    code : Text;
    percentage : Nat;
    vendor : ?Principal.Principal;
  };

  type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
    address : Text;
  };

  type OldVendor = {
    principal : Principal.Principal;
    name : Text;
    verified : Bool;
    outletName : Text;
    outletStatus : OutletStatus;
    walletDue : Nat;
  };

  type NewVendor = {
    principal : Principal.Principal;
    name : Text;
    verified : Bool;
    outletName : Text;
    outletStatus : OutletStatus;
    walletDue : Nat;
    documents : [Storage.ExternalBlob];
  };

  type OldOrder = {
    id : Text;
    customer : Principal.Principal;
    items : [OrderItem];
    total : Nat;
    status : OrderStatus;
    timestamp : Int;
    vendor : Principal.Principal;
  };

  type NewOrder = {
    id : Text;
    customer : Principal.Principal;
    items : [OrderItem];
    total : Nat;
    status : OrderStatus;
    timestamp : Int;
    vendor : Principal.Principal;
    city : City;
  };

  type OldActor = {
    products : Map.Map<Text, Product>;
    categories : Map.Map<Text, Category>;
    carts : Map.Map<Principal.Principal, List.List<CartItem>>;
    discounts : Map.Map<Principal.Principal, List.List<Discount>>;
    vendors : Map.Map<Principal.Principal, OldVendor>;
    orders : Map.Map<Text, OldOrder>;
    wishlists : Map.Map<Principal.Principal, List.List<Text>>;
    userProfiles : Map.Map<Principal.Principal, UserProfile>;
    vendorPrincipals : Map.Map<Principal.Principal, Bool>;
    hasInitializedAdmin : Bool;
    accessControlState : AccessControl.AccessControlState;
  };

  type NewActor = {
    products : Map.Map<Text, Product>;
    categories : Map.Map<Text, Category>;
    carts : Map.Map<Principal.Principal, [CartItem]>;
    discounts : Map.Map<Principal.Principal, [Discount]>;
    vendors : Map.Map<Principal.Principal, NewVendor>;
    orders : Map.Map<Text, NewOrder>;
    wishlists : Map.Map<Principal.Principal, [Text]>;
    userProfiles : Map.Map<Principal.Principal, UserProfile>;
    vendorPrincipals : Map.Map<Principal.Principal, Bool>;
    hasInitializedAdmin : Bool;
    accessControlState : AccessControl.AccessControlState;
  };

  public func run(old : OldActor) : NewActor {
    // Convert carts from List.List to [CartItem]
    let newCarts = old.carts.map<Principal.Principal, List.List<CartItem>, [CartItem]>(
      func(_k, oldCart) {
        oldCart.toArray();
      }
    );

    // Convert discounts from List.List to [Discount]
    let newDiscounts = old.discounts.map<Principal.Principal, List.List<Discount>, [Discount]>(
      func(_k, oldDiscounts) {
        oldDiscounts.toArray();
      }
    );

    // Convert wishlists from List.List to [Text]
    let newWishlists = old.wishlists.map(
      func(_k, oldWishlist) {
        oldWishlist.toArray();
      }
    );

    let newOrders = old.orders.map<Text, OldOrder, NewOrder>(
      func(_k, oldOrder) {
        {
          oldOrder with
          city = #other;
        };
      }
    );

    let newVendors = old.vendors.map<Principal.Principal, OldVendor, NewVendor>(
      func(_k, oldVendor) {
        {
          oldVendor with
          documents = [];
        };
      }
    );

    {
      old with
      orders = newOrders;
      vendors = newVendors;
      carts = newCarts;
      discounts = newDiscounts;
      wishlists = newWishlists;
    };
  };
};
