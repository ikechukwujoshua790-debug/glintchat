import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import CommonTypes "../types/common";
import ChannelTypes "../types/channels";

module {
  public type ChannelState = Map.Map<CommonTypes.ChannelId, ChannelTypes.Channel>;
  public type PostState = Map.Map<CommonTypes.ChannelId, List.List<ChannelTypes.ChannelPost>>;

  /// Create a new official channel (admin only)
  public func createChannel(
    state : ChannelState,
    name : Text,
    description : Text,
    channelId : CommonTypes.ChannelId,
    now : CommonTypes.Timestamp,
  ) : ChannelTypes.Channel {
    let channel : ChannelTypes.Channel = {
      id = channelId;
      name = name;
      description = description;
      createdAt = now;
    };
    state.add(channelId, channel);
    channel;
  };

  /// List all channels
  public func listChannels(state : ChannelState) : [ChannelTypes.Channel] {
    state.values().toArray();
  };

  /// Post an announcement to a channel (admin only)
  public func postAnnouncement(
    channelState : ChannelState,
    postState : PostState,
    adminId : CommonTypes.UserId,
    channelId : CommonTypes.ChannelId,
    content : Text,
    postId : Nat,
    now : CommonTypes.Timestamp,
  ) : ChannelTypes.ChannelPost {
    // Verify channel exists
    switch (channelState.get(channelId)) {
      case (null) { Runtime.trap("Channel not found") };
      case (?_) {};
    };
    let post : ChannelTypes.ChannelPost = {
      id = postId;
      channelId = channelId;
      content = content;
      authorId = adminId;
      postedAt = now;
    };
    switch (postState.get(channelId)) {
      case (null) {
        let list = List.empty<ChannelTypes.ChannelPost>();
        list.add(post);
        postState.add(channelId, list);
      };
      case (?list) {
        list.add(post);
      };
    };
    post;
  };

  /// Get posts in a channel
  public func getChannelPosts(
    postState : PostState,
    channelId : CommonTypes.ChannelId,
  ) : [ChannelTypes.ChannelPost] {
    switch (postState.get(channelId)) {
      case (null) { [] };
      case (?list) { list.toArray() };
    };
  };
};
