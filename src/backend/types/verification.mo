import Common "common";

module {
  /// Status of a manual bank-transfer verification request
  public type VerificationStatus = {
    #pending;
    #approved;
    #rejected;
  };

  /// A user's manual-transfer verification request (receipt stored in object-storage)
  public type VerificationRequest = {
    userId : Common.UserId;
    submittedAt : Common.Timestamp;
    receiptStorageKey : Text; // blobHash used as object-storage key
    status : VerificationStatus;
    verifiedAt : ?Common.Timestamp; // set when admin approves
  };

  /// Admin payout request (manual tracking)
  public type PayoutRequest = {
    id : Common.PaymentId;
    requestedAt : Common.Timestamp;
    totalAmount : Nat; // total verified users * 600 cents ($6)
    status : PayoutStatus;
  };

  public type PayoutStatus = {
    #pending;
    #processed;
  };
};
