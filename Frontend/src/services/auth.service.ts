import { apiClient } from "./apiClient";

import type {
    RegisterRequest,
    RegisterResponse,
    VerifyEmailOtpRequest,
    VerifyEmailOtpResponse,
    ResendVerificationOtpRequest,
    ResendVerificationOtpResponse,
} from "../types/auth";


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
    }

};