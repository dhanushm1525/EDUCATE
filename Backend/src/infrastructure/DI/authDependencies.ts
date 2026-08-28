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

export const logoutUser = new LogoutUser(refreshTokenRepository,tokenHasher);

const emailVerificationRepository = new MongoEmailVerificationRepository()

const otpGenerator = new OtpGenerator();

const emailService = new ResendEmailService()


export const loginController = new LoginController(loginUser,refreshTokenCookie);

export const refreshTokenController = new RefreshTokenController(refreshAccessToken,refreshTokenCookie)

export const logoutController = new LogoutController(logoutUser,refreshTokenCookie);

export const sendVerificationOtp = new SendVerificationOtp(
    emailVerificationRepository,
    otpGenerator,
    tokenHasher,
    emailService,
    authConfig
)





export const registerUser =
    new RegisterUser(
        userRepository,
        passwordHasher,
        sendVerificationOtp
    );
