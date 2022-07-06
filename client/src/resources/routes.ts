import Home from "pages/Home";
import About from "pages/About";
import NotFound from "pages/NotFound";

const routes: Routes = {
  home: { path: "/", component: Home },
  about: { path: "/about", component: About },
};

export default routes;
