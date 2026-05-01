import { g as useInternetIdentity, h as useQueryClient, r as reactExports } from "./index-DFLYPydE.js";
function useAuth() {
  const {
    login,
    clear,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    loginStatus,
    identity
  } = useInternetIdentity();
  const queryClient = useQueryClient();
  const logout = reactExports.useCallback(() => {
    clear();
    queryClient.clear();
  }, [clear, queryClient]);
  const principalId = (identity == null ? void 0 : identity.getPrincipal().toString()) ?? null;
  return {
    login,
    logout,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    loginStatus,
    identity,
    principalId
  };
}
export {
  useAuth as u
};
