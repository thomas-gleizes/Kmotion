import { ReactRouter, RootRoute, Route, lazy } from "@tanstack/react-router";
import Root from "./pages/Root";

const rootRoute = new RootRoute({ component: Root });

const indexRoute = new Route({
  path: "/",
  component: lazy(() => import("./pages/Home")),
  getParentRoute: () => rootRoute
});

const routeTree = rootRoute.addChildren([indexRoute]);

export const router = new ReactRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadDelay: 200
});


declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
