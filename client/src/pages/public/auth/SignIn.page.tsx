import { Formik, Form } from "formik";
import { Navigate } from "react-router-dom";
import { Button, Checkbox, FormLabel, Input } from "@chakra-ui/react";

import apiService from "services/api.service";
import { useAuthContext } from "context/auth.context";

interface Payload {
  email: string;
  password: string;
  rememberMe: boolean;
}

const SignInPage: Page = () => {
  const context = useAuthContext();

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
    <div className="w-screen h-screen flex justify-center my-10 content-center">
      <div className="w-400 h-fit bg-gray-50 shadow border rounded p-5">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-700">K'motion - Connexion</h1>
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
                  <Input
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div>
                  <Checkbox defaultChecked>Remembe me</Checkbox>
                </div>

                <Button type="submit" colorScheme="blue" isLoading={isSubmitting} disabled={isSubmitting}>
                  Connexion
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignInPage;
