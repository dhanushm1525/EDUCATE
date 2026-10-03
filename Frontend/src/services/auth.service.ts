import { apiClient } from "./apiClient";
import { API_ROUTES } from "../constants/apiRoutes";


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
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ResetPasswordRequest,
    ResetPasswordResponse,
    GoogleSignInRequest,
    GoogleSignInResponse
} from "../types/auth";
import { refreshClient } from "./refreshClient";



export const authService = {

    register: async (
        data: RegisterRequest
    ): Promise<RegisterResponse> => {

        const response = await apiClient.post(
            API_ROUTES.auth.register,
            data
        );

        return response.data;
    },


    verifyEmailOtp: async (
        data: VerifyEmailOtpRequest
    ): Promise<VerifyEmailOtpResponse> => {

        const response = await apiClient.post(
            API_ROUTES.auth.verifyEmail,
            data
        );

        return response.data;
    },


    resendVerificationOtp: async (
        data: ResendVerificationOtpRequest
    ): Promise<ResendVerificationOtpResponse> => {

        const response = await apiClient.post(
            API_ROUTES.auth.resendVerificationOtp,
            data
        );

        return response.data;
    },


    login: async (
        data: LoginRequest
    ): Promise<LoginResponse> => {

        const response = await apiClient.post(
            API_ROUTES.auth.login,
            data
        );

        return response.data;
    },

    refreshAccessToken: async (): Promise<RefreshTokenResponse> => {

        const response = await refreshClient.post(
            API_ROUTES.auth.refresh
        );

        return response.data;

    },

    getCurrentUser: async (): Promise<GetCurrentUserResponse> => {

        const response = await apiClient.get(
            API_ROUTES.auth.currentUser
        );

        return response.data;

    },

    logout: async (): Promise<void> => {

        await apiClient.post(
            API_ROUTES.auth.logout
        );

    },

    forgotPassword: async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {

        const response =
            await apiClient.post(

                API_ROUTES.auth.forgotPassword,

                data

            );


        return response.data;

    },


    resetPassword: async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {

        const response =
            await apiClient.post(

                API_ROUTES.auth.resetPassword,

                data

            );


        return response.data;

    },



    googleSignIn: async (data: GoogleSignInRequest): Promise<GoogleSignInResponse> => {

        const response =
            await apiClient.post(

                API_ROUTES.auth.googleSignIn,

                data

            );


        return response.data;

    },







};