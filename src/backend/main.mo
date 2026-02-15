import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type SubscriptionTier = {
    #free;
    #pro;
  };

  public type UserProfile = {
    principal : Principal.Principal;
    createdAt : Int;
    tier : SubscriptionTier;
  };

  let userProfiles = Map.empty<Principal.Principal, UserProfile>();

  var stripeConfiguration : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    stripeConfiguration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    stripeConfiguration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check session status");
    };
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  private func ensureUserProfile(principal : Principal.Principal) : UserProfile {
    switch (userProfiles.get(principal)) {
      case (?profile) { profile };
      case null {
        let newProfile : UserProfile = {
          principal;
          createdAt = Time.now();
          tier = #free;
        };
        userProfiles.add(principal, newProfile);
        newProfile;
      };
    };
  };

  public shared ({ caller }) func getCallerUserProfile() : async UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    ensureUserProfile(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal.Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    if (profile.principal != caller) {
      Runtime.trap("Unauthorized: Can only save your own profile");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func updateUserTier(user : Principal.Principal, tier : SubscriptionTier) : async () {
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
        let newProfile : UserProfile = {
          principal = user;
          createdAt = Time.now();
          tier;
        };
        userProfiles.add(user, newProfile);
      };
    };
  };

  public query ({ caller }) func getAllUserProfiles() : async [UserProfile] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Admin privileges required");
    };
    userProfiles.values().toArray();
  };
};
