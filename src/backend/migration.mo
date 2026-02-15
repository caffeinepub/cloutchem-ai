import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type UserProfile = {
    principal : Principal.Principal;
    createdAt : Int;
    tier : {
      #free;
      #pro;
    };
  };

  type OldActor = {
    userProfiles : Map.Map<Principal.Principal, UserProfile>;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal.Principal, UserProfile>;
    stripeConfiguration : ?{
      secretKey : Text;
      allowedCountries : [Text];
    };
  };

  public func run(old : OldActor) : NewActor {
    { old with stripeConfiguration = null };
  };
};
