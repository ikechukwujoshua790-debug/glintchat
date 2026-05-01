import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import ChannelsLib "../lib/channels";
import CommonTypes "../types/common";
import ChannelTypes "../types/channels";

mixin (
  accessControlState : AccessControl.AccessControlState,
  channels : Map.Map<CommonTypes.ChannelId, ChannelTypes.Channel>,
  channelPosts : Map.Map<CommonTypes.ChannelId, List.List<ChannelTypes.ChannelPost>>,
) {
  var nextChannelId : Nat = 0;
  var nextChannelPostId : Nat = 0;

  /// Admin: create a new official channel
  public shared ({ caller }) func createChannel(
    name : Text,
    description : Text,
  ) : async ChannelTypes.Channel {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create channels");
    };
    if (name.size() == 0) {
      Runtime.trap("Channel name cannot be empty");
    };
    let channelId = nextChannelId;
    nextChannelId += 1;
    ChannelsLib.createChannel(channels, name, description, channelId, Time.now());
  };

  /// List all official channels
  public query func listChannels() : async [ChannelTypes.Channel] {
    ChannelsLib.listChannels(channels);
  };

  /// Admin: post an announcement to a channel
  public shared ({ caller }) func postToChannel(
    channelId : CommonTypes.ChannelId,
    content : Text,
  ) : async ChannelTypes.ChannelPost {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can post to official channels");
    };
    if (content.size() == 0) {
      Runtime.trap("Post content cannot be empty");
    };
    let postId = nextChannelPostId;
    nextChannelPostId += 1;
    ChannelsLib.postAnnouncement(channels, channelPosts, caller, channelId, content, postId, Time.now());
  };

  /// Get all posts in a channel (read-only for users)
  public query func getChannelPosts(channelId : CommonTypes.ChannelId) : async [ChannelTypes.ChannelPost] {
    ChannelsLib.getChannelPosts(channelPosts, channelId);
  };
};
