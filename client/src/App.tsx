import React from "react";

import AllContextProvider from "components/app/AllContextProvider";
import Router from "components/app/Router";

const App: Component = () => {
  return (
    <AllContextProvider>
      <Router />
    </AllContextProvider>
  );
};

export default App;
