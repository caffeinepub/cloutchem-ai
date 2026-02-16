import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import List "mo:core/List";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Stripe "stripe/stripe";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import OutCall "http-outcalls/outcall";
import Nat "mo:core/Nat";

// Use data migration when modifying persistent data. Also for adding, removing, or modifying data types, or when values of persistent data change.
// declare with migration clause and run imported migration script

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type SubscriptionTier = {
    #free;
    #pro;
  };

  public type UserProfile = {
    caller : Principal.Principal;
    createdAt : Int;
    tier : SubscriptionTier;
  };

  public type CaptureType = { #photo; #video };

  public type SecurityQuestion = {
    question : Text;
    answer : Text;
  };

  public type Capture = {
    id : Text;
    createdAt : Int;
    captureType : CaptureType;
    blob : Storage.ExternalBlob;
    aiCaption : Text;
  };

  let userProfiles = Map.empty<Principal.Principal, UserProfile>();
  let userSecurityQuestions = Map.empty<Principal.Principal, List.List<SecurityQuestion>>();
  let userCaptures = Map.empty<Principal.Principal, List.List<Capture>>();
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

  private func ensureUserProfile(caller : Principal.Principal) : UserProfile {
    switch (userProfiles.get(caller)) {
      case (?profile) { profile };
      case null {
        let newProfile : UserProfile = {
          caller;
          createdAt = Time.now();
          tier = #free;
        };
        userProfiles.add(caller, newProfile);
        newProfile;
      };
    };
  };

  public shared ({ caller }) func getCallerUserProfile() : async UserProfile {
    ensureUserProfile(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal.Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (profile.caller != caller) {
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
          caller = existingProfile.caller;
          createdAt = existingProfile.createdAt;
          tier = tier;
        };
        userProfiles.add(user, updatedProfile);
      };
      case null {
        let newProfile : UserProfile = {
          caller = user;
          createdAt = Time.now();
          tier;
        };
        userProfiles.add(user, newProfile);
      };
    };
  };

  public query ({ caller }) func getAllUserProfiles() : async [UserProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all user profiles");
    };
    userProfiles.values().toArray();
  };

  // Capture Management

  public shared ({ caller }) func saveCapture(capture : Capture) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save captures");
    };
    let capturesList = switch (userCaptures.get(caller)) {
      case (?list) { list };
      case (null) { List.empty<Capture>() };
    };
    capturesList.add(capture);
    userCaptures.add(caller, capturesList);
  };

  public query ({ caller }) func getMyCaptures() : async [Capture] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access captures");
    };
    switch (userCaptures.get(caller)) {
      case (?list) { list.toArray() };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func deleteCapture(captureId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete captures");
    };
    switch (userCaptures.get(caller)) {
      case (?capturesList) {
        let filtered = capturesList.toArray().filter(
          func(capture) { capture.id != captureId }
        );
        userCaptures.add(caller, List.fromArray<Capture>(filtered));
      };
      case (null) {
        Runtime.trap("No captures found for user");
      };
    };
  };

  // Security questions
  public shared ({ caller }) func setSecurityQuestions(questions : [SecurityQuestion]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set security questions");
    };
    if (userSecurityQuestions.containsKey(caller)) {
      Runtime.trap("Security questions already set. Use resetSecurityQuestions to change them.");
    };
    if (questions.size() != 2) {
      Runtime.trap("Exactly two security questions must be provided");
    };
    let securityList = List.fromArray<SecurityQuestion>(questions);
    userSecurityQuestions.add(caller, securityList);
  };

  public query ({ caller }) func hasSecurityQuestions() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check security question status");
    };
    userSecurityQuestions.containsKey(caller);
  };

  public shared ({ caller }) func verifySecurityQuestions(answers : [SecurityQuestion]) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can verify security questions");
    };
    switch (userSecurityQuestions.get(caller)) {
      case (?storedQuestions) {
        let storedArray = storedQuestions.toArray();
        let correctAnswers = switch (storedQuestions.size(), answers.size()) {
          case (2, 2) {
            storedArray[0].answer == answers[0].answer and storedArray[1].answer == answers[1].answer
          };
          case _ { false };
        };
        if (not correctAnswers) {
          Runtime.trap("Security question verification failed");
        };
        true;
      };
      case (null) {
        Runtime.trap("User has not completed security question setup");
      };
    };
  };

  public shared ({ caller }) func resetSecurityQuestions(questions : [SecurityQuestion], answers : [SecurityQuestion]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can reset security questions");
    };
    if (questions.size() != 2) {
      Runtime.trap("Exactly two new security questions must be provided");
    };
    let storedQuestions = switch (userSecurityQuestions.get(caller)) {
      case (?q) { q };
      case (null) {
        Runtime.trap("No existing security questions found for the user");
      };
    };
    let storedArray = storedQuestions.toArray();
    if (
      storedArray[0].answer == answers[0].answer and storedArray[1].answer == answers[1].answer
    ) {
      let securityList = List.fromArray<SecurityQuestion>(questions);
      userSecurityQuestions.add(caller, securityList);
    } else {
      Runtime.trap("Security question verification failed");
    };
  };
};
