import Map "mo:core/Map";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import CommonTypes "../types/common";
import CallTypes "../types/calls";

module {
  public type CallRoomsState = Map.Map<Text, CallTypes.CallRoom>;

  /// Extract a JSON string field value from a raw JSON response.
  /// Looks for `"fieldName":"value"` or `"fieldName": "value"`.
  func extractJsonField(json : Text, field : Text) : ?Text {
    let patterns = ["\"" # field # "\":\"", "\"" # field # "\": \""];
    for (pattern in patterns.values()) {
      if (json.contains(#text pattern)) {
        let parts = json.split(#text pattern);
        switch (parts.next()) {
          case (null) {};
          case (?_) {
            switch (parts.next()) {
              case (?afterPattern) {
                switch (afterPattern.split(#text "\"").next()) {
                  case (?value) {
                    if (value.size() > 0) {
                      return ?value;
                    };
                  };
                  case (null) {};
                };
              };
              case (null) {};
            };
          };
        };
      };
    };
    null;
  };

  /// Call the Daily.co REST API to create a temporary room (expires in 1 hour).
  /// Returns the raw JSON response text from Daily.co.
  public func createDailyRoom(
    apiKey : Text,
    transform : OutCall.Transform,
  ) : async Text {
    // Daily.co rooms endpoint
    let url = "https://api.daily.co/v1/rooms";
    // 1 hour from now in epoch seconds
    let nowSeconds = Time.now() / 1_000_000_000;
    let expirySeconds = nowSeconds + 3600;
    let body = "{\"properties\":{\"exp\":" # expirySeconds.toText() # ",\"enable_chat\":false}}";
    let headers = [
      { name = "Authorization"; value = "Bearer " # apiKey },
      { name = "Content-Type"; value = "application/json" },
    ];
    try {
      await OutCall.httpPostRequest(url, headers, body, transform);
    } catch (e) {
      Runtime.trap("Daily.co API error: " # e.message());
    };
  };

  /// Parse the Daily.co room creation response and store the room.
  /// Returns the created CallRoom or traps on parse failure.
  public func createCallRoom(
    state : CallRoomsState,
    apiKey : Text,
    callType : CallTypes.CallType,
    participantA : CommonTypes.UserId,
    participantB : CommonTypes.UserId,
    transform : OutCall.Transform,
  ) : async CallTypes.CallRoom {
    let responseJson = await createDailyRoom(apiKey, transform);

    // Extract `name` (room ID) and `url` from Daily.co JSON response
    let roomId = switch (extractJsonField(responseJson, "name")) {
      case (?id) { id };
      case (null) { Runtime.trap("Daily.co response missing 'name' field") };
    };
    let roomUrl = switch (extractJsonField(responseJson, "url")) {
      case (?u) { u };
      case (null) { Runtime.trap("Daily.co response missing 'url' field") };
    };

    let room : CallTypes.CallRoom = {
      roomId;
      roomUrl;
      callType;
      createdAt = Time.now();
      participants = [participantA, participantB];
    };
    state.add(roomId, room);
    room;
  };

  /// Look up a call room by its ID.
  public func getCallRoom(state : CallRoomsState, roomId : Text) : ?CallTypes.CallRoom {
    state.get(roomId);
  };
};
