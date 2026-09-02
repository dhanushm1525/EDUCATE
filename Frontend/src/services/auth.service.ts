import { apiClient } from "./apiClient";


import type {
    RegisterRequest,
    RegisterResponse,
    VerifyEmailOtpRequest,
    VerifyEmailOtpResponse,
    ResendVerificationOtpRequest,
    ResendVerificationOtpResponse,
    LoginRequest,
    LoginResponse,
    RefreshTokenResponse,
    GetCurrentUserResponse,
} from "../types/auth";
import { refreshClient } from "./refreshClient";


export const authService = {

    register: async (
        data: RegisterRequest
    ): Promise<RegisterResponse> => {

        const response = await apiClient.post(
            "/auth/register",
            data
        );

        return response.data;
    },


    verifyEmailOtp: async (
        data: VerifyEmailOtpRequest
    ): Promise<VerifyEmailOtpResponse> => {

        const response = await apiClient.post(
            "/auth/verify-email",
            data
        );

        return response.data;
    },


    resendVerificationOtp: async (
        data: ResendVerificationOtpRequest
    ): Promise<ResendVerificationOtpResponse> => {

        const response = await apiClient.post(
            "/auth/resend-verification-otp",
            data
        );

        return response.data;
    },


    login: async (
        data: LoginRequest
    ): Promise<LoginResponse> => {

        const response = await apiClient.post(
            "/auth/login",
            data
        );

        return response.data;
    },

    refreshAccessToken: async (): Promise<RefreshTokenResponse> => {

        const response = await refreshClient.post(
            "/auth/refresh"
        );

        return response.data;

    },

    getCurrentUser: async (): Promise<GetCurrentUserResponse> => {

        const response = await apiClient.get(
            "/auth/me"
        );

        return response.data;

    },

    logout: async (): Promise<void> => {

    await apiClient.post(
        "/auth/logout"
    );

},

};