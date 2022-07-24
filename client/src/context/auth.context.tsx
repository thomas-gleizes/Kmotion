import { createContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import authService from "services/auth.service";
import { useContextFactory } from "hooks";

const AuthContext = createContext<AuthContext>(null as any);
export const useAuthContext = useContextFactory<AuthContext>(AuthContext);
export const useAuthedContext = (): AuthContextAuthenticated => {
  const context = useAuthContext();
  if (!context.isAuthenticated) {
    throw new Error("Not authenticated");
  }

  return context;
};

const AuthContextProvider: ContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!authService.getToken());
  const [user, setUser] = useState<User | null>(authService.getUser());

  const signIn: SignInContext = (user: User, token: string, rememberMe: boolean) => {
    authService.setUser(user, rememberMe);
    authService.setToken(token);

    setUser(user);
    setIsAuthenticated(true);

    navigate("/");
  };

  const signOut: SignOutContext = () => {
    authService.logout();

    setUser(null);
    setIsAuthenticated(false);

    navigate("/home");
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const value = useMemo<AuthContext>(() => {
    if (!isAuthenticated)
      return {
        isAuthenticated,
        signIn,
      };

    return {
      isAuthenticated,
      user,
      signOut,
    };
  }, [isAuthenticated, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
