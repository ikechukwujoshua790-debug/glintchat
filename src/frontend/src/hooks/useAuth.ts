import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export function useAuth() {
  const {
    login,
    clear,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    loginStatus,
    identity,
  } = useInternetIdentity();

  const queryClient = useQueryClient();

  const logout = useCallback(() => {
    clear();
    queryClient.clear();
  }, [clear, queryClient]);

  const principalId = identity?.getPrincipal().toString() ?? null;

  return {
    login,
    logout,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    loginStatus,
    identity,
    principalId,
  };
}
