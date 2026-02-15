import Map "mo:core/Map";
import Principal "mo:core/Principal";
import List "mo:core/List";

module {
  public type OldUserProfile = {
    principal : Principal.Principal;
    createdAt : Int;
    tier : {
      #free;
      #pro;
    };
  };

  public type OldActor = {
    userProfiles : Map.Map<Principal.Principal, OldUserProfile>;
  };

  public type NewUserProfile = {
    principal : Principal.Principal;
    createdAt : Int;
    tier : {
      #free;
      #pro;
    };
  };

  public type SecurityQuestion = {
    question : Text;
    answer : Text;
  };

  public type NewActor = {
    userProfiles : Map.Map<Principal.Principal, NewUserProfile>;
    userSecurityQuestions : Map.Map<Principal.Principal, List.List<SecurityQuestion>>;
  };

  public func run(old : OldActor) : NewActor {
    {
      userProfiles = old.userProfiles;
      userSecurityQuestions = Map.empty<Principal.Principal, List.List<SecurityQuestion>>();
    };
  };
};
