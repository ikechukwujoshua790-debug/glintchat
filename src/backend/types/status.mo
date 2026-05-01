import Common "common";

module {
  public type StatusPost = {
    id : Common.StatusId;
    authorId : Common.UserId;
    content : Text;
    createdAt : Common.Timestamp;
    expiresAt : Common.Timestamp; // createdAt + 24 hours
  };
};
