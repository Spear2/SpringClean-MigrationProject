import { useAuthContext } from "./AuthProvider";

export const useAuth = () => {
  const { user, login, logout } = useAuthContext();
  return { user, login, logout };
};
