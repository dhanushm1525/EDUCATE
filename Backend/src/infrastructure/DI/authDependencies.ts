import { RegisterUser } from "../../application/use-cases/auth/RegisterUser";
import { LoginUser } from "../../application/use-cases/auth/LoginUser";

import { LoginController } from "../../presentation/controllers/auth/LoginController";


import { MongoUserRepository } from "../repositories/MongoUserRepository";
import { MongoRefreshTokenRepository } from "../repositories/MongoRefreshTokenRepository";

import { BcryptPasswordHasher } from "../services/BcryptPasswordHasher";
import { JwtService } from "../services/JwtService";
import { Sha256TokenHasher } from "../services/Sha256TokenHasher";

import { refreshTokenCookie } from "../config/cookie";

import { RefreshAccessToken } from "../../application/use-cases/auth/RefreshAccessToken";
import { authConfig } from "../config/authConfig";
import { RefreshTokenController } from "../../presentation/controllers/auth/RefreshTokenController";
import { LogoutUser } from "../../application/use-cases/auth/LogoutUser";
import { LogoutController } from "../../presentation/controllers/auth/LogoutController";
import { MongoEmailVerificationRepository } from "../repositories/MongoEmailVerificationRepository";
import { OtpGenerator } from "../services/OtpGenerator";
import { ResendEmailService } from "../services/ResendEmailService";
import { SendVerificationOtp } from "../../application/use-cases/auth/SendVerificationOtp";

import { VerifyEmailOtp } from "../../application/use-cases/auth/VerifyEmailOtp";
import { VerifyEmailOtpController } from "../../presentation/controllers/auth/VerifyEmailOtpController";
import { ResendVerificationOtp } from "../../application/use-cases/auth/ResendVerificationOtp";
import { ResendVerificationOtpController } from "../../presentation/controllers/auth/ResendVerificationOtpController";
import { MongoPasswordResetRepository } from "../repositories/MongoPasswordResetRepository";
import { ForgotPassword } from "../../application/use-cases/auth/ForgotPassword";
import { ForgotPasswordController } from "../../presentation/controllers/auth/ForgotPasswordController";
import { ResetPassword } from "../../application/use-cases/auth/ResetPassword";
import { ResetPasswordController } from "../../presentation/controllers/auth/ResetPasswordController";
import { GetCurrentUser } from "../../application/use-cases/auth/GetCurrentUser";
import { GetCurrentUserController } from "../../presentation/controllers/auth/GetCurrentUserController";
import { authMiddleware } from "../../presentation/middlewares/authMiddleware";
import { GoogleAuthService } from "../services/GoogleAuthService";
import { GoogleSignIn } from "../../application/use-cases/auth/GoogleSignIn";
import { GoogleSignInController } from "../../presentation/controllers/auth/GoogleSignInController";

const userRepository =
    new MongoUserRepository();

const refreshTokenRepository =
    new MongoRefreshTokenRepository();

const passwordHasher =
    new BcryptPasswordHasher();

export const jwtService =
    new JwtService();

const tokenHasher =
    new Sha256TokenHasher();




export const loginUser =
    new LoginUser(
        userRepository,
        passwordHasher,
        jwtService,
        refreshTokenRepository,
        tokenHasher,
        authConfig
    );





export const refreshAccessToken =
    new RefreshAccessToken(
        userRepository,
        refreshTokenRepository,
        jwtService,
        tokenHasher,
        authConfig
    )

export const logoutUser = new LogoutUser(refreshTokenRepository, tokenHasher);

const emailVerificationRepository = new MongoEmailVerificationRepository()

const otpGenerator = new OtpGenerator();

const emailService = new ResendEmailService()


export const loginController = new LoginController(loginUser, refreshTokenCookie);

export const refreshTokenController = new RefreshTokenController(refreshAccessToken, refreshTokenCookie)

export const logoutController = new LogoutController(logoutUser, refreshTokenCookie);

export const sendVerificationOtp = new SendVerificationOtp(
    emailVerificationRepository,
    otpGenerator,
    tokenHasher,
    emailService,
    authConfig
)


export const verifyEmailOtp = new VerifyEmailOtp(
    userRepository,
    emailVerificationRepository,
    tokenHasher
)


export const registerUser =
    new RegisterUser(
        userRepository,
        passwordHasher,
        sendVerificationOtp
    );



export const verifyEmailOtpController = new VerifyEmailOtpController(verifyEmailOtp)


export const resendVerificationOtp =
    new ResendVerificationOtp(
        userRepository,
        sendVerificationOtp
    );

const passwordResetRepository = new MongoPasswordResetRepository();

export const forgotPassword = new ForgotPassword(userRepository,passwordResetRepository,otpGenerator,tokenHasher,emailService,authConfig)

export const forgotPasswordController=new ForgotPasswordController(forgotPassword)

export const resendVerificationOtpController = new ResendVerificationOtpController(resendVerificationOtp)


export const resetPassword = new ResetPassword(userRepository,passwordResetRepository,passwordHasher,tokenHasher,refreshTokenRepository)

export const resetPasswordController = new ResetPasswordController(resetPassword)

const getCurrentUser =new GetCurrentUser(userRepository);

export const getCurrentUserController = new GetCurrentUserController(getCurrentUser)

export const authenticateUser = authMiddleware(jwtService)



const googleAuthService = new GoogleAuthService(process.env.GOOGLE_CLIENT_ID!)

export const googleSignIn = new GoogleSignIn(userRepository,googleAuthService,jwtService,refreshTokenRepository,tokenHasher,authConfig)

export const googleSignInController = new GoogleSignInController(googleSignIn,refreshTokenCookie)