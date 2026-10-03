import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  ArrowLeft,
  KeyRound,
} from "lucide-react";
import { authService } from "../../services/auth.service";
import { getApiErrorMessage } from "../../utils/apiError";
import { useToastStore } from "../../store/toastStore";
import { validateResetPasswordForm } from "../../utils/formValidation";
import AuthCard from "./AuthCard";
import AuthField from "./AuthField";
import AuthSubmitButton from "./AuthSubmitButton";

interface LocationState {
  email?: string;
}

export default function ResetPasswordForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState | null;

  const [email, setEmail] = useState(locationState?.email || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const addToast = useToastStore((state) => state.addToast);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validateResetPasswordForm(
      email,
      otp,
      newPassword,
      confirmPassword,
    );
    if (!validation.isValid) {
      addToast(validation.error ?? "Please check the form", "error");
      return;
    }

    try {
      setIsLoading(true);
      const response = await authService.resetPassword({
        email,
        otp,
        newPassword,
      });

      addToast(response.message, "success");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      addToast(getApiErrorMessage(err), "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard>
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate("/forgot-password")}
        className="mb-6 flex items-center gap-1.5 text-xs text-slate-400 transition-colors hover:text-slate-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Reset Password
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Enter the OTP sent to your email and choose a new password.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Email */}
        <AuthField
          label="Email Address"
          icon={Mail}
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        {/* OTP */}
        <AuthField
          label="Reset OTP"
          icon={KeyRound}
          type="text"
          name="otp"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          value={otp}
          maxLength={6}
          onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
          placeholder="Enter 6-digit OTP"
          inputClassName="w-full rounded-lg border border-slate-700/80 bg-[#0B1120]/80 py-2.5 text-xs tracking-[0.3em] text-white placeholder:tracking-normal placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />

        {/* New Password */}
        <AuthField
          label="New Password"
          icon={Lock}
          type="password"
          name="newPassword"
          autoComplete="new-password"
          required
          minLength={8}
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          placeholder="Minimum 8 characters"
        />

        {/* Confirm Password */}
        <AuthField
          label="Confirm Password"
          icon={Lock}
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Confirm your password"
        />

        {/* Submit */}
        <AuthSubmitButton
          isLoading={isLoading}
          loadingText="Resetting Password..."
        >
          Reset Password
        </AuthSubmitButton>
      </form>
    </AuthCard>
  );
}