import { useEffect, useState, type FormEvent } from "react";

import { useNavigate } from "react-router-dom";

import { Mail, ShieldCheck, RotateCcw } from "lucide-react";

import { authService } from "../../services/auth.service";

import { getApiErrorMessage } from "../../utils/apiError";
import { useToastStore } from "../../store/toastStore";

import {
  validateEmail,
  validateVerifyEmailForm,
} from "../../utils/formValidation";

interface VerifyEmailFormProps {
  userId: string;
  email: string;
}

const RESEND_COOLDOWN_SECONDS = 60;

export function VerifyEmailForm({ userId, email }: VerifyEmailFormProps) {
  const navigate = useNavigate();

  const addToast = useToastStore((state) => state.addToast);

  const [otp, setOtp] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [isResending, setIsResending] = useState(false);

  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);

  /*
   * OTP countdown timer
   */
  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((previousSeconds) => Math.max(previousSeconds - 1, 0));
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [secondsLeft]);

  const handleOtpChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "");

    setOtp(numericValue.slice(0, 6));
  };

  /*
   * Verify OTP
   */
  const handleVerify = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = validateVerifyEmailForm(userId, otp);

    if (!validation.isValid) {
      addToast(validation.error ?? "Please check the form", "error");

      return;
    }

    try {
      setIsLoading(true);

      const response = await authService.verifyEmailOtp({
        userId,

        otp,
      });

      addToast(response.message, "success");

      setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 1500);
    } catch (error: unknown) {
      addToast(getApiErrorMessage(error), "error");
    } finally {
      setIsLoading(false);
    }
  };

  /*
   * Resend OTP
   */
  const handleResendOtp = async () => {
    /*
     * Prevent resend before timer finishes.
     */
    if (secondsLeft > 0 || isResending) {
      return;
    }

    const validation = validateEmail(email);

    if (!validation.isValid) {
      addToast(validation.error ?? "Please check the email", "error");

      return;
    }

    try {
      setIsResending(true);

      const response = await authService.resendVerificationOtp({
        email,
      });

      addToast(response.message, "success");

      /*
       * Restart timer only after
       * successful resend.
       */
      setSecondsLeft(RESEND_COOLDOWN_SECONDS);
    } catch (error: unknown) {
      addToast(getApiErrorMessage(error), "error");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}

        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>

          <span className="text-xl font-black tracking-wider text-white">
            EDUCATE
          </span>
        </div>

        {/* Card */}

        <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-8 shadow-2xl">
          {/* Icon */}

          <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-indigo-600/20 flex items-center justify-center">
            <Mail className="w-7 h-7 text-indigo-400" />
          </div>

          {/* Heading */}

          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Verify your email</h1>

            <p className="text-sm text-slate-400 mt-3 leading-relaxed">
              We've sent a verification code to
            </p>

            <p className="text-sm font-semibold text-indigo-400 mt-1 break-all">
              {email}
            </p>
          </div>

          {/* Form */}

          <form onSubmit={handleVerify} noValidate className="mt-8">
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Verification Code
            </label>

            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={(e) => handleOtpChange(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
              disabled={isLoading}
              className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-3 text-center text-lg tracking-[0.5em] text-white placeholder:text-slate-600 placeholder:tracking-normal focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            />

            {/* Verify Button */}

            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="w-full mt-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          {/* Resend OTP */}

          <div className="mt-6 text-center">
            {secondsLeft > 0 ? (
              <p className="text-sm text-slate-400">
                Resend OTP in{" "}
                <span className="font-semibold text-indigo-400">
                  {secondsLeft}s
                </span>
              </p>
            ) : (
              <p className="text-sm text-slate-400">Didn't receive the code?</p>
            )}

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={secondsLeft > 0 || isResending}
              className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 disabled:cursor-not-allowed disabled:text-slate-600"
            >
              <RotateCcw
                className={`w-4 h-4 ${isResending ? "animate-spin" : ""}`}
              />

              {isResending ? "Sending..." : "Resend OTP"}
            </button>
          </div>

          {/* Back to Register */}

          <div className="mt-6 pt-6 border-t border-slate-700 text-center">
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-sm text-slate-400 hover:text-white"
            >
              Use a different email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
