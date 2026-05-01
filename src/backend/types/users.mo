import Common "common";

module {
  public type UserProfile = {
    id : Common.UserId;
    realName : Text;
    phone : Text;
    isVerified : Bool;
    createdAt : Common.Timestamp;
  };
};
