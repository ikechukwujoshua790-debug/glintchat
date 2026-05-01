import { useActor } from "@caffeineai/core-infrastructure";
import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import { type CallType, MediaType } from "../backend";
import type {
  Channel,
  ChannelId,
  ChannelPost,
  Group,
  GroupId,
  Message,
  PayoutRequest,
  StatusPost,
  UserId,
  UserProfile,
  VerificationRequest,
} from "../types";

// Helper to get the actor instance pre-typed
function useBackendActor() {
  return useActor(createActor);
}

// ─── Profile ────────────────────────────────────────────────────────────────

export function useCallerProfile() {
  const { actor, isFetching: actorFetching } = useBackendActor();
  const query = useQuery<UserProfile | null>({
    queryKey: ["callerProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useUserProfile(userId: UserId | null) {
  const { actor, isFetching: actorFetching } = useBackendActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile", userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return null;
      return actor.getUserProfile(userId);
    },
    enabled: !!actor && !actorFetching && !!userId,
  });
}

export function useRegisterUser() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      realName,
      phone,
    }: { realName: string; phone: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.registerUser(realName, phone);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerProfile"] });
    },
  });
}

export function useSaveProfile() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerProfile"] });
    },
  });
}

export function useIsAdmin() {
  const { actor, isFetching: actorFetching } = useBackendActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
  });
}

// ─── User Lookup ──────────────────────────────────────────────────────────────

export function useGetUserByPhone() {
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async (phone: string): Promise<UserProfile | null> => {
      if (!actor) throw new Error("Actor not available");
      // getUserByPhone returns opt UserProfile (UserProfile | null)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (
        actor as unknown as Record<
          string,
          (phone: string) => Promise<UserProfile | null>
        >
      ).getUserByPhone(phone);
    },
  });
}

// ─── Direct Messages ─────────────────────────────────────────────────────────

export function useDirectMessages(otherUserId: UserId | null) {
  const { actor, isFetching: actorFetching } = useBackendActor();
  return useQuery<Message[]>({
    queryKey: ["directMessages", otherUserId?.toString()],
    queryFn: async () => {
      if (!actor || !otherUserId) return [];
      return actor.getDirectMessages(otherUserId);
    },
    enabled: !!actor && !actorFetching && !!otherUserId,
    refetchInterval: 3000,
  });
}

export function useSendDirectMessage() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      recipientId,
      content,
      mediaUrl,
      mediaType,
    }: {
      recipientId: UserId;
      content: string;
      mediaUrl?: string | null;
      mediaType?: MediaType;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.sendDirectMessage(
        recipientId,
        content,
        mediaUrl ?? null,
        mediaType ?? MediaType.none,
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["directMessages", variables.recipientId.toString()],
      });
    },
  });
}

// ─── Groups ──────────────────────────────────────────────────────────────────

export function useMyGroups() {
  const { actor, isFetching: actorFetching } = useBackendActor();
  return useQuery<Group[]>({
    queryKey: ["myGroups"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMyGroups();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGroup(groupId: GroupId | null) {
  const { actor, isFetching: actorFetching } = useBackendActor();
  return useQuery<Group | null>({
    queryKey: ["group", groupId?.toString()],
    queryFn: async () => {
      if (!actor || groupId === null) return null;
      return actor.getGroup(groupId);
    },
    enabled: !!actor && !actorFetching && groupId !== null,
  });
}

export function useGroupMessages(groupId: GroupId | null) {
  const { actor, isFetching: actorFetching } = useBackendActor();
  return useQuery<Message[]>({
    queryKey: ["groupMessages", groupId?.toString()],
    queryFn: async () => {
      if (!actor || groupId === null) return [];
      return actor.getGroupMessages(groupId);
    },
    enabled: !!actor && !actorFetching && groupId !== null,
    refetchInterval: 3000,
  });
}

export function useCreateGroup() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createGroup(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myGroups"] });
    },
  });
}

export function useSendGroupMessage() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      groupId,
      content,
      mediaUrl,
      mediaType,
    }: {
      groupId: GroupId;
      content: string;
      mediaUrl?: string | null;
      mediaType?: MediaType;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.sendGroupMessage(
        groupId,
        content,
        mediaUrl ?? null,
        mediaType ?? MediaType.none,
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["groupMessages", variables.groupId.toString()],
      });
    },
  });
}

