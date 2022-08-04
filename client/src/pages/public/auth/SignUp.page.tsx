import { Field, Form, Formik, FormikHelpers } from "formik";
import { Button, Checkbox, FormControl, FormErrorMessage, FormLabel, Input, Stack } from "@chakra-ui/react";
import * as Yup from "yup";
import ApiService from "services/api.service";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

const validationSchema = Yup.object({
  name: Yup.string().min(3, "Your name must be at least 3 characters long").required("Your name is required"),
  email: Yup.string().email("Your email is invalid").required("Your email is required"),
  password: Yup.string()
    .min(6, "Your password must be at least 6 characters long")
    .required("Your password is required"),
  confirmPassword: Yup.string()
    .required("You must confirm your password")
    .oneOf([Yup.ref("password")], "Your passwords must match"),
});

type Values = Yup.TypeOf<typeof validationSchema>;

const SignUpPage: Page = () => {
  const navigate = useNavigate();

  const initialValues: Values = {
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  };
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (values: Values, helpers: FormikHelpers<Values>) => {
    try {
      setErrorMessage(null);

      const response = await ApiService.post("/auth/sign-up", values);

      toast(response.data.message);

      navigate("/");
    } catch (error) {
      if (error instanceof AxiosError) {
        helpers.setErrors({
          email: error.response?.data?.message,
          name: error.response?.data?.message,
        });
      } else setErrorMessage("A error occured");
    }
  };

  return (
    <div className="flex items-center justify-center mt-44">
      <div className="min-w-500 h-fit bg-gray-50 shadow border rounded p-5">
        <div className="mb-8">
          <h1 className="font-extrabold text-transparent text-4xl bg-clip-text bg-gradient-to-r from-purple-700 to-pink-700">
            K'motion - Sign Up
          </h1>
        </div>

        {errorMessage && (
          <div className="w-full text-center mb-5">
            <h3 className="text-red-600 font-black text-xl">{errorMessage}</h3>
          </div>
        )}

        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <div className="flex flex-col space-y-2">
                <FormControl isInvalid={touched.email && !!errors.email}>
                  <FormLabel>
                    Email <em>*</em>
                  </FormLabel>
                  <Field as={Input} type="email" name="email" variant="filled" />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={touched.name && !!errors.name}>
                  <FormLabel>
                    name <em>*</em>
                  </FormLabel>
                  <Field as={Input} type="text" name="name" variant="filled" />
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={touched.password && !!errors.password}>
                  <FormLabel>
                    Password <em>*</em>
                  </FormLabel>
                  <Field as={Input} type="password" name="password" variant="filled" />
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={touched.confirmPassword && !!errors.confirmPassword}>
                  <FormLabel>
                    Confirm your password <em>*</em>
                  </FormLabel>
                  <Field as={Input} type="password" name="confirmPassword" variant="filled" />
                  <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                </FormControl>
              </div>
              <div className="mt-8">
                <Button
                  className="w-full"
                  type="submit"
                  colorScheme="blue"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
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

export default SignUpPage;
