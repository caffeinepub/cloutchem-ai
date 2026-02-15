import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";


actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type SubscriptionTier = {
    #free;
    #pro;
  };

  public type UserProfile = {
    principal : Principal;
    createdAt : Int;
    tier : SubscriptionTier;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public shared ({ caller }) func createUserProfile() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create profiles");
    };
    let profile : UserProfile = {
      principal = caller;
      createdAt = Time.now();
      tier = #free;
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    
    // Security: Verify that the profile being saved belongs to the caller
    if (profile.principal != caller) {
      Runtime.trap("Unauthorized: Cannot modify another user's profile");
    };
    
    // Security: Prevent users from modifying protected fields
    // Users cannot change their tier or createdAt timestamp
    switch (userProfiles.get(caller)) {
      case (?existingProfile) {
        // Preserve protected fields from existing profile
        let updatedProfile : UserProfile = {
          principal = caller;
          createdAt = existingProfile.createdAt;
          tier = existingProfile.tier;
        };
        userProfiles.add(caller, updatedProfile);
      };
      case null {
        Runtime.trap("Profile does not exist. Create profile first.");
      };
    };
  };

  public query ({ caller }) func getUserProfile(principal : Principal) : async ?UserProfile {
    if (caller != principal and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(principal);
  };

  public shared ({ caller }) func updateUserTier(user : Principal, tier : SubscriptionTier) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update subscription tiers");
    };
    
    switch (userProfiles.get(user)) {
      case (?existingProfile) {
        let updatedProfile : UserProfile = {
          principal = existingProfile.principal;
          createdAt = existingProfile.createdAt;
          tier = tier;
        };
        userProfiles.add(user, updatedProfile);
      };
      case null {
        Runtime.trap("User profile not found");
      };
    };
  };
};
