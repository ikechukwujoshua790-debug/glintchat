import Common "common";

module {
  public type Channel = {
    id : Common.ChannelId;
    name : Text;
    description : Text;
    createdAt : Common.Timestamp;
  };

  public type ChannelPost = {
    id : Nat;
    channelId : Common.ChannelId;
    content : Text;
    authorId : Common.UserId;
    postedAt : Common.Timestamp;
  };
};
