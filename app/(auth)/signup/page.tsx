'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Enhanced signup schema with more validation
const SignupSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Please enter a valid email address" }),
  password: z.string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
  confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof SignupSchema>;

// Mock API function - replace with your actual API call
const signupAPI = async (userData: Omit<SignupFormData, 'confirmPassword' | 'termsAccepted'>) => {
  // Replace this with your actual API endpoint
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Signup failed');
  }

  return response.json();
};

export default function Signup() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      termsAccepted: false,
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    setSignupError(null);
    setSignupSuccess(false);

    try {
      // Prepare user data for API (exclude confirmPassword and termsAccepted if not needed in backend)
      const userData = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      };

      // Call your signup API
      const result = await signupAPI(userData);
      
      // Handle successful signup
      console.log("Signup successful:", result);
      setSignupSuccess(true);
      
      // Option 1: Redirect to login page after successful signup
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      
      // Option 2: Auto-login and redirect to dashboard
      // const loginResult = await loginAPI({ email: data.email, password: data.password });
      // localStorage.setItem('token', loginResult.token);
      // router.push('/dashboard');
      
      reset();
    } catch (error: any) {
      console.error("Signup error:", error);
      
      // Handle specific error messages
      if (error.message === 'Email already exists') {
        setSignupError("This email is already registered. Please use a different email or try logging in.");
      } else if (error.message === 'Weak password') {
        setSignupError("Password is too weak. Please choose a stronger password.");
      } else {
        setSignupError(error.message || "Signup failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const password = watch("password");

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: "None", color: "bg-gray-200" };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];
    
    return {
      score,
      label: labels[score - 1] || "None",
      color: colors[score - 1] || "bg-gray-200",
      width: `${(score / 5) * 100}%`
    };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="flex min-h-screen bg-white ">
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-16 shadow-2xl">
        <div className=" w-full ">
          <div className="mb-10 w-full flex flex-col items-center">  
            <img src="/images/logo.png" alt="Logo" />
            <p className="mt-2 text-gray-600">
              Create your account to get started
            </p>
          </div>

          {signupSuccess && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-4 mb-6">
              <div className="flex items-center">
                <Icon icon="mdi:check-circle" width="20" height="20" style={{ color: "#10b981" }} />
                <span className="ml-2 text-sm text-green-700 font-medium">
                  Signup successful! Redirecting to login...
                </span>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {signupError && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                <div className="flex items-center">
                  <Icon icon="codicon:error" width="16" height="16" style={{ color: "#fd0000" }} />
                  <span className="ml-2 text-sm text-red-700 font-medium">
                    {signupError}
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  {...register("firstName")}
                  className={`block w-full px-4 py-3 text-base rounded-lg border ${
                    errors.firstName
                      ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  } focus:outline-none focus:ring-2 transition-colors`}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  {...register("lastName")}
                  className={`block w-full px-4 py-3 text-base rounded-lg border ${
                    errors.lastName
                      ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  } focus:outline-none focus:ring-2 transition-colors`}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
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
                  placeholder="john.doe@example.com"
                />
                {errors.email && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Icon icon="material-symbols:error" width="24" height="24" style={{ color: "#fb2727" }} />
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={`block w-full px-4 py-3 text-base rounded-lg border ${
                    errors.password
                      ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  } focus:outline-none focus:ring-2 transition-colors`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Icon 
                    icon={showPassword ? "mdi:eye-off" : "mdi:eye"} 
                    width="20" 
                    height="20" 
                    style={{ color: "#6b7280" }}
                  />
                </button>
              </div>
              
              {/* Password strength indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Password strength:</span>
                    <span className={`font-medium ${
                      passwordStrength.score >= 4 ? "text-green-600" :
                      passwordStrength.score >= 3 ? "text-blue-600" :
                      passwordStrength.score >= 2 ? "text-yellow-600" : 
                      "text-red-600"
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: passwordStrength.width }}
                    />
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
              
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  className={`block w-full px-4 py-3 text-base rounded-lg border ${
                    errors.confirmPassword
                      ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  } focus:outline-none focus:ring-2 transition-colors`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Icon 
                    icon={showConfirmPassword ? "mdi:eye-off" : "mdi:eye"} 
                    width="20" 
                    height="20" 
                    style={{ color: "#6b7280" }}
                  />
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
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
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>

            <div className="text-center pt-4">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors focus:outline-none"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      <div className="hidden lg:flex lg:w-1/2 justify-center items-center">
        <img src="/signup-image.svg" alt="Signup illustration" className="object-cover" />
      </div>
    </div>
  );
}