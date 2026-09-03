import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

import { authService } from "../../services/auth.service";
import { getApiErrorMessage } from "../../utils/apiError";
import { getRoleDashboardPath } from "../../utils/getRoleDashboardPath";
import GoogleSignInButton from "./GoogleSignInButton";

export default function LoginForm() {
  const navigate = useNavigate();

  const setAuth = useAuthStore((state) => state.setAuth);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);

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
      setError(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-800/90 bg-[#162032]/80 p-7 shadow-2xl backdrop-blur-md sm:p-9">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Welcome Back
        </h2>

        <p className="mt-1 text-xs text-slate-400">
          Sign in to continue learning
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-300">
            Email Address
          </label>

          <div className="relative flex items-center">
            <Mail className="pointer-events-none absolute left-3.5 h-4 w-4 text-slate-500" />

            <input
              type="email"
              name="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@company.com"
              className="w-full rounded-lg border border-slate-700/80 bg-[#0B1120]/80 py-2.5 pl-10 pr-3.5 text-xs text-white placeholder:text-slate-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="block text-xs font-medium text-slate-300">
              Password
            </label>

            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-xs font-medium text-indigo-400 transition-colors hover:text-indigo-300"
            >
              Forgot Password?
            </button>
          </div>

          <div className="relative flex items-center">
            <Lock className="pointer-events-none absolute left-3.5 h-4 w-4 text-slate-500" />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-700/80 bg-[#0B1120]/80 py-2.5 pl-10 pr-10 text-xs text-white placeholder:text-slate-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-slate-500 transition-colors hover:text-slate-300 focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-linear-to-r from-blue-600 via-indigo-600 to-indigo-700 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition-all hover:from-blue-500 hover:to-indigo-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            "Signing in..."
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>

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
    </div>
  );
}