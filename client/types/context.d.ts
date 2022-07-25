type SignInContext = (user: User, token: string, rememberMe: boolean) => void;
type SignOutContext = () => void;

interface AuthContextAuthenticated {
  isAuthenticated: true;
  user: User;
  token: string;
}

interface AuthContextUnauthenticated {
  isAuthenticated: false;
  signIn: SignInContext;
  signOut: SignOutContext;
}

type AuthContext = AuthContextAuthenticated | AuthContextUnauthenticated;
