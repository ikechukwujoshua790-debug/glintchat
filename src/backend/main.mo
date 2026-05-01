import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import CallTypes "types/calls";
import CommonTypes "types/common";
import UserTypes "types/users";
import MsgTypes "types/messaging";
import StatusTypes "types/status";
import ChannelTypes "types/channels";
import VerifTypes "types/verification";
import CallsMixin "mixins/calls-api";
import UsersMixin "mixins/users-api";
import MessagingMixin "mixins/messaging-api";
import StatusMixin "mixins/status-api";
import ChannelsMixin "mixins/channels-api";
import VerificationMixin "mixins/verification-api";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Object storage (media files + receipt images)
  include MixinObjectStorage();

  // User profiles state
  let userProfiles = Map.empty<CommonTypes.UserId, UserTypes.UserProfile>();

  // Messaging state
  let directMessages = Map.empty<Text, List.List<MsgTypes.Message>>();
  let groups = Map.empty<CommonTypes.GroupId, MsgTypes.Group>();
  let groupMessages = Map.empty<CommonTypes.GroupId, List.List<MsgTypes.Message>>();

  // Status state
  let statusPosts = List.empty<StatusTypes.StatusPost>();

  // Channels state
  let channels = Map.empty<CommonTypes.ChannelId, ChannelTypes.Channel>();
  let channelPosts = Map.empty<CommonTypes.ChannelId, List.List<ChannelTypes.ChannelPost>>();

  // Verification state (manual bank transfer requests + payouts)
  let verificationRequests = List.empty<VerifTypes.VerificationRequest>();
  let payoutRequests = List.empty<VerifTypes.PayoutRequest>();

  // Call sessions state
  let callRooms = Map.empty<Text, CallTypes.CallRoom>();
  let dailyApiKeyRef = { var value : ?Text = null };

  // HTTP outcall transform (needed for calls mixin)
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // ── Deprecated Stripe stubs (kept for IDL backward-compatibility) ─────────
  // These functions were removed when payment switched to manual bank transfer.
  // They always trap so callers are notified that Stripe is no longer supported.

  public type StripeConfiguration = { allowedCountries : [Text]; secretKey : Text };
  public type StripeSessionStatus = {
    #completed : { response : Text; userPrincipal : ?Text };
    #failed : { error : Text };
  };

  public query func isStripeConfigured() : async Bool {
    false;
  };

  public shared func setStripeConfiguration(_config : StripeConfiguration) : async () {
    Runtime.trap("Stripe payments have been removed. Use manual bank transfer instead.");
  };

  public func getStripeSessionStatus(_sessionId : Text) : async StripeSessionStatus {
    Runtime.trap("Stripe payments have been removed. Use manual bank transfer instead.");
  };

  public shared ({ caller = _ }) func createCheckoutSession(
    _items : [{ currency : Text; productName : Text; productDescription : Text; priceInCents : Nat; quantity : Nat }],
    _successUrl : Text,
    _cancelUrl : Text,
  ) : async Text {
    Runtime.trap("Stripe payments have been removed. Use manual bank transfer instead.");
  };

  // --- Domain Mixins ---
  include UsersMixin(accessControlState, userProfiles);
  include MessagingMixin(accessControlState, directMessages, groups, groupMessages);
  include StatusMixin(accessControlState, statusPosts);
  include ChannelsMixin(accessControlState, channels, channelPosts);
  include VerificationMixin(accessControlState, verificationRequests, payoutRequests);
  include CallsMixin(accessControlState, callRooms, dailyApiKeyRef, transform);
};
