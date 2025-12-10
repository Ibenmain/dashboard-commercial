'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Schema for forgot password form
const ForgotPasswordSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Please enter a valid email address" }),
});

type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;

// Schema for reset password form (after OTP verification)
const ResetPasswordSchema = z.object({
  otp: z.string()
    .min(1, { message: "OTP is required" })
    .length(6, { message: "OTP must be 6 digits" })
    .regex(/^\d+$/, { message: "OTP must contain only numbers" }),
  newPassword: z.string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
  confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;

// Mock API functions - replace with your actual API calls
const requestPasswordResetAPI = async (email: string) => {
  // Replace this with your actual API endpoint
  const response = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error('Failed to send reset email');
  }

  return response.json();
};

const verifyOtpAPI = async (email: string, otp: string) => {
  // Replace this with your actual API endpoint
  const response = await fetch('/api/auth/verify-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, otp }),
  });

  if (!response.ok) {
    throw new Error('Invalid OTP');
  }

  return response.json();
};

const resetPasswordAPI = async (email: string, otp: string, newPassword: string) => {
  // Replace this with your actual API endpoint
  const response = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, otp, newPassword }),
  });

  if (!response.ok) {
    throw new Error('Failed to reset password');
  }

  return response.json();
};

export default function ForgotPassword() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Email input, 2: OTP verification, 3: Reset password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [otpSent, setOtpSent] = useState(false);

  // Forgot password form
  const {
    register: forgotPasswordRegister,
    handleSubmit: handleForgotPasswordSubmit,
    formState: { errors: forgotPasswordErrors },
    reset: resetForgotPassword,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // Reset password form
  const {
    register: resetPasswordRegister,
    handleSubmit: handleResetPasswordSubmit,
    formState: { errors: resetPasswordErrors },
    reset: resetResetPassword,
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Handle OTP input
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  };

  // Start resend timer
  const startResendTimer = () => {
    setResendTimer(60);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Step 1: Request password reset
  const onForgotPasswordSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Call API to send reset email/OTP
      const result = await requestPasswordResetAPI(data.email);
      
      console.log("Password reset requested:", result);
      setEmail(data.email);
      setOtpSent(true);
      startResendTimer();
      setStep(2);
      setSuccess("A 6-digit OTP has been sent to your email. Please check your inbox.");
      
      resetForgotPassword();
    } catch (error: any) {
      console.error("Forgot password error:", error);
      setError(error.message || "Failed to send reset instructions. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError("Please enter a 6-digit OTP");
      return;
    }

    setIsVerifying(true);
    setError(null);
    setSuccess(null);

    try {
      // Verify OTP
      const result = await verifyOtpAPI(email, otp);
      
      console.log("OTP verified:", result);
      setStep(3);
      setSuccess("OTP verified successfully. Please set your new password.");
    } catch (error: any) {
      console.error("OTP verification error:", error);
      setError(error.message || "Invalid OTP. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setError(null);
    setSuccess(null);

    try {
      const result = await requestPasswordResetAPI(email);
      
      console.log("OTP resent:", result);
      startResendTimer();
      setSuccess("New OTP has been sent to your email.");
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      setError(error.message || "Failed to resend OTP. Please try again.");
    }
  };

  // Step 3: Reset password
  const onResetPasswordSubmit = async (data: ResetPasswordFormData) => {
    setIsResetting(true);
    setError(null);
    setSuccess(null);

    try {
      // Reset password
      const result = await resetPasswordAPI(email, otp, data.newPassword);
      
      console.log("Password reset successful:", result);
      setSuccess("Password reset successful! Redirecting to login...");
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error: any) {
      console.error("Reset password error:", error);
      setError(error.message || "Failed to reset password. Please try again.");
    } finally {
      setIsResetting(false);
    }
  };

  // Password strength indicator
  const newPassword = watch("newPassword");
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

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <div className="flex min-h-screen bg-white">
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 shadow-2xl ">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-10 w-full">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Icon icon="mdi:arrow-left" width="20" height="20" className="mr-2" />
                Back
              </button>
              <Link
                href="/login"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Sign in instead
              </Link>
            </div>
            
            <div className="flex flex-col items-center">
              <img src="/images/logo.png" alt="Logo" className="h-12" />
              <h1 className="mt-6 text-2xl font-bold text-gray-900">
                {step === 1 ? "Forgot Password" : step === 2 ? "Verify OTP" : "Reset Password"}
              </h1>
              <p className="mt-2 text-gray-600 text-center">
                {step === 1 && "Enter your email address and we'll send you an OTP to reset your password"}
                {step === 2 && `Enter the 6-digit OTP sent to ${email}`}
                {step === 3 && "Create a new password for your account"}
              </p>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`flex items-center ${stepNum < 3 ? 'flex-1' : ''}`}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    step >= stepNum
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    {stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div className={`flex-1 h-1 mx-2 ${
                      step > stepNum ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 px-2">
              <span>Enter Email</span>
              <span>Verify OTP</span>
              <span>New Password</span>
            </div>
          </div>

          {/* Success and Error Messages */}
          {success && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-4 mb-6">
              <div className="flex items-center">
                <Icon icon="mdi:check-circle" width="20" height="20" style={{ color: "#10b981" }} />
                <span className="ml-2 text-sm text-green-700">
                  {success}
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 mb-6">
              <div className="flex items-center">
                <Icon icon="codicon:error" width="16" height="16" style={{ color: "#fd0000" }} />
                <span className="ml-2 text-sm text-red-700">
                  {error}
                </span>
              </div>
            </div>
          )}

          {/* Step 1: Email Input */}
          {step === 1 && (
            <form className="space-y-6" onSubmit={handleForgotPasswordSubmit(onForgotPasswordSubmit)}>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    {...forgotPasswordRegister("email")}
                    className={`block w-full px-4 py-3 text-base rounded-lg border ${
                      forgotPasswordErrors.email
                        ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 transition-colors`}
                    placeholder="Enter your email address"
                  />
                  {forgotPasswordErrors.email && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <Icon icon="material-symbols:error" width="24" height="24" style={{ color: "#fb2727" }} />
                    </div>
                  )}
                </div>
                {forgotPasswordErrors.email && (
                  <p className="text-sm text-red-600">{forgotPasswordErrors.email.message}</p>
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
                      Sending...
                    </>
                  ) : (
                    "Send Reset OTP"
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
                    <Icon icon="mdi:email-lock" width="32" height="32" className="text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    We've sent a 6-digit OTP to <span className="font-semibold">{email}</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    The OTP will expire in 10 minutes
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 text-center">
                    Enter OTP
                  </label>
                  <div className="flex justify-center gap-2">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <input
                        key={index}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={otp[index] || ""}
                        onChange={(e) => {
                          const newOtp = otp.split('');
                          newOtp[index] = e.target.value.replace(/\D/g, '');
                          setOtp(newOtp.join('').slice(0, 6));
                          
                          // Auto-focus next input
                          if (e.target.value && index < 5) {
                            const nextInput = document.getElementById(`otp-${index + 1}`);
                            if (nextInput) nextInput.focus();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !otp[index] && index > 0) {
                            const prevInput = document.getElementById(`otp-${index - 1}`);
                            if (prevInput) prevInput.focus();
                          }
                        }}
                        id={`otp-${index}`}
                        className={`w-12 h-12 text-center text-xl font-semibold rounded-lg border ${
                          otp[index] ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                        } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors`}
                      />
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Didn't receive the OTP?{" "}
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendTimer > 0}
                      className={`font-medium ${
                        resendTimer > 0
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-blue-600 hover:text-blue-500'
                      }`}
                    >
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                    </button>
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtp("");
                    setError(null);
                    setSuccess(null);
                  }}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isVerifying || otp.length !== 6}
                  className={`flex-1 py-3 px-4 border border-transparent rounded-lg text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${
                    isVerifying || otp.length !== 6
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                  }`}
                >
                  {isVerifying ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline"
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
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Reset Password */}
          {step === 3 && (
            <form className="space-y-6" onSubmit={handleResetPasswordSubmit(onResetPasswordSubmit)}>
              <div className="space-y-2">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    {...resetPasswordRegister("newPassword")}
                    className={`block w-full px-4 py-3 text-base rounded-lg border ${
                      resetPasswordErrors.newPassword
                        ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 transition-colors`}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    <Icon 
                      icon={showNewPassword ? "mdi:eye-off" : "mdi:eye"} 
                      width="20" 
                      height="20" 
                      style={{ color: "#6b7280" }}
                    />
                  </button>
                </div>
                
                {/* Password strength indicator */}
                {newPassword && (
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Password strength:</span>
                      <span className={`font-medium ${
                        passwordStrength.score >= 4 ? "text-green-600" :
                        passwordStrength.score >= 3 ? "text-blue-600" :
                        passwordStrength.score >= 2 ? "text-yellow-600" : "text-red-600"
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
                
                {resetPasswordErrors.newPassword && (
                  <p className="text-sm text-red-600">{resetPasswordErrors.newPassword.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...resetPasswordRegister("confirmPassword")}
                    className={`block w-full px-4 py-3 text-base rounded-lg border ${
                      resetPasswordErrors.confirmPassword
                        ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 transition-colors`}
                    placeholder="Confirm new password"
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
                {resetPasswordErrors.confirmPassword && (
                  <p className="text-sm text-red-600">{resetPasswordErrors.confirmPassword.message}</p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep(2);
                    setError(null);
                    setSuccess(null);
                  }}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isResetting}
                  className={`flex-1 py-3 px-4 border border-transparent rounded-lg text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${
                    isResetting
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                  }`}
                >
                  {isResetting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline"
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
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Need help?{" "}
              <a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-500">
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2  items-center justify-center">
        <img src="/images/forgotPassword.png" alt=""  className="object-center w-2/3 h-2/3"/>
      </div>
    </div>
  );
}