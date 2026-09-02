import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { Mail, ArrowRight, ArrowLeft } from "lucide-react";

import { authService } from "../../services/auth.service";

import { getApiErrorMessage } from "../../utils/apiError";

export default function ForgotPasswordForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);

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
      setError(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="
                w-full
                max-w-md
                bg-[#162032]/80
                border
                border-slate-800/90
                rounded-2xl
                p-7
                sm:p-9
                shadow-2xl
                backdrop-blur-md
            "
    >
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

      {/* Error */}

      {error && (
        <div
          className="
                            mb-4
                            rounded-lg
                            border
                            border-red-500/30
                            bg-red-500/10
                            px-3
                            py-2
                            text-xs
                            text-red-300
                        "
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}

        <div>
          <label
            className="
                            block
                            text-xs
                            font-medium
                            text-slate-300
                            mb-1.5
                        "
          >
            Email Address
          </label>

          <div
            className="
                            relative
                            flex
                            items-center
                        "
          >
            <Mail
              className="
                                w-4
                                h-4
                                text-slate-500
                                absolute
                                left-3.5
                                pointer-events-none
                            "
            />

            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              className="
                                w-full
                                bg-[#0B1120]/80
                                border
                                border-slate-700/80
                                rounded-lg
                                pl-10
                                pr-3.5
                                py-2.5
                                text-xs
                                text-white
                                placeholder:text-slate-500
                                focus:outline-none
                                focus:border-indigo-500
                                focus:ring-1
                                focus:ring-indigo-500
                                transition-colors
                            "
            />
          </div>
        </div>

        {/* Submit */}

        <button
          type="submit"
          disabled={isLoading}
          className="
                        w-full
                        mt-2
                        bg-linear-to-r
                        from-blue-600
                        via-indigo-600
                        to-indigo-700
                        hover:from-blue-500
                        hover:to-indigo-600
                        disabled:opacity-60
                        disabled:cursor-not-allowed
                        text-white
                        font-semibold
                        py-2.5
                        px-4
                        rounded-lg
                        text-xs
                        flex
                        items-center
                        justify-center
                        gap-1.5
                        transition-all
                        shadow-md
                        shadow-indigo-600/30
                        cursor-pointer
                        active:scale-[0.99]
                    "
        >
          {isLoading ? (
            "Sending OTP..."
          ) : (
            <>
              <span>Send Reset OTP</span>

              <ArrowRight
                className="
                                            w-3.5
                                            h-3.5
                                        "
              />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
