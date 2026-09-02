import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

import { authService } from "../../services/auth.service";
import { getApiErrorMessage } from "../../utils/apiError";

export default function LoginForm() {
  const navigate = useNavigate();

  const setAuth = useAuthStore((state) => state.setAuth);

  const [showPassword, setShowPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);

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

     setAuth(user,accessToken)

      /*
       * Role based redirection
       */

      if (user.role === "student") {
        navigate("/student");

        return;
      }

      if (user.role === "teacher") {
        navigate("/teacher");

        return;
      }

      /*
       * Fallback
       */

      navigate("/");
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-[#162032]/80 border border-slate-800/90 rounded-2xl p-7 sm:p-9 shadow-2xl backdrop-blur-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Welcome Back
        </h2>

        <p className="text-xs text-slate-400 mt-1">
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
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Email Address
          </label>

          <div className="relative flex items-center">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />

            <input
              type="email"
              name="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@company.com"
              className="w-full bg-[#0B1120]/80 border border-slate-700/80 rounded-lg pl-10 pr-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Password */}

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-medium text-slate-300">
              Password
            </label>

            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#0B1120]/80 border border-slate-700/80 rounded-lg pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Remember Me */}

        <div className="flex items-center pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="w-4 h-4 rounded bg-[#0B1120] border-slate-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
            />

            <span>Remember me for 30 days</span>
          </label>
        </div>

        {/* Submit */}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 bg-linear-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/30 cursor-pointer active:scale-[0.99]"
        >
          {isLoading ? (
            "Signing in..."
          ) : (
            <>
              <span>Sign In</span>

              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Register */}

      <p className="mt-6 text-center text-xs text-slate-400">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
}
