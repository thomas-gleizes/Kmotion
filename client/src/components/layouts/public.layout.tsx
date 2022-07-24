import { Outlet } from "react-router-dom";

const PublicLayout: Component = () => {
  return (
    <main>
      <Outlet />
    </main>
  );
};

export default PublicLayout;
