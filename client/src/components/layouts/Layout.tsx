import React from "react";

import Header from "./Header";
import Footer from "./Footer";

const Layout: Component<{ children: RNode }> = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
