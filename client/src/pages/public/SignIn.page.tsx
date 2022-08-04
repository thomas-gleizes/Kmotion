import { Formik, Form } from "formik";
import { Navigate } from "react-router-dom";
import { Button, Checkbox, FormLabel, Input, InputGroup, InputRightElement } from "@chakra-ui/react";

import apiService from "services/api.service";
import { useAuthContext } from "context/auth.context";
import { useToggle } from "hooks/index";

interface Payload {
  email: string;
  password: string;
  rememberMe: boolean;
}

const SignInPage: Page = () => {
  const context = useAuthContext();

  const [showPassword, togglePassword] = useToggle(false);

  if (context.isAuthenticated) return <Navigate to="/" />;

  const handleSubmit = async (values: Payload) => {
    const response = await apiService.post("/auth/sign-in", values);

    context.signIn(response.data.user, response.data.token, values.rememberMe);

    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const values: Payload = {
    email: "kalat@email.fr",
    password: "azerty",
    rememberMe: false,
  };

  return (
    <div className="w-screen h-screen flex justify-center mt-44 content-center">
      <div className="w-600 h-fit bg-gray-50 shadow border rounded p-5">
        <div className="mb-8">
          <h1 className="font-extrabold text-transparent text-4xl bg-clip-text bg-gradient-to-br from-violet-700 via-pink-600 to-rose-700">
            K'motion - Sign In
          </h1>
        </div>

        <Formik initialValues={values} onSubmit={handleSubmit}>
          {({ values, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <div className="flex flex-col space-y-5">
                <div>
                  <FormLabel>
                    Email <em>*</em>
                  </FormLabel>
                  <Input
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div>
                  <FormLabel>
                    Password <em>*</em>
                  </FormLabel>
                  <InputGroup size="md">
                    <Input
                      pr="4.5rem"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                    />
                    <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={togglePassword}>
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </div>
                <div>
                  <Checkbox defaultChecked>Remembe me</Checkbox>
                </div>
                <button
                  className="w-full bg-gradient-to-br from-violet-700 via-pink-700 to-rose-500 text-white shadow-lg font-bold text-2xl py-2 rounded-lg hover:scale-105 hover:shadow-xl transition transform duration-100"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Connexion
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignInPage;
