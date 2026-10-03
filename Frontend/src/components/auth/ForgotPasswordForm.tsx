import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { Mail, ArrowLeft } from "lucide-react";

import { authService } from "../../services/auth.service";

import { getApiErrorMessage } from "../../utils/apiError";
import { useToastStore } from "../../store/toastStore";
import { validateForgotPasswordForm } from "../../utils/formValidation";
import AuthCard from "./AuthCard";
import AuthField from "./AuthField";
import AuthSubmitButton from "./AuthSubmitButton";

export default function ForgotPasswordForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const addToast = useToastStore((state) => state.addToast);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = validateForgotPasswordForm(email);
    if (!validation.isValid) {
      addToast(validation.error ?? "Please check the form", "error");
      return;
    }

    try {
      setIsLoading(true);

      await authService.forgotPassword({
        email,
      });

      /*
       * Navigate to reset password page.
       *
       * Pass the email so the user
       * does not need to type it again.
       */

      navigate(
        "/reset-password",

        {
          state: {
            email,
          },
        },
      );
    } catch (error) {
      addToast(getApiErrorMessage(error), "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard>
      {/* Back Button */}

      <button
        type="button"
        onClick={() => navigate("/login")}
        className="
                    flex
                    items-center
                    gap-1.5
                    text-xs
                    text-slate-400
                    hover:text-slate-200
                    transition-colors
                    mb-6
                "
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Login
      </button>

      {/* Header */}

      <div className="mb-6">
        <h2
          className="
                        text-2xl
                        font-bold
                        text-white
                        tracking-tight
                    "
        >
          Forgot Password?
        </h2>

        <p
          className="
                        text-xs
                        text-slate-400
                        mt-1
                    "
        >
          Enter your email address and we'll send you a reset OTP.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <AuthField
          label="Email Address"
          icon={Mail}
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="name@example.com"
        />

        {/* Submit */}
        <AuthSubmitButton isLoading={isLoading} loadingText="Sending OTP...">
          Send Reset OTP
        </AuthSubmitButton>
      </form>
    </AuthCard>
  );
}
