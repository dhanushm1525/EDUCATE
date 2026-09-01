export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}


export interface RegisteredUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}


export interface RegisterResponse {
    success: boolean;
    message: string;
    data: RegisteredUser;
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



export interface LoginRequest {
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


export interface LoginResponse {
    success: boolean;
    message: string;

    data: {
        user: User;
        accessToken: string;
    };




}


export interface RefreshTokenResponse {
    success: boolean;
    message: string;

    data: {
        accessToken: string;
    };
}