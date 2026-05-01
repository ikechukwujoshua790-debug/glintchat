import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import CallLib "../lib/calls";
import CallTypes "../types/calls";
import CommonTypes "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  callRooms : CallLib.CallRoomsState,
  dailyApiKeyRef : { var value : ?Text },
  transform : OutCall.Transform,
) {
  /// Admin: set the Daily.co API key used to create call rooms.
  public shared ({ caller }) func setDailyApiKey(key : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can set the Daily.co API key");
    };
    dailyApiKeyRef.value := ?key;
  };

  /// Create a voice or video call room with the given recipient.
  /// Calls the Daily.co REST API to provision a temporary room (1-hour expiry).
  public shared ({ caller }) func createCallRoom(
    recipientId : CommonTypes.UserId,
    callType : CallTypes.CallType,
  ) : async { #ok : CallTypes.CallRoom; #err : Text } {
    if (caller.isAnonymous()) {
      return #err("Must be authenticated to start a call");
    };
    let apiKey = switch (dailyApiKeyRef.value) {
      case (null) { return #err("Daily.co is not configured") };
      case (?k) { k };
    };
    try {
      let room = await CallLib.createCallRoom(
        callRooms,
        apiKey,
        callType,
        caller,
        recipientId,
        transform,
      );
      #ok(room);
    } catch (_) {
      #err("Failed to create call room");
    };
  };

  /// Retrieve a call room by its room ID.
  public query func getCallRoom(roomId : Text) : async ?CallTypes.CallRoom {
    CallLib.getCallRoom(callRooms, roomId);
  };
};
