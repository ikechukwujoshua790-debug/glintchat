import Map "mo:core/Map";
import List "mo:core/List";
import MsgTypes "types/messaging";
import VerifTypes "types/verification";
import CommonTypes "types/common";

module {
  // ── Old types (inlined from .old/src/backend/) ────────────────────────────

  // Old Stripe-based verification record
  type OldVerificationRecord = {
    userId : CommonTypes.UserId;
    paymentId : Text;
    amountCents : Nat;
    paidAt : CommonTypes.Timestamp;
  };

  // ── Old actor state shape (matches deployed .old/src/backend/dist/backend.most) ─
  // directMessages and groupMessages already contain the upgraded MsgTypes.Message
  // (the previous migration already applied mediaUrl/mediaType fields).
  // stripeConfig, verificationRecords, and objectStorageState are being retired.
  type OldActor = {
    directMessages       : Map.Map<Text, List.List<MsgTypes.Message>>;
    groupMessages        : Map.Map<CommonTypes.GroupId, List.List<MsgTypes.Message>>;
    verificationRecords  : List.List<OldVerificationRecord>;
    var stripeConfig     : ?{ allowedCountries : [Text]; secretKey : Text };
    objectStorageState   : { var authorizedPrincipals : [Principal] };
  };

  // ── New actor state shape ─────────────────────────────────────────────────
  type NewActor = {
    directMessages       : Map.Map<Text, List.List<MsgTypes.Message>>;
    groupMessages        : Map.Map<CommonTypes.GroupId, List.List<MsgTypes.Message>>;
    verificationRequests : List.List<VerifTypes.VerificationRequest>;
  };

  // ── Helpers ───────────────────────────────────────────────────────────────

  /// Convert old Stripe-based verification record → new manual-transfer request.
  /// Users who already paid via Stripe are preserved as approved.
  func upgradeVerificationRecord(
    old : OldVerificationRecord,
  ) : VerifTypes.VerificationRequest {
    {
      userId            = old.userId;
      submittedAt       = old.paidAt;
      receiptStorageKey = old.paymentId; // legacy Stripe session ID used as key
      status            = #approved;
      verifiedAt        = ?old.paidAt;
    };
  };

  // ── Migration entry point ─────────────────────────────────────────────────

  public func run(old : OldActor) : NewActor {
    // directMessages and groupMessages pass through unchanged
    let directMessages = old.directMessages;
    let groupMessages  = old.groupMessages;
    // Migrate Stripe-verified users to approved manual verification requests
    let verificationRequests = List.empty<VerifTypes.VerificationRequest>();
    for (rec in old.verificationRecords.values()) {
      verificationRequests.add(upgradeVerificationRecord(rec));
    };
    { directMessages; groupMessages; verificationRequests };
  };
};
