import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  type City = { #kanpur; #unnao; #other };

  type OldOrder = {
    id : Text;
    customer : Principal;
    items : [{
      productId : Text;
      quantity : Nat;
      price : Nat;
    }];
    total : Nat;
    status : {
      #pending;
      #processing;
      #shipped;
      #delivered;
      #cancelled;
    };
    timestamp : Int;
    vendor : Principal;
    city : City;
  };

  type NewOrder = {
    id : Text;
    customer : Principal;
    items : [{
      productId : Text;
      quantity : Nat;
      price : Nat;
    }];
    total : Nat;
    status : {
      #pending;
      #processing;
      #shipped;
      #delivered;
      #cancelled;
    };
    timestamp : Int;
    vendor : Principal;
    city : City;
    commissionApplied : Bool;
  };

  type OldVendor = {
    principal : Principal;
    name : Text;
    verified : Bool;
    outletName : Text;
    outletStatus : { #enabled; #disabled };
    walletDue : Nat;
    documents : [Storage.ExternalBlob];
  };

  type NewVendor = {
    principal : Principal;
    name : Text;
    verified : Bool;
    outletName : Text;
    outletStatus : { #enabled; #disabled };
    walletDue : Nat;
    documents : [Storage.ExternalBlob];
    mobile : Text;
    city : City;
    area : Text;
    aadhaar : Text;
    gst : ?Text;
    outletPhoto : Storage.ExternalBlob;
  };

  type OldActor = {
    orders : Map.Map<Text, OldOrder>;
    vendors : Map.Map<Principal, OldVendor>;
  };

  type NewActor = {
    orders : Map.Map<Text, NewOrder>;
    vendors : Map.Map<Principal, NewVendor>;
  };

  public func run(old : OldActor) : NewActor {
    let newOrders = old.orders.map<Text, OldOrder, NewOrder>(
      func(_, oldOrder) {
        {
          oldOrder with
          commissionApplied = false;
        };
      }
    );

    let newVendors = old.vendors.map<Principal, OldVendor, NewVendor>(
      func(_, oldVendor) {
        {
          oldVendor with
          mobile = "";
          city = #other;
          area = "";
          aadhaar = "";
          gst = null;
          outletPhoto = "";
        };
      }
    );

    {
      orders = newOrders;
      vendors = newVendors;
    };
  };
};
