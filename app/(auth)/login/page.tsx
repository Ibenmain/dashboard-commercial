'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }).min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setLoginError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Login data:", data);
    //   alert(`Login successful! Welcome ${data.email}`);
      reset();
    } catch (error) {
      setLoginError("Invalid email or password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
  <div className="flex min-h-screen bg-white">
      <div className="hidden lg:flex lg:w-1/2">
            <img src="/login-image.svg" alt="" className="object-cover " />
      </div>
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8  shadow-2xl">
        <div className="max-w-md w-full mx-auto">
          <div className=" mb-10 w-full flex flex-col items-center">  
            <img src="/images/logo.png" alt="" />
                <p className="mt-2 text-gray-600">
                  Enter your credentials to continue
                </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {loginError && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                <div className="flex items-center">
                  <Icon icon="codicon:error" width="16" height="16" style={{ color: "#fd0000" }} />
                  <span className="text-sm text-red-700 font-medium">
                    {loginError}
                  </span>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Id
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className={`block w-full px-4 py-3 text-base rounded-lg border ${
                    errors.email
                      ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  } focus:outline-none focus:ring-2 transition-colors`}
                  placeholder="info@gmail.com"
                />
                {errors.email && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                   <Icon icon="material-symbols:error" width="24" height="24"  style={{color: "#fb2727" }}/>
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  className={`block w-full px-4 py-3 text-base rounded-lg border ${
                    errors.password
                      ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  } focus:outline-none focus:ring-2 transition-colors`}
                  placeholder="******"
                />
                {errors.password && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Icon icon="material-symbols:error" width="24" height="24"  style={{color: "#fb2727" }}/>
                  </div>
                )}
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-end">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${
                  isSubmitting
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </div>

            <div className="text-center pt-4">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors focus:outline-none"
                >
                  Signup now
                </Link>
              </p>
            </div>

            <div className="pt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-center gap-5">
                <button type="button" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <Icon icon="flat-color-icons:google" width="24" height="24" />
                 </button>
                <button type="button" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <Icon icon="mdi:github" width="24" height="24" />
                </button>
              </div>
            </div>
          </form>

          <div className="mt-12 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              By logging in, you agree to our{" "}
              <a href="#" className="text-blue-600 hover:text-blue-500">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:text-blue-500">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}