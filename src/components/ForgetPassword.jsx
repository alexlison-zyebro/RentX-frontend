import React, { useState } from 'react';
import { Building2, Mail, Lock, Check, ArrowRight, KeyRound } from 'lucide-react';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [otpVerified, setOtpVerified] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sendOtp = () => {
    if (!form.email) {
      setErrors({ email: "Email is required" });
      return;
    }
    if (!validateEmail(form.email)) {
      setErrors({ email: "Invalid email format" });
      return;
    }
    
    console.log("Sending OTP to:", form.email);
    // Backend integration: Send OTP to email
    setStep(2);
  };

  const verifyOtp = () => {
    if (!form.otp || form.otp.length !== 6) {
      setErrors({ otp: "Enter 6-digit OTP" });
      return;
    }
    
    console.log("Verifying OTP:", form.otp);
    // Backend integration: Verify OTP
    setOtpVerified(true);
    setStep(3);
  };

  const updatePassword = () => {
    const newErrors = {};
    
    if (!form.newPassword) {
      newErrors.newPassword = "Password is required";
    } else if (form.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }
    
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    console.log("Password updated successfully");
    // Backend integration: Update password
    // Redirect to login page
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (step === 1) sendOtp();
      else if (step === 2) verifyOtp();
      else if (step === 3) updatePassword();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-2 shadow-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 transform hover:scale-105 transition-transform duration-300">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">
            Rent<span className="text-orange-600 text-5xl">X</span>
          </h1>
          <p className="text-gray-600 text-lg font-medium">PowerTools Marketplace</p>
        </div>
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200/50 p-12 hover:shadow-3xl transition-all duration-300">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {step === 1 && "Reset Password"}
              {step === 2 && "Verify OTP"}
              {step === 3 && "Create New Password"}
            </h2>
            <p className="text-gray-600 text-base">
              {step === 1 && "Enter your email to receive a verification code"}
              {step === 2 && "Enter the 6-digit code sent to your email"}
              {step === 3 && "Create a strong password for your account"}
            </p>
          </div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                step >= 1 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > 1 ? <Check className="w-5 h-5" /> : '1'}
              </div>
              <span className="text-xs font-semibold text-gray-600">Email</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-orange-600' : 'bg-gray-200'}`}></div>
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                step >= 2 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > 2 ? <Check className="w-5 h-5" /> : '2'}
              </div>
              <span className="text-xs font-semibold text-gray-600">Verify</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-orange-600' : 'bg-gray-200'}`}></div>
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                step >= 3 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                3
              </div>
              <span className="text-xs font-semibold text-gray-600">Reset</span>
            </div>
          </div>

          <div className="space-y-6">
            {step === 1 && (
              <>
                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-2 group-focus-within:text-orange-600 transition-colors">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-600 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                      placeholder="you@example.com"
                      className={`w-full pl-12 pr-4 py-4 bg-gray-50/50 border-2 ${
                        errors.email ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                      } rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-200 placeholder-gray-400`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-2 ml-1 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.email}
                    </p>
                  )}
                </div>

                <button
                  onClick={sendOtp}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 group/btn"
                >
                  <span>Send OTP</span>
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-2 group-focus-within:text-orange-600 transition-colors">
                    Verification Code
                  </label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-600 transition-colors" />
                      <input
                        type="text"
                        name="otp"
                        value={form.otp}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter 6-digit OTP"
                        maxLength="6"
                        className={`w-full pl-12 pr-4 py-4 bg-orange-50/50 border-2 ${
                          errors.otp ? 'border-red-400 bg-red-50/30' : 'border-orange-300'
                        } rounded-2xl text-center font-bold tracking-widest text-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-200`}
                      />
                    </div>
                    <button
                      onClick={verifyOtp}
                      disabled={form.otp.length !== 6 || otpVerified}
                      className={`px-6 py-4 rounded-2xl font-bold whitespace-nowrap min-w-[120px] transition-all ${
                        otpVerified 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-green-500 hover:bg-green-600 text-white hover:shadow-lg'
                      } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                    >
                      {otpVerified ? (
                        <>
                          <Check className="w-5 h-5" />
                          <span>Verified</span>
                        </>
                      ) : (
                        'Verify'
                      )}
                    </button>
                  </div>
                  {errors.otp && (
                    <p className="text-red-500 text-xs mt-2 ml-1 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.otp}
                    </p>
                  )}
                </div>

                <div className="text-center">
                  <button
                    onClick={() => sendOtp()}
                    className="text-sm font-semibold text-orange-600 hover:text-orange-700 hover:underline transition-all"
                  >
                    Didn't receive code? Resend
                  </button>
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-2 group-focus-within:text-orange-600 transition-colors">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-600 transition-colors" />
                    <input
                      type="password"
                      name="newPassword"
                      value={form.newPassword}
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter new password"
                      className={`w-full pl-12 pr-4 py-4 bg-gray-50/50 border-2 ${
                        errors.newPassword ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                      } rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-200`}
                    />
                  </div>
                  {errors.newPassword && (
                    <p className="text-red-500 text-xs mt-2 ml-1 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-2 group-focus-within:text-orange-600 transition-colors">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-600 transition-colors" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                      placeholder="Confirm new password"
                      className={`w-full pl-12 pr-4 py-4 bg-gray-50/50 border-2 ${
                        errors.confirmPassword ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                      } rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-200`}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-2 ml-1 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <button
                  onClick={updatePassword}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 group/btn"
                >
                  <span>Update Password</span>
                  <Check className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                </button>
              </>
            )}

            {/* Back to Login Link */}
            <div className="text-center pt-4">
              <a 
                href="/login" 
                className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 transition-all group/link"
              >
                <span className="border-b-2 border-transparent group-hover/link:border-orange-600 transition-all">
                  Back to Login
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm font-medium">
            © 2026 RentX. Empowering Tool Rentals.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(20px, 20px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;