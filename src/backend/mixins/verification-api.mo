import Debug "mo:core/Debug";
import List "mo:core/List";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import VerifLib "../lib/verification";
import VerifTypes "../types/verification";

mixin (
  accessControlState : AccessControl.AccessControlState,
  verificationRequests : List.List<VerifTypes.VerificationRequest>,
  payoutRequests : List.List<VerifTypes.PayoutRequest>,
) {
  var nextPayoutId : Nat = 0;

  /// User: submit a verification request after uploading receipt to object-storage
  public shared ({ caller }) func submitVerificationRequest(
    receiptStorageKey : Text,
  ) : async { #ok : VerifTypes.VerificationRequest; #err : Text } {
    Debug.todo();
  };

  /// User: get own current verification request (if any)
  public query ({ caller }) func getMyVerificationRequest() : async ?VerifTypes.VerificationRequest {
    Debug.todo();
  };

  /// Admin: approve a user's verification — sets isVerified=true and marks #approved
  public shared ({ caller }) func adminApproveVerification(
    userId : Principal,
  ) : async { #ok; #err : Text } {
    Debug.todo();
  };

  /// Admin: reject a user's verification request
  public shared ({ caller }) func adminRejectVerification(
    userId : Principal,
  ) : async { #ok; #err : Text } {
    Debug.todo();
  };

  /// Admin: list all verification requests (pending + approved + rejected)
  public query ({ caller }) func adminListVerificationRequests() : async [VerifTypes.VerificationRequest] {
    Debug.todo();
  };

  /// Admin: get total revenue from approved verifications (in cents)
  public query ({ caller }) func adminGetTotalRevenue() : async Nat {
    Debug.todo();
  };

  /// Admin: request a payout
  public shared ({ caller }) func adminRequestPayout() : async VerifTypes.PayoutRequest {
    Debug.todo();
  };

  /// Admin: list all payout requests
  public query ({ caller }) func adminListPayoutRequests() : async [VerifTypes.PayoutRequest] {
    Debug.todo();
  };
};
