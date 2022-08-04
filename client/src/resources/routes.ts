import NotFound from "pages/NotFound";
import LandingPage from "pages/public/Landing.page";
import SignInPage from "pages/public/auth/SignIn.page";
import PlaylistPage from "pages/private/PlaylistPage";
import SignUpPage from "pages/public/auth/SignUp.page";

export const publicRoutes: Routes = {
  home: { path: "/home", component: LandingPage },
  signIn: { path: "/sign-in", component: SignInPage },
  signUp: { path: "/sign-up", component: SignUpPage },
  notFound: { path: "*", component: NotFound },
};

export const privateRoutes: Routes = {
  home: { path: "/", component: LandingPage },
  playlist: { path: "/playlists", component: PlaylistPage },
  notFound: { path: "*", component: NotFound },
};
