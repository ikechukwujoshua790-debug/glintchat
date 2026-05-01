import CommonTypes "common";

module {
  public type CallType = { #voice; #video };

  public type CallRoom = {
    roomId : Text;
    roomUrl : Text;
    callType : CallType;
    createdAt : CommonTypes.Timestamp;
    participants : [CommonTypes.UserId];
  };
};
