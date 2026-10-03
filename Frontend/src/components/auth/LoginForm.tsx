import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

import { Mail, Lock } from "lucide-react";

import { authService } from "../../services/auth.service";
import { getApiErrorMessage } from "../../utils/apiError";
import { getRoleDashboardPath } from "../../utils/getRoleDashboardPath";
import GoogleSignInButton from "./GoogleSignInButton";
import { useToastStore } from "../../store/toastStore";
import { validateLoginForm } from "../../utils/formValidation";
import AuthCard from "./AuthCard";
import AuthField from "./AuthField";
import AuthSubmitButton from "./AuthSubmitButton";

export default function LoginForm() {
  const navigate = useNavigate();

  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const addToast = useToastStore((state) => state.addToast);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = validateLoginForm(email, password);
    if (!validation.isValid) {
      addToast(validation.error ?? "Please check the form", "error");
      return;
    }

    try {
      setIsLoading(true);

      const response = await authService.login({
        email,
        password,
      });

      const { user, accessToken } = response.data;

      setAuth(user, accessToken);

      /*
       * Role based redirection
       */
      navigate(getRoleDashboardPath(user.role));
    } catch (error) {
      addToast(getApiErrorMessage(error), "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Welcome Back
        </h2>

        <p className="mt-1 text-xs text-slate-400">
          Sign in to continue learning
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
          placeholder="name@company.com"
        />

        {/* Password */}
        <AuthField
          label="Password"
          icon={Lock}
          type="password"
          name="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
          labelAction={
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-xs font-medium text-indigo-400 transition-colors hover:text-indigo-300"
            >
              Forgot Password?
            </button>
          }
        />

        {/* Submit */}
        <AuthSubmitButton isLoading={isLoading} loadingText="Signing in...">
          Sign In
        </AuthSubmitButton>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-700" />
          <span className="text-xs text-slate-500">OR</span>
          <div className="h-px flex-1 bg-slate-700" />
        </div>

        <GoogleSignInButton />
      </form>

      {/* Register */}
      <p className="mt-6 text-center text-xs text-slate-400">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="font-medium text-indigo-400 transition-colors hover:text-indigo-300"
        >
          Sign Up
        </button>
      </p>
    </AuthCard>
  );
}