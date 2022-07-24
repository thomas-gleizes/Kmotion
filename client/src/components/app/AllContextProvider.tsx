import { ChakraProvider } from "@chakra-ui/react";
import AuthContextProvider from "context/auth.context";

const AllContextProvider: ContextProvider = ({ children }) => {
  return (
    <ChakraProvider>
      <AuthContextProvider>{children}</AuthContextProvider>
    </ChakraProvider>
  );
};

export default AllContextProvider;
