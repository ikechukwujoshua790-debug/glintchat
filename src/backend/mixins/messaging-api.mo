import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Storage "mo:caffeineai-object-storage/Storage";
import MsgLib "../lib/messaging";
import CommonTypes "../types/common";
import MsgTypes "../types/messaging";

mixin (
  accessControlState : AccessControl.AccessControlState,
  directMessages : Map.Map<Text, List.List<MsgTypes.Message>>,
  groups : Map.Map<CommonTypes.GroupId, MsgTypes.Group>,
  groupMessages : Map.Map<CommonTypes.GroupId, List.List<MsgTypes.Message>>,
) {
  var nextMsgId : Nat = 0;
  var nextGroupId : Nat = 0;

  /// Request a media upload certificate from object-storage.
  /// blobHash is a hex-encoded SHA-256 hash of the file content the client will upload.
  /// Returns a certificate the client uses to upload via the storage gateway.
  public shared ({ caller }) func requestMediaUploadUrl(blobHash : Text) : async MsgTypes.MediaUploadCertificate {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated to request upload URL");
    };
    if (blobHash.size() == 0) {
      Runtime.trap("blobHash cannot be empty");
    };
    // Retrieve the storage gateway to issue the upload certificate
    let cashierPrincipal = await Storage.getCashierPrincipal();
    let cashierActor = actor (cashierPrincipal.toText()) : actor {
      storage_upload_certificate_v1 : ({ blob_hash : Text; account : Principal }) -> async { method : Text; blob_hash : Text };
    };
    let cert = await cashierActor.storage_upload_certificate_v1({
      blob_hash = blobHash;
      account = caller;
    });
    { method = cert.method; blobHash = cert.blob_hash };
  };

  /// Get a download URL for a stored media file by its blob hash key.
  /// Returns a URL the client can use to stream/download the media.
  public shared ({ caller }) func getMediaDownloadUrl(storageKey : Text) : async Text {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated to access media");
    };
    if (storageKey.size() == 0) {
      Runtime.trap("storageKey cannot be empty");
    };
    let cashierPrincipal = await Storage.getCashierPrincipal();
    let cashierActor = actor (cashierPrincipal.toText()) : actor {
      storage_download_url_v1 : ({ blob_hash : Text; account : Principal }) -> async { url : Text };
    };
    let result = await cashierActor.storage_download_url_v1({
      blob_hash = storageKey;
      account = caller;
    });
    result.url;
  };

  /// Send a direct message to another user.
  /// mediaUrl: optional object-storage blob hash for attached media.
  /// mediaType: #audio | #image | #video | #none
  public shared ({ caller }) func sendDirectMessage(
    recipientId : CommonTypes.UserId,
    content : Text,
    mediaUrl : ?Text,
    mediaType : MsgTypes.MediaType,
  ) : async MsgTypes.Message {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated to send messages");
    };
    // Require either text content or a media attachment (or both)
    if (content.size() == 0 and mediaUrl == null) {
      Runtime.trap("Message must have content or a media attachment");
    };
    let msgId = nextMsgId;
    nextMsgId += 1;
    MsgLib.sendDirect(directMessages, caller, recipientId, content, msgId, Time.now(), mediaUrl, mediaType);
  };

  /// Get direct message history with another user
  public query ({ caller }) func getDirectMessages(
    otherUserId : CommonTypes.UserId,
  ) : async [MsgTypes.Message] {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated");
    };
    MsgLib.getDirectHistory(directMessages, caller, otherUserId);
  };

  /// Create a new group chat
  public shared ({ caller }) func createGroup(name : Text) : async MsgTypes.Group {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated to create a group");
    };
    if (name.size() == 0) {
      Runtime.trap("Group name cannot be empty");
    };
    let groupId = nextGroupId;
    nextGroupId += 1;
    MsgLib.createGroup(groups, caller, name, groupId, Time.now());
  };

  /// Get group details
  public query ({ caller }) func getGroup(groupId : CommonTypes.GroupId) : async ?MsgTypes.Group {
    MsgLib.getGroup(groups, groupId);
  };

  /// Add a member to a group (group admin only)
  public shared ({ caller }) func addGroupMember(
    groupId : CommonTypes.GroupId,
    newMember : CommonTypes.UserId,
  ) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated");
    };
    MsgLib.addMember(groups, groupId, caller, newMember, Time.now());
  };

  /// Leave a group
  public shared ({ caller }) func leaveGroup(groupId : CommonTypes.GroupId) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated");
    };
    MsgLib.removeMember(groups, groupId, caller, caller);
  };

  /// Send a message to a group.
  /// mediaUrl: optional object-storage blob hash for attached media.
  /// mediaType: #audio | #image | #video | #none
  public shared ({ caller }) func sendGroupMessage(
    groupId : CommonTypes.GroupId,
    content : Text,
    mediaUrl : ?Text,
    mediaType : MsgTypes.MediaType,
  ) : async MsgTypes.Message {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated to send messages");
    };
    if (content.size() == 0 and mediaUrl == null) {
      Runtime.trap("Message must have content or a media attachment");
    };
    let msgId = nextMsgId;
    nextMsgId += 1;
    MsgLib.sendGroupMessage(groupMessages, groups, caller, groupId, content, msgId, Time.now(), mediaUrl, mediaType);
  };

  /// Get message history for a group
  public query ({ caller }) func getGroupMessages(
    groupId : CommonTypes.GroupId,
  ) : async [MsgTypes.Message] {
    MsgLib.getGroupHistory(groupMessages, groupId);
  };

  /// List all groups the caller belongs to
  public query ({ caller }) func listMyGroups() : async [MsgTypes.Group] {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated");
    };
    MsgLib.listUserGroups(groups, caller);
  };
};
