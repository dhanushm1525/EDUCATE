export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}


export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}


export interface RegisterResponse {
    success: boolean;
    message: string;

    data?: {
        user?: User;
    };
}


export interface VerifyEmailOtpRequest {
    userId: string;
    otp: string;
}


export interface VerifyEmailOtpResponse {
    success: boolean;
    message: string;
}


export interface ResendVerificationOtpRequest {
    email: string;
}


export interface ResendVerificationOtpResponse {
    success: boolean;
    message: string;
}