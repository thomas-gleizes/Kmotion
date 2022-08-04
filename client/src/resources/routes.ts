import NotFound from "pages/NotFound";
import LandingPage from "pages/Landing.page";

import SignInPage from "pages/public/SignIn.page";
import PlaylistsPage from "pages/private/Playlists.page";
import SignUpPage from "pages/public/SignUp.page";

export const publicRoutes: Routes = {
  home: { path: "/home", component: LandingPage },
  signIn: { path: "/sign-in", component: SignInPage },
  signUp: { path: "/sign-up", component: SignUpPage },
  notFound: { path: "*", component: NotFound },
};

export const privateRoutes: Routes = {
  home: { path: "/", component: LandingPage },
  playlist: { path: "/playlists", component: PlaylistsPage },
  notFound: { path: "*", component: NotFound },
};