export function useLeaveGroup() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (groupId: GroupId) => {
      if (!actor) throw new Error("Actor not available");
      return actor.leaveGroup(groupId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myGroups"] });
    },
  });
}

// ─── Media ────────────────────────────────────────────────────────────────────

export function useRequestMediaUploadUrl() {
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async (blobHash: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.requestMediaUploadUrl(blobHash);
    },
  });
}

export function useGetMediaDownloadUrl() {
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async (storageKey: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.getMediaDownloadUrl(storageKey);
    },
  });
}

// ─── Calls ────────────────────────────────────────────────────────────────────

export function useCreateCallRoom() {
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async ({
      recipientId,
      callType,
    }: {
      recipientId: UserId;
      callType: CallType;
    }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.createCallRoom(recipientId, callType);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
  });
}

// ─── Status Posts ─────────────────────────────────────────────────────────────

export function useActiveStatusPosts() {
  const { actor, isFetching: actorFetching } = useBackendActor();
  return useQuery<StatusPost[]>({
    queryKey: ["statusPosts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveStatusPosts();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 10000,
  });
}

export function useCreateStatusPost() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createStatusPost(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["statusPosts"] });
    },
  });
}

export function useDeleteStatusPost() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteStatusPost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["statusPosts"] });
    },
  });
}

// ─── Channels ─────────────────────────────────────────────────────────────────

export function useChannels() {
  const { actor, isFetching: actorFetching } = useBackendActor();
  return useQuery<Channel[]>({
    queryKey: ["channels"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listChannels();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useChannelPosts(channelId: ChannelId | null) {
  const { actor, isFetching: actorFetching } = useBackendActor();
  return useQuery<ChannelPost[]>({
    queryKey: ["channelPosts", channelId?.toString()],
    queryFn: async () => {
      if (!actor || channelId === null) return [];
      return actor.getChannelPosts(channelId);
    },
    enabled: !!actor && !actorFetching && channelId !== null,
    refetchInterval: 5000,
  });
}

export function useCreateChannel() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      description,
    }: { name: string; description: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createChannel(name, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channels"] });
    },
  });
}

export function usePostToChannel() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      channelId,
      content,
    }: { channelId: ChannelId; content: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.postToChannel(channelId, content);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["channelPosts", variables.channelId.toString()],
      });
    },
  });
}

// ─── Verification ─────────────────────────────────────────────────────────────

export function useMyVerificationRequest() {
  const { actor, isFetching: actorFetching } = useBackendActor();
  return useQuery<VerificationRequest | null>({
    queryKey: ["myVerificationRequest"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyVerificationRequest();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSubmitVerificationRequest() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (receiptStorageKey: string) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.submitVerificationRequest(receiptStorageKey);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myVerificationRequest"] });
      queryClient.invalidateQueries({ queryKey: ["callerProfile"] });
    },
  });
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export function useAdminTotalRevenue() {
  const { actor, isFetching: actorFetching } = useBackendActor();
  return useQuery<bigint>({
    queryKey: ["adminRevenue"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.adminGetTotalRevenue();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAdminVerificationRequests() {
  const { actor, isFetching: actorFetching } = useBackendActor();
  return useQuery<VerificationRequest[]>({
    queryKey: ["adminVerificationRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminListVerificationRequests();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 15000,
  });
}

export function useAdminApproveVerification() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: Principal) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.adminApproveVerification(userId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["adminVerificationRequests"],
      });
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
  });
}

export function useAdminRejectVerification() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: Principal) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.adminRejectVerification(userId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["adminVerificationRequests"],
      });
    },
  });
}

export function useAdminUsers() {
  const { actor, isFetching: actorFetching } = useBackendActor();
  return useQuery<UserProfile[]>({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminListUsers();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAdminPayoutRequests() {
  const { actor, isFetching: actorFetching } = useBackendActor();
  return useQuery<PayoutRequest[]>({
    queryKey: ["adminPayouts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminListPayoutRequests();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAdminRequestPayout() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.adminRequestPayout();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPayouts"] });
      queryClient.invalidateQueries({ queryKey: ["adminRevenue"] });
    },
  });
}
