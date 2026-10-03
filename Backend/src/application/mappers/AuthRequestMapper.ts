import { ForgotPasswordDTO } from "../dtos/auth/ForgotPasswordDTO";
import { GetCurrentUserDTO } from "../dtos/auth/GetCurrentUserDTO";
import { GoogleSignInDTO } from "../dtos/auth/GoogleSignInDTO";
import { LoginUserDTO } from "../dtos/auth/LoginUserDTO";
import { LogoutUserDTO } from "../dtos/auth/LogoutUserDTO";
import { RefreshAccessTokenDTO } from "../dtos/auth/RefreshAccessTokenDTO";
import { RegisterUserDTO } from "../dtos/auth/RegisterUserDTO";
import { ResendVerificationOtpDTO } from "../dtos/auth/ResendVerificationOtpDTO";
import { ResetPasswordDTO } from "../dtos/auth/ResetPasswordDTO";
import { VerifyEmailOtpDTO } from "../dtos/auth/VerifyEmailOtpDTO";

export class AuthRequestMapper {

    static toRegisterUserDTO(body: RegisterUserDTO): RegisterUserDTO {
        return {
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            password: body.password,
        };
    }

    static toLoginUserDTO(body: LoginUserDTO): LoginUserDTO {
        return {
            email: body.email,
            password: body.password,
        };
    }

    static toRefreshAccessTokenDTO(
        refreshToken: string
    ): RefreshAccessTokenDTO {
        return { refreshToken };
    }

    static toLogoutUserDTO(refreshToken?: string): LogoutUserDTO {
        return { refreshToken };
    }

    static toForgotPasswordDTO(body: ForgotPasswordDTO): ForgotPasswordDTO {
        return { email: body.email };
    }

    static toResetPasswordDTO(body: ResetPasswordDTO): ResetPasswordDTO {
        return {
            email: body.email,
            otp: body.otp,
            newPassword: body.newPassword,
        };
    }

    static toResendVerificationOtpDTO(
        body: ResendVerificationOtpDTO
    ): ResendVerificationOtpDTO {
        return { email: body.email };
    }

    static toVerifyEmailOtpDTO(
        body: VerifyEmailOtpDTO
    ): VerifyEmailOtpDTO {
        return {
            userId: body.userId,
            otp: body.otp,
        };
    }

    static toGoogleSignInDTO(body: GoogleSignInDTO): GoogleSignInDTO {
        return { credential: body.credential };
    }

    static toGetCurrentUserDTO(userId: string): GetCurrentUserDTO {
        return { userId };
    }
}
