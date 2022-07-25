import NotFound from "pages/NotFound";
import HomePage from "pages/public/Home.page";
import SignInPage from "pages/public/auth/SignIn.page";
import PlaylistPage from "pages/protected/PlaylistPage";

export const publicRoutes: Routes = {
  home: { path: "/home", component: HomePage },
  signIn: { path: "/sign-in", component: SignInPage },
  notFound: { path: "*", component: NotFound },
};

export const protectedRoutes: Routes = {
  main: { path: "/", component: PlaylistPage },
};
