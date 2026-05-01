import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import CommonTypes "../types/common";
import StatusTypes "../types/status";

module {
  public type State = List.List<StatusTypes.StatusPost>;

  let TTL_24H : Int = 86_400_000_000_000; // 24 hours in nanoseconds

  /// Create a new 24-hour status post
  public func createPost(
    state : State,
    authorId : CommonTypes.UserId,
    content : Text,
    postId : CommonTypes.StatusId,
    now : CommonTypes.Timestamp,
  ) : StatusTypes.StatusPost {
    let post : StatusTypes.StatusPost = {
      id = postId;
      authorId = authorId;
      content = content;
      createdAt = now;
      expiresAt = now + TTL_24H;
    };
    state.add(post);
    post;
  };

  /// Get all active (non-expired) status posts
  public func getActivePosts(
    state : State,
    now : CommonTypes.Timestamp,
  ) : [StatusTypes.StatusPost] {
    state.filter(func(p : StatusTypes.StatusPost) : Bool { p.expiresAt > now }).toArray();
  };

  /// Delete a status post (owner only)
  public func deletePost(
    state : State,
    postId : CommonTypes.StatusId,
    callerId : CommonTypes.UserId,
  ) : () {
    // Verify post exists and caller is owner
    switch (state.find(func(p : StatusTypes.StatusPost) : Bool { p.id == postId })) {
      case (null) { Runtime.trap("Status post not found") };
      case (?post) {
        if (not Principal.equal(post.authorId, callerId)) {
          Runtime.trap("Only the author can delete this post");
        };
      };
    };
    // Remove the post using retain (keep all except target)
    let idx = state.findIndex(func(p : StatusTypes.StatusPost) : Bool { p.id == postId });
    switch (idx) {
      case (null) {};
      case (?i) {
        // Rebuild without element at index i
        let before = state.sliceToArray(0, i);
        let after = state.sliceToArray(i + 1, state.size());
        state.clear();
        state.addAll(before.values());
        state.addAll(after.values());
      };
    };
  };

  /// Prune all expired posts
  public func pruneExpired(
    state : State,
    now : CommonTypes.Timestamp,
  ) : () {
    let active = state.filter(func(p : StatusTypes.StatusPost) : Bool { p.expiresAt > now });
    state.clear();
    state.addAll(active.values());
  };
};
