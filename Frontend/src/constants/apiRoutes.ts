export const API_ROUTES = {
  auth: {
    register: "/auth/register",
    verifyEmail: "/auth/verify-email",
    resendVerificationOtp: "/auth/resend-verification-otp",
    login: "/auth/login",
    refresh: "/auth/refresh",
    currentUser: "/auth/me",
    logout: "/auth/logout",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    googleSignIn: "/auth/google",
  },
  users: {
    profile: "/users/profile",
  },
  storage: {
    profileImageUploadUrl: "/storage/profile-image/upload-url",
    profileImage: "/storage/profile-image",
  },
} as const;
