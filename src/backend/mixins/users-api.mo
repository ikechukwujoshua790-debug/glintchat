import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import UserLib "../lib/users";
import UserTypes "../types/users";
import CommonTypes "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  userProfiles : Map.Map<CommonTypes.UserId, UserTypes.UserProfile>,
) {

  /// Register a new user with real name and phone number
  public shared ({ caller }) func registerUser(realName : Text, phone : Text) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated to register");
    };
    // Prevent duplicate registrations by same principal
    switch (userProfiles.get(caller)) {
      case (?_) { Runtime.trap("User already registered") };
      case (null) {};
    };
    // Prevent duplicate phone numbers
    if (UserLib.isPhoneRegistered(userProfiles, phone)) {
      Runtime.trap("Phone number already registered");
    };
    if (realName.size() == 0) {
      Runtime.trap("Real name cannot be empty");
    };
    if (phone.size() == 0) {
      Runtime.trap("Phone number cannot be empty");
    };
    let now = Time.now();
    ignore UserLib.createProfile(userProfiles, caller, realName, phone, now);
  };

  /// Get the caller's own profile
  public query ({ caller }) func getCallerUserProfile() : async ?UserTypes.UserProfile {
    UserLib.getProfile(userProfiles, caller);
  };

  /// Save/update the caller's own profile (name and phone only)
  public shared ({ caller }) func saveCallerUserProfile(profile : UserTypes.UserProfile) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated");
    };
    // Ensure the profile id matches the caller
    if (not Principal.equal(profile.id, caller)) {
      Runtime.trap("Cannot update another user's profile");
    };
    userProfiles.add(caller, profile);
  };

  /// Get any user's public profile
  public query ({ caller }) func getUserProfile(userId : CommonTypes.UserId) : async ?UserTypes.UserProfile {
    UserLib.getProfile(userProfiles, userId);
  };

  /// Look up a registered user by phone number (callable by any authenticated user)
  public query ({ caller }) func getUserByPhone(phone : Text) : async ?UserTypes.UserProfile {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated to search by phone");
    };
    UserLib.getProfileByPhone(userProfiles, phone);
  };

  /// Admin: list all user profiles
  public query ({ caller }) func adminListUsers() : async [UserTypes.UserProfile] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin only");
    };
    UserLib.listAllProfiles(userProfiles);
  };
};
