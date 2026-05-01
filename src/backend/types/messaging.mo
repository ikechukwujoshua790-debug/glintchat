import Common "common";

module {
  /// Media type variant for message attachments
  public type MediaType = {
    #audio;
    #image;
    #video;
    #none;
  };

  public type Message = {
    id : Common.MessageId;
    senderId : Common.UserId;
    content : Text;
    timestamp : Common.Timestamp;
    mediaUrl : ?Text;   // object-storage blob hash (hex Text) or null for text-only
    mediaType : MediaType;
  };

  public type DirectConversationId = (Common.UserId, Common.UserId); // sorted pair
  public type DirectConversation = {
    participants : (Common.UserId, Common.UserId);
    messages : [Message];
  };

  public type GroupMember = {
    userId : Common.UserId;
    isAdmin : Bool;
    joinedAt : Common.Timestamp;
  };

  public type Group = {
    id : Common.GroupId;
    name : Text;
    creatorId : Common.UserId;
    members : [GroupMember];
    createdAt : Common.Timestamp;
  };

  /// Result returned when requesting a media upload certificate
  public type MediaUploadCertificate = {
    method : Text;
    blobHash : Text;
  };
};
