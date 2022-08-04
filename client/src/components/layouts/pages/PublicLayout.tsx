import { Link, Outlet } from "react-router-dom";
import { publicRoutes } from "resources/routes";

const PublicLayout: Component = () => {
  return (
    <div>
      <header>
        <div className="w-screen h-16 flex items-center px-10 justify-between ag-floating-bottom bg-gradient-to-r from-violet-700 via-pink-600 to-rose-700">
          <div className="">
            <h1 className="text-4xl text-white font-bold">K'Motion</h1>
          </div>
          <div className="flex justify-end space-x-5">
            <div>
              <Link to={publicRoutes.signIn.path}>
                <a className="px-5 py-3 bg-white rounded-lg shadow text-lg font-bold">Sign In</a>
              </Link>
            </div>
            <div className="">
              <Link to={publicRoutes.signUp.path}>
                <a className="px-5 py-3 bg-white rounded-lg shadow text-lg font-bold">Sign Up</a>
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
