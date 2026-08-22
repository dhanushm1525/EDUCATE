import { RegisterUser } from "../../application/use-cases/auth/RegisterUser";
import { LoginUser } from "../../application/use-cases/auth/LoginUser";

import { LoginController } from "../../presentation/controllers/auth/LoginController";

import { IAuthConfig } from "../../application/interfaces/IAuthConfig";

import { MongoUserRepository } from "../repositories/MongoUserRepository";
import { MongoRefreshTokenRepository } from "../repositories/MongoRefreshTokenRepository";

import { BcryptPasswordHasher } from "../services/BcryptPasswordHasher";
import { JwtService } from "../services/JwtService";
import { Sha256TokenHasher } from "../services/Sha256TokenHasher";

import { refreshTokenCookie } from "../config/cookie";
import { env } from "../config/env";


const userRepository =
    new MongoUserRepository();

const refreshTokenRepository =
    new MongoRefreshTokenRepository();

const passwordHasher =
    new BcryptPasswordHasher();

const jwtService =
    new JwtService();

const tokenHasher =
    new Sha256TokenHasher();

const authConfig: IAuthConfig = {
    refreshTokenExpiresInMs:
        env.refreshTokenCookieMaxAge
};


export const registerUser =
    new RegisterUser(
        userRepository,
        passwordHasher
    );


export const loginUser =
    new LoginUser(
        userRepository,
        passwordHasher,
        jwtService,
        refreshTokenRepository,
        tokenHasher,
        authConfig
    );


export const loginController =
    new LoginController(
        loginUser,
        refreshTokenCookie
    );