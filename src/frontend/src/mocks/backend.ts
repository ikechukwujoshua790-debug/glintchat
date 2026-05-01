import type { backendInterface } from "../backend.d";
import { MediaType, PayoutStatus, UserRole, VerificationStatus } from "../backend.d";
import type { Principal } from "@icp-sdk/core/principal";

const mockPrincipal = { toText: () => "aaaaa-aa", compareTo: () => 0, isAnonymous: () => false } as unknown as Principal;

export const mockBackend: backendInterface = {
  addGroupMember: async () => undefined,
  adminApproveVerification: async () => ({ __kind__: "ok" as const, ok: null }),
  adminGetTotalRevenue: async () => BigInt(3600),
  adminListPayoutRequests: async () => [
    {
      id: BigInt(1),
      status: PayoutStatus.pending,
      totalAmount: BigInt(3600),
      requestedAt: BigInt(Date.now()) * BigInt(1_000_000),
    },
  ],
  adminListUsers: async () => [
    {
      id: mockPrincipal,
      realName: "Sophia Thompson",
      createdAt: BigInt(Date.now()) * BigInt(1_000_000),
      isVerified: true,
      phone: "+1 555-0101",
    },
    {
      id: mockPrincipal,
      realName: "Alex Rivera",
      createdAt: BigInt(Date.now()) * BigInt(1_000_000),
      isVerified: false,
      phone: "+1 555-0102",
    },
  ],
  adminListVerificationRequests: async () => [
    {
      userId: mockPrincipal,
      status: VerificationStatus.pending,
      submittedAt: BigInt(Date.now()) * BigInt(1_000_000),
      receiptStorageKey: "mock-receipt-hash-abc123",
    },
  ],
  adminRejectVerification: async () => ({ __kind__: "ok" as const, ok: null }),
  adminRequestPayout: async () => ({
    id: BigInt(2),
    status: PayoutStatus.pending,
    totalAmount: BigInt(3600),
    requestedAt: BigInt(Date.now()) * BigInt(1_000_000),
  }),
  assignCallerUserRole: async () => undefined,
  createChannel: async (name, description) => ({
    id: BigInt(1),
    name,
    description,
    createdAt: BigInt(Date.now()) * BigInt(1_000_000),
  }),
  createCheckoutSession: async () => "https://checkout.stripe.com/mock",
  createGroup: async (name) => ({
    id: BigInt(1),
    name,
    createdAt: BigInt(Date.now()) * BigInt(1_000_000),
    creatorId: mockPrincipal,
    members: [],
  }),
  createStatusPost: async (content) => ({
    id: BigInt(1),
    content,
    authorId: mockPrincipal,
    createdAt: BigInt(Date.now()) * BigInt(1_000_000),
    expiresAt: BigInt(Date.now() + 86400000) * BigInt(1_000_000),
  }),
  deleteStatusPost: async () => undefined,
  getActiveStatusPosts: async () => [
    {
      id: BigInt(1),
      content: "Just launched GlintChat! 🎉",
      authorId: mockPrincipal,
      createdAt: BigInt(Date.now()) * BigInt(1_000_000),
      expiresAt: BigInt(Date.now() + 86400000) * BigInt(1_000_000),
    },
  ],
  getCallerUserProfile: async () => ({
    id: mockPrincipal,
    realName: "Sophia Thompson",
    createdAt: BigInt(Date.now()) * BigInt(1_000_000),
    isVerified: false,
    phone: "+1 555-0101",
  }),
  getCallerUserRole: async () => UserRole.user,
  getChannelPosts: async () => [
    {
      id: BigInt(1),
      channelId: BigInt(1),
      authorId: mockPrincipal,
      content: "Welcome to the GlintChat Official Channel! Stay tuned for updates.",
      postedAt: BigInt(Date.now()) * BigInt(1_000_000),
    },
  ],
  getDirectMessages: async () => [
    {
      id: BigInt(1),
      content: "Hey! Are we still on for the meeting?",
      senderId: mockPrincipal,
      timestamp: BigInt(Date.now() - 600000) * BigInt(1_000_000),
      mediaType: MediaType.none,
    },
    {
      id: BigInt(2),
      content: "Yes, looking forward to it!",
      senderId: mockPrincipal,
      timestamp: BigInt(Date.now() - 300000) * BigInt(1_000_000),
      mediaType: MediaType.none,
    },
  ],
  getGroup: async () => ({
    id: BigInt(1),
    name: "Design Sync Group",
    createdAt: BigInt(Date.now()) * BigInt(1_000_000),
    creatorId: mockPrincipal,
    members: [],
  }),
  getGroupMessages: async () => [
    {
      id: BigInt(1),
      content: "Elena: Looks great!",
      senderId: mockPrincipal,
      timestamp: BigInt(Date.now() - 600000) * BigInt(1_000_000),
      mediaType: MediaType.none,
    },
  ],
  getMyVerificationRequest: async () => null,
  getStripeSessionStatus: async () => ({
    __kind__: "completed" as const,
    completed: { response: "ok" },
  }),
  getUserProfile: async () => ({
    id: mockPrincipal,
    realName: "Alex Rivera",
    createdAt: BigInt(Date.now()) * BigInt(1_000_000),
    isVerified: false,
    phone: "+1 555-0102",
  }),
  isCallerAdmin: async () => false,
  isStripeConfigured: async () => false,
  leaveGroup: async () => undefined,
  listChannels: async () => [
    {
      id: BigInt(1),
      name: "GlintChat Official",
      description: "Official announcements and updates from the GlintChat team",
      createdAt: BigInt(Date.now()) * BigInt(1_000_000),
    },
  ],
  listMyGroups: async () => [
    {
      id: BigInt(1),
      name: "Design Sync Group",
      createdAt: BigInt(Date.now()) * BigInt(1_000_000),
      creatorId: mockPrincipal,
      members: [],
    },
  ],
  postToChannel: async (channelId, content) => ({
    id: BigInt(1),
    channelId,
    authorId: mockPrincipal,
    content,
    postedAt: BigInt(Date.now()) * BigInt(1_000_000),
  }),
  registerUser: async () => undefined,
  saveCallerUserProfile: async () => undefined,
  sendDirectMessage: async (_recipientId, content) => ({
    id: BigInt(Date.now()),
    content,
    senderId: mockPrincipal,
    timestamp: BigInt(Date.now()) * BigInt(1_000_000),
    mediaType: MediaType.none,
  }),
  sendGroupMessage: async (_groupId, content) => ({
    id: BigInt(Date.now()),
    content,
    senderId: mockPrincipal,
    timestamp: BigInt(Date.now()) * BigInt(1_000_000),
    mediaType: MediaType.none,
  }),
  setStripeConfiguration: async () => undefined,
  submitVerificationRequest: async () => ({
    __kind__: "ok" as const,
    ok: {
      userId: mockPrincipal,
      status: VerificationStatus.pending,
      submittedAt: BigInt(Date.now()) * BigInt(1_000_000),
      receiptStorageKey: "mock-hash",
    },
  }),
  transform: async (input) => ({
    status: input.response.status,
    body: input.response.body,
    headers: input.response.headers,
  }),
  getUserByPhone: async () => null,
  requestMediaUploadUrl: async (blobHash) => ({ method: "PUT", blobHash }),
  getMediaDownloadUrl: async (storageKey) => `https://example.com/media/${storageKey}`,
  createCallRoom: async () => ({
    __kind__: "err" as const,
    err: "Calls not configured in mock",
  }),
  getCallRoom: async () => null,
  setDailyApiKey: async () => undefined,
};
