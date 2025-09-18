"use client";

import { useEffect, useState, SyntheticEvent } from "react";

// next

// material-ui

// third-party
import * as Yup from "yup";
import { Formik } from "formik";

// project-imports

import { strengthColor, strengthIndicator } from "../../lib/password-strength";

// types

// assets
import { Eye, EyeSlash } from "iconsax-react";
import { authService } from "../../lib/services/auth.service";
import { useNavigate } from "react-router-dom";
import { StringColorProps } from "../../lib/types/password";


// ============================|| JWT - REGISTER ||============================ //
const Register: React.FC = () => {
  return (
    <main
      className="w-full min-h-screen flex flex-col items-center justify-center sm:px-4"
      style={{
        background: "linear-gradient(270deg, #004ea8, #62c7c7)",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
      }}
    >
      <div className="w-full space-y-6 text-gray-600 sm:max-w-md">
        <div className="bg-white shadow p-4 py-6 space-y-2 sm:p-6 sm:rounded-lg">
          <div className="text-center">
            <img
              src="/assets/images/logo.png"
              width={200}
              className="mx-auto"
            />
            <div className="mt-5 space-y-2">
              <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
                Register
              </h3>
              </div>
          </div>
          <div className="p-4 py-6 space-y-8 sm:p-6 sm:rounded-lg">
                <AuthRegister />
            <div className='flex justify-between mb-4 '>
                    <div>Already have an account</div>
                    <div><a href="/login" className="text-blue-800 underline hover:text-indigo-600">Login</a></div>
        </div>
        
          </div>
        
        </div>
      </div>
    </main>
  );
};

export function AuthRegister({ providers, csrfToken }: any) {
  
  const [level, setLevel] = useState<StringColorProps>();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  const changePassword = (value: string) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword("");
  }, []);
   const navigate = useNavigate();
  return (
    <>
      <Formik
        initialValues={{
          firstname: "",
          lastname: "",
          email: "",
          company: "",
          password: "",
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          firstname: Yup.string().max(255).required("First Name is required"),
          lastname: Yup.string().max(255).required("Last Name is required"),
          email: Yup.string()
            .email("Must be a valid email")
            .max(255)
            .required("Email is required"),
          password: Yup.string().max(255).required("Password is required"),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            console.log(values)
            const response = await authService.signup({
              email: values.email,
              password: values.password,
            });
            console.log("register response", response);
            if (response?.error) {
              setErrors({ submit: response.error });
              setSubmitting(false);
            } else {
              setStatus({ success: true });
              setSubmitting(false);
              localStorage.setItem("emailForVerification", values.email);
              navigate(`/code-verification?source=register`);
            }
          } catch (error: any) {
            setStatus({ success: false });
            setErrors({ submit: error.message });
            setSubmitting(false);
          }
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
        }) => (
          <form noValidate onSubmit={handleSubmit} className="space-y-4">
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name*
                </label>
                <input
                  name="firstname"
                  value={values.firstname}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="John"
                  className={`mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-teal-500 p-2 ${
                    touched.firstname && errors.firstname
                      ? "border-red-400"
                      : ""
                  }`}
                />
                {touched.firstname && errors.firstname && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.firstname}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name*
                </label>
                <input
                  name="lastname"
                  value={values.lastname}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Doe"
                  className={`mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-teal-500 p-2 ${
                    touched.lastname && errors.lastname ? "border-red-400" : ""
                  }`}
                />
                {touched.lastname && errors.lastname && (
                  <p className="text-xs text-red-600 mt-1">{errors.lastname}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company
              </label>
              <input
                name="company"
                value={values.company}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Demo Inc."
                className={`mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-teal-500 p-2 ${
                  touched.company && errors.company ? "border-red-400" : ""
                }`}
              />
              {touched.company && errors.company && (
                <p className="text-xs text-red-600 mt-1">{errors.company}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address*
              </label>
              <input
                name="email"
                type="email"
                value={values.email}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="demo@company.com"
                className={`mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-teal-500 p-2 ${
                  touched.email && errors.email ? "border-red-400" : ""
                }`}
              />
              {touched.email && errors.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={values.password}
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    changePassword(e.target.value);
                  }}
                  placeholder="******"
                  className={`block w-full rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-teal-500 p-2 pr-10 ${
                    touched.password && errors.password ? "border-red-400" : ""
                  }`}
                />
                <button
                  type="button"
                  onMouseDown={handleMouseDownPassword}
                  onClick={handleClickShowPassword}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                  aria-label="toggle password visibility"
                >
                  {showPassword ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeSlash className="w-5 h-5" />
                  )}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="text-xs text-red-600 mt-1">{errors.password}</p>
              )}

              <div className="mt-3 flex items-center space-x-3">
                <div className="w-20 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div style={{ width: "100%" }} className="h-2 rounded-full" />
                </div>
                <div className="text-sm text-gray-600">{level?.label}</div>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              By signing up, you agree to our{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>
              and{" "}
                <a className="text-blue-600 hover:underline" href="#" >Privacy Policy</a>
              
            </div>

            {errors.submit && (
              <div className="text-sm text-red-600">
                {typeof errors.submit === "string"
                  ? errors.submit
                  : Array.isArray(errors.submit)
                  ? errors.submit.join(", ")
                  : ""}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md font-semibold disabled:opacity-50"
              >
                {isSubmitting ? "Creating..." : "Create Account"}
              </button>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
}

export default Register;