import Debug "mo:core/Debug";
import List "mo:core/List";
import CommonTypes "../types/common";
import VerifTypes "../types/verification";

module {
  public type RequestState = List.List<VerifTypes.VerificationRequest>;
  public type PayoutState = List.List<VerifTypes.PayoutRequest>;

  /// Submit a new pending verification request after receipt upload
  public func submitRequest(
    _state : RequestState,
    _userId : CommonTypes.UserId,
    _receiptStorageKey : Text,
    _now : CommonTypes.Timestamp,
  ) : VerifTypes.VerificationRequest {
    Debug.todo();
  };

  /// Check if a user already has an approved verification request
  public func isVerified(_state : RequestState, _userId : CommonTypes.UserId) : Bool {
    Debug.todo();
  };

  /// Get the caller's current verification request (if any)
  public func getRequest(_state : RequestState, _userId : CommonTypes.UserId) : ?VerifTypes.VerificationRequest {
    Debug.todo();
  };

  /// Admin: approve a pending request — mutates status and sets verifiedAt
  public func approveRequest(
    _state : RequestState,
    _userId : CommonTypes.UserId,
    _now : CommonTypes.Timestamp,
  ) : Bool {
    Debug.todo();
  };

  /// Admin: reject a pending request — mutates status to #rejected
  public func rejectRequest(_state : RequestState, _userId : CommonTypes.UserId) : Bool {
    Debug.todo();
  };

  /// Admin: list all verification requests
  public func listRequests(_state : RequestState) : [VerifTypes.VerificationRequest] {
    Debug.todo();
  };

  /// Admin: total revenue = verified users * 600 cents ($6 each)
  public func totalRevenueCents(_state : RequestState) : Nat {
    Debug.todo();
  };

  /// Submit a payout request
  public func requestPayout(
    _payoutState : PayoutState,
    _requestState : RequestState,
    _payoutId : CommonTypes.PaymentId,
    _now : CommonTypes.Timestamp,
  ) : VerifTypes.PayoutRequest {
    Debug.todo();
  };

  /// List all payout requests
  public func listPayoutRequests(_payoutState : PayoutState) : [VerifTypes.PayoutRequest] {
    Debug.todo();
  };
};
