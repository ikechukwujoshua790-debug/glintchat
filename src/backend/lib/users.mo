import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import CommonTypes "../types/common";
import UserTypes "../types/users";

module {
  public type State = Map.Map<CommonTypes.UserId, UserTypes.UserProfile>;

  /// Create a new user profile
  public func createProfile(
    state : State,
    userId : CommonTypes.UserId,
    realName : Text,
    phone : Text,
    now : CommonTypes.Timestamp,
  ) : UserTypes.UserProfile {
    let profile : UserTypes.UserProfile = {
      id = userId;
      realName = realName;
      phone = phone;
      isVerified = false;
      createdAt = now;
    };
    state.add(userId, profile);
    profile;
  };

  /// Get a user profile by ID
  public func getProfile(
    state : State,
    userId : CommonTypes.UserId,
  ) : ?UserTypes.UserProfile {
    state.get(userId);
  };

  /// Check if a phone number is already registered
  public func isPhoneRegistered(state : State, phone : Text) : Bool {
    state.values().any(func(p) { p.phone == phone });
  };

  /// Mark user as verified
  public func setVerified(state : State, userId : CommonTypes.UserId) : () {
    switch (state.get(userId)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        state.add(userId, { profile with isVerified = true });
      };
    };
  };

  /// Find a user profile by phone number
  public func getProfileByPhone(state : State, phone : Text) : ?UserTypes.UserProfile {
    state.values().find(func(p) { p.phone == phone });
  };

  /// List all profiles (for admin use)
  public func listAllProfiles(state : State) : [UserTypes.UserProfile] {
    state.values().toArray();
  };
};
