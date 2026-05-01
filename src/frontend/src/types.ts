// Re-export backend types for convenience
export type {
  UserProfile,
  Message,
  Group,
  GroupMember,
  GroupId,
  MessageId,
  StatusPost,
  StatusId,
  Channel,
  ChannelId,
  ChannelPost,
  VerificationRequest,
  PayoutRequest,
  UserId,
  Timestamp,
  CallRoom,
  MediaUploadCertificate,
} from "./backend";

export {
  PayoutStatus,
  VerificationStatus,
  UserRole,
  MediaType,
  CallType,
} from "./backend";

// Derived UI types
export interface NavItem {
  label: string;
  path: string;
  icon: string;
}
