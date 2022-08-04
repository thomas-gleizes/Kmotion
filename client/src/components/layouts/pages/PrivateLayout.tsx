import { Link, Navigate, NavLink, Outlet } from "react-router-dom";
import { useAuthContext } from "context/auth.context";
import { privateRoutes } from "resources/routes";

const PrivateLayout: Component = () => {
  const authContext = useAuthContext();

  if (!authContext.isAuthenticated) return <Navigate to="/sign-in" />;

  return (
    <div>
      <header>
        <div className="w-screen h-16 flex items-center px-10 justify-between ag-floating-bottom bg-gradient-to-r from-violet-700 via-pink-600 to-rose-700">
          <div className="">
            <Link to={privateRoutes.home.path}>
              <h1 className="text-4xl text-white font-bold">K'Motion</h1>
            </Link>
          </div>
          <nav>
            <ul className="flex space-x-8 text-white text-lg font-bold">
              <NavLink to={privateRoutes.playlist.path}>Playlist</NavLink>
              <NavLink to={privateRoutes.playlist.path}>Musics</NavLink>
              <NavLink to={privateRoutes.playlist.path}>Search</NavLink>
              <NavLink to={privateRoutes.playlist.path}>Profil</NavLink>
            </ul>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default PrivateLayout;
