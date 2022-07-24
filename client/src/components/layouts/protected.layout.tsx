import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "context/auth.context";

const ProtectedLayout: Component = () => {
  const authContext = useAuthContext();

  if (!authContext.isAuthenticated) return <Navigate to="/sign-in" />;

  return (
    <main>
      <Outlet />
    </main>
  );
};

export default ProtectedLayout;
