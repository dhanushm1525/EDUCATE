import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, User } from "lucide-react";

import { authService } from "../../services/auth.service";
import { getApiErrorMessage } from "../../utils/apiError";
import { useToastStore } from "../../store/toastStore";
import { validateRegisterForm } from "../../utils/formValidation";
import AuthCard from "./AuthCard";
import AuthField from "./AuthField";
import AuthSubmitButton from "./AuthSubmitButton";

const registerInputClassName =
  "w-full rounded-lg border border-slate-700 bg-[#0F172A]/80 py-2.5 text-xs text-white placeholder:text-slate-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const addToast = useToastStore((state) => state.addToast);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = validateRegisterForm(
      formData.firstName,
      formData.lastName,
      formData.email,
      formData.password,
      formData.confirmPassword,
    );
    if (!validation.isValid) {
      addToast(validation.error ?? "Please check the form", "error");
      return;
    }

    try {
      setIsLoading(true);

      const response = await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      navigate("/verify-email", {
        state: {
          userId: response.data.id,
          email: response.data.email,
        },
      });
      console.log("Registration successful:", response);
    } catch (error: unknown) {
      addToast(getApiErrorMessage(error), "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard className="w-full max-w-md rounded-2xl border border-slate-700/70 bg-[#1E293B]/90 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
          Create your account
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Join thousands of learners
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <AuthField
          label="First Name"
          icon={User}
          name="firstName"
          autoComplete="given-name"
          required
          value={formData.firstName}
          onChange={handleChange}
          placeholder="John"
          inputClassName={registerInputClassName}
        />

        <AuthField
          label="Last Name"
          icon={User}
          name="lastName"
          autoComplete="family-name"
          required
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Doe"
          inputClassName={registerInputClassName}
        />

        <AuthField
          label="Email"
          icon={Mail}
          type="email"
          name="email"
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder="name@example.com"
          inputClassName={registerInputClassName}
        />

        <AuthField
          label="Password"
          icon={Lock}
          type="password"
          name="password"
          autoComplete="new-password"
          required
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          inputClassName={registerInputClassName}
        />

        <AuthField
          label="Confirm Password"
          icon={Lock}
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
          inputClassName={registerInputClassName}
        />

        <AuthSubmitButton
          isLoading={isLoading}
          loadingText="Creating Account..."
          showArrow={false}
          className="bg-linear-to-r from-blue-600 to-indigo-600 shadow-indigo-600/25 hover:to-indigo-500"
        >
          Create Account
        </AuthSubmitButton>
      </form>

      <p className="mt-5 text-center text-xs text-slate-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-indigo-400 underline underline-offset-2 transition-colors hover:text-indigo-300"
        >
          Login
        </Link>
      </p>
    </AuthCard>
  );
}
