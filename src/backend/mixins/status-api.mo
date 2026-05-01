import List "mo:core/List";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import StatusLib "../lib/status";
import CommonTypes "../types/common";
import StatusTypes "../types/status";

mixin (
  accessControlState : AccessControl.AccessControlState,
  statusPosts : List.List<StatusTypes.StatusPost>,
) {
  var nextStatusId : Nat = 0;

  /// Create a 24-hour status post
  public shared ({ caller }) func createStatusPost(content : Text) : async StatusTypes.StatusPost {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated to post a status");
    };
    if (content.size() == 0) {
      Runtime.trap("Status content cannot be empty");
    };
    let postId = nextStatusId;
    nextStatusId += 1;
    StatusLib.createPost(statusPosts, caller, content, postId, Time.now());
  };

  /// Get all active (non-expired) status posts from all users
  public query ({ caller }) func getActiveStatusPosts() : async [StatusTypes.StatusPost] {
    StatusLib.getActivePosts(statusPosts, Time.now());
  };

  /// Delete the caller's own status post
  public shared ({ caller }) func deleteStatusPost(postId : CommonTypes.StatusId) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated");
    };
    StatusLib.deletePost(statusPosts, postId, caller);
  };
};
