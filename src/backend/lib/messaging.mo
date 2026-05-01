import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import CommonTypes "../types/common";
import MsgTypes "../types/messaging";

module {
  public type DirectState = Map.Map<Text, List.List<MsgTypes.Message>>; // key = sorted(uid1, uid2)
  public type GroupState = Map.Map<CommonTypes.GroupId, MsgTypes.Group>;
  public type GroupMessagesState = Map.Map<CommonTypes.GroupId, List.List<MsgTypes.Message>>;

  /// Build a stable conversation key from two user IDs (lexicographic sort ensures symmetry)
  public func conversationKey(
    a : CommonTypes.UserId,
    b : CommonTypes.UserId,
  ) : Text {
    let ta = a.toText();
    let tb = b.toText();
    if (ta < tb) { ta # ":" # tb } else { tb # ":" # ta };
  };

  /// Send a direct message, with optional media attachment
  public func sendDirect(
    state : DirectState,
    senderId : CommonTypes.UserId,
    recipientId : CommonTypes.UserId,
    content : Text,
    msgId : CommonTypes.MessageId,
    now : CommonTypes.Timestamp,
    mediaUrl : ?Text,
    mediaType : MsgTypes.MediaType,
  ) : MsgTypes.Message {
    let key = conversationKey(senderId, recipientId);
    let msg : MsgTypes.Message = {
      id = msgId;
      senderId = senderId;
      content = content;
      timestamp = now;
      mediaUrl = mediaUrl;
      mediaType = mediaType;
    };
    switch (state.get(key)) {
      case (null) {
        let list = List.empty<MsgTypes.Message>();
        list.add(msg);
        state.add(key, list);
      };
      case (?list) {
        list.add(msg);
      };
    };
    msg;
  };

  /// Get direct message history between two users
  public func getDirectHistory(
    state : DirectState,
    a : CommonTypes.UserId,
    b : CommonTypes.UserId,
  ) : [MsgTypes.Message] {
    let key = conversationKey(a, b);
    switch (state.get(key)) {
      case (null) { [] };
      case (?list) { list.toArray() };
    };
  };

  /// Create a new group
  public func createGroup(
    state : GroupState,
    creatorId : CommonTypes.UserId,
    name : Text,
    groupId : CommonTypes.GroupId,
    now : CommonTypes.Timestamp,
  ) : MsgTypes.Group {
    let creatorMember : MsgTypes.GroupMember = {
      userId = creatorId;
      isAdmin = true;
      joinedAt = now;
    };
    let group : MsgTypes.Group = {
      id = groupId;
      name = name;
      creatorId = creatorId;
      members = [creatorMember];
      createdAt = now;
    };
    state.add(groupId, group);
    group;
  };

  /// Get a group by ID
  public func getGroup(
    state : GroupState,
    groupId : CommonTypes.GroupId,
  ) : ?MsgTypes.Group {
    state.get(groupId);
  };

  /// Add member to group (caller must be group admin)
  public func addMember(
    state : GroupState,
    groupId : CommonTypes.GroupId,
    callerId : CommonTypes.UserId,
    newMember : CommonTypes.UserId,
    now : CommonTypes.Timestamp,
  ) : () {
    let group = switch (state.get(groupId)) {
      case (null) { Runtime.trap("Group not found") };
      case (?g) { g };
    };
    let callerMember = switch (group.members.values().find(func(m : MsgTypes.GroupMember) : Bool { Principal.equal(m.userId, callerId) })) {
      case (null) { Runtime.trap("Caller is not a member of this group") };
      case (?m) { m };
    };
    if (not callerMember.isAdmin) {
      Runtime.trap("Only group admins can add members");
    };
    let alreadyMember = group.members.values().any(func(m : MsgTypes.GroupMember) : Bool { Principal.equal(m.userId, newMember) });
    if (alreadyMember) {
      Runtime.trap("User is already a member of this group");
    };
    let newMemberEntry : MsgTypes.GroupMember = {
      userId = newMember;
      isAdmin = false;
      joinedAt = now;
    };
    let memberList = List.fromArray<MsgTypes.GroupMember>(group.members);
    memberList.add(newMemberEntry);
    state.add(groupId, { group with members = memberList.toArray() });
  };

  /// Remove member from group (leave or kick by admin)
  public func removeMember(
    state : GroupState,
    groupId : CommonTypes.GroupId,
    callerId : CommonTypes.UserId,
    targetMember : CommonTypes.UserId,
  ) : () {
    let group = switch (state.get(groupId)) {
      case (null) { Runtime.trap("Group not found") };
      case (?g) { g };
    };
    let isLeaving = Principal.equal(callerId, targetMember);
    if (not isLeaving) {
      let callerMember = switch (group.members.values().find(func(m : MsgTypes.GroupMember) : Bool { Principal.equal(m.userId, callerId) })) {
        case (null) { Runtime.trap("Caller is not a member of this group") };
        case (?m) { m };
      };
      if (not callerMember.isAdmin) {
        Runtime.trap("Only group admins can remove other members");
      };
    };
    let updatedMembers = group.members.values().filter(func(m : MsgTypes.GroupMember) : Bool { not Principal.equal(m.userId, targetMember) }).toArray();
    state.add(groupId, { group with members = updatedMembers });
  };

  /// Send a message to a group, with optional media attachment
  public func sendGroupMessage(
    groupMsgs : GroupMessagesState,
    groups : GroupState,
    senderId : CommonTypes.UserId,
    groupId : CommonTypes.GroupId,
    content : Text,
    msgId : CommonTypes.MessageId,
    now : CommonTypes.Timestamp,
    mediaUrl : ?Text,
    mediaType : MsgTypes.MediaType,
  ) : MsgTypes.Message {
    let group = switch (groups.get(groupId)) {
      case (null) { Runtime.trap("Group not found") };
      case (?g) { g };
    };
    let isMember = group.members.values().any(func(m : MsgTypes.GroupMember) : Bool { Principal.equal(m.userId, senderId) });
    if (not isMember) {
      Runtime.trap("Only group members can send messages");
    };
    let msg : MsgTypes.Message = {
      id = msgId;
      senderId = senderId;
      content = content;
      timestamp = now;
      mediaUrl = mediaUrl;
      mediaType = mediaType;
    };
    switch (groupMsgs.get(groupId)) {
      case (null) {
        let list = List.empty<MsgTypes.Message>();
        list.add(msg);
        groupMsgs.add(groupId, list);
      };
      case (?list) {
        list.add(msg);
      };
    };
    msg;
  };

  /// Get group message history
  public func getGroupHistory(
    groupMsgs : GroupMessagesState,
    groupId : CommonTypes.GroupId,
  ) : [MsgTypes.Message] {
    switch (groupMsgs.get(groupId)) {
      case (null) { [] };
      case (?list) { list.toArray() };
    };
  };

  /// List all groups a user belongs to
  public func listUserGroups(
    state : GroupState,
    userId : CommonTypes.UserId,
  ) : [MsgTypes.Group] {
    state.values().filter(func(g : MsgTypes.Group) : Bool {
      g.members.values().any(func(m : MsgTypes.GroupMember) : Bool { Principal.equal(m.userId, userId) })
    }).toArray();
  };
};
