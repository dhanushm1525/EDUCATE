import { Router } from "express";

import { validate } from "../middlewares/validationMiddleware";

import { registerSchema } from "../../shared/schema/auth/registerSchema";
import { loginSchema } from "../../shared/schema/auth/loginSchema";

import { verifyEmailOtpSchema } from "../../shared/schema/auth/verifyEmailOtpSchema";

import { resendVerificationOtpSchema } from "../../shared/schema/auth/resendVerificationOtpSchema";

import { forgotPasswordSchema } from "../../shared/schema/auth/forgotPasswordSchema";
import { resetPasswordSchema } from "../../shared/schema/auth/resetPasswordSchema";
import { googleSignInSchema } from "../../shared/schema/auth/googleSignInSchema";
import type { RouteDependencies } from "./routeDependencies";

export const createAuthRoutes = (
  dependencies: RouteDependencies["auth"] & Pick<RouteDependencies, "authenticateUser">,
) => {
  const router = Router();
  const { authenticateUser } = dependencies;
  const {
    register,
    login,
    refreshToken,
    logout,
    resetPassword,
    getCurrentUser,
    googleSignIn,
    verifyEmailOtp,
    resendVerificationOtp,
    forgotPassword,
  } = dependencies;

  router.post("/register", validate(registerSchema), register.handle.bind(register));

  router.post("/login", validate(loginSchema), login.handle.bind(login));

  router.post("/refresh", refreshToken.handle.bind(refreshToken));

  router.post("/logout", logout.handle.bind(logout));

  router.post(
    "/verify-email",
    validate(verifyEmailOtpSchema),
    verifyEmailOtp.handle.bind(verifyEmailOtp),
  );

  router.post(
    "/resend-verification-otp",
    validate(resendVerificationOtpSchema),
    resendVerificationOtp.handle.bind(resendVerificationOtp),
  );

  router.post(
    "/forgot-password",
    validate(forgotPasswordSchema),
    forgotPassword.handle.bind(forgotPassword),
  );

  router.post(
    "/reset-password",
    validate(resetPasswordSchema),
    resetPassword.handle.bind(resetPassword),
  );

  router.get("/me", authenticateUser, getCurrentUser.handle.bind(getCurrentUser));

  router.post("/google", validate(googleSignInSchema), googleSignIn.handle.bind(googleSignIn));

  return router;
};
