import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Group {
    id: GroupId;
    members: Array<GroupMember>;
    name: string;
    createdAt: Timestamp;
    creatorId: UserId;
}
export interface MediaUploadCertificate {
    method: string;
    blobHash: string;
}
export type GroupId = bigint;
export interface StatusPost {
    id: StatusId;
    content: string;
    expiresAt: Timestamp;
    authorId: UserId;
    createdAt: Timestamp;
}
export interface ChannelPost {
    id: bigint;
    postedAt: Timestamp;
    content: string;
    channelId: ChannelId;
    authorId: UserId;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface CallRoom {
    participants: Array<UserId>;
    roomUrl: string;
    createdAt: Timestamp;
    callType: CallType;
    roomId: string;
}
export interface PayoutRequest {
    id: PaymentId;
    status: PayoutStatus;
    totalAmount: bigint;
    requestedAt: Timestamp;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export type ChannelId = bigint;
export interface GroupMember {
    userId: UserId;
    joinedAt: Timestamp;
    isAdmin: boolean;
}
export interface Channel {
    id: ChannelId;
    name: string;
    createdAt: Timestamp;
    description: string;
}
export type StatusId = bigint;
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type UserId = Principal;
export type PaymentId = bigint;
export type MessageId = bigint;
export interface Message {
    id: MessageId;
    content: string;
    mediaUrl?: string;
    timestamp: Timestamp;
    mediaType: MediaType;
    senderId: UserId;
}
export interface UserProfile {
    id: UserId;
    realName: string;
    createdAt: Timestamp;
    isVerified: boolean;
    phone: string;
}
export interface VerificationRequest {
    status: VerificationStatus;
    userId: UserId;
    submittedAt: Timestamp;
    receiptStorageKey: string;
    verifiedAt?: Timestamp;
}
export enum CallType {
    video = "video",
    voice = "voice"
}
export enum MediaType {
    audio = "audio",
    video = "video",
    none = "none",
    image = "image"
}
export enum PayoutStatus {
    pending = "pending",
    processed = "processed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum VerificationStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export interface backendInterface {
    addGroupMember(groupId: GroupId, newMember: UserId): Promise<void>;
    adminApproveVerification(userId: Principal): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminGetTotalRevenue(): Promise<bigint>;
    adminListPayoutRequests(): Promise<Array<PayoutRequest>>;
    adminListUsers(): Promise<Array<UserProfile>>;
    adminListVerificationRequests(): Promise<Array<VerificationRequest>>;
    adminRejectVerification(userId: Principal): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminRequestPayout(): Promise<PayoutRequest>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCallRoom(recipientId: UserId, callType: CallType): Promise<{
        __kind__: "ok";
        ok: CallRoom;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createChannel(name: string, description: string): Promise<Channel>;
    createCheckoutSession(_items: Array<{
        productName: string;
        currency: string;
        quantity: bigint;
        priceInCents: bigint;
        productDescription: string;
    }>, _successUrl: string, _cancelUrl: string): Promise<string>;
    createGroup(name: string): Promise<Group>;
    createStatusPost(content: string): Promise<StatusPost>;
    deleteStatusPost(postId: StatusId): Promise<void>;
    getActiveStatusPosts(): Promise<Array<StatusPost>>;
    getCallRoom(roomId: string): Promise<CallRoom | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChannelPosts(channelId: ChannelId): Promise<Array<ChannelPost>>;
    getDirectMessages(otherUserId: UserId): Promise<Array<Message>>;
    getGroup(groupId: GroupId): Promise<Group | null>;
    getGroupMessages(groupId: GroupId): Promise<Array<Message>>;
    getMediaDownloadUrl(storageKey: string): Promise<string>;
    getMyVerificationRequest(): Promise<VerificationRequest | null>;
    getStripeSessionStatus(_sessionId: string): Promise<StripeSessionStatus>;
    getUserByPhone(phone: string): Promise<UserProfile | null>;
    getUserProfile(userId: UserId): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    leaveGroup(groupId: GroupId): Promise<void>;
    listChannels(): Promise<Array<Channel>>;
    listMyGroups(): Promise<Array<Group>>;
    postToChannel(channelId: ChannelId, content: string): Promise<ChannelPost>;
    registerUser(realName: string, phone: string): Promise<void>;
    requestMediaUploadUrl(blobHash: string): Promise<MediaUploadCertificate>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendDirectMessage(recipientId: UserId, content: string, mediaUrl: string | null, mediaType: MediaType): Promise<Message>;
    sendGroupMessage(groupId: GroupId, content: string, mediaUrl: string | null, mediaType: MediaType): Promise<Message>;
    setDailyApiKey(key: string): Promise<void>;
    setStripeConfiguration(_config: StripeConfiguration): Promise<void>;
    submitVerificationRequest(receiptStorageKey: string): Promise<{
        __kind__: "ok";
        ok: VerificationRequest;
    } | {
        __kind__: "err";
        err: string;
    }>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
