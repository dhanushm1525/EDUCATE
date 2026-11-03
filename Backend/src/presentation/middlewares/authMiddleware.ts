
import { Request, Response, NextFunction } from "express";

import { IJwtService } from "../../application/interfaces/auth/IJwtService";
import { IUserRepository } from "../../domain/repositories/userRepositories/IUserRepository";

import { AppError } from "../../shared/errors/AppError";
import { HttpStatusCode } from "../../shared/enums/HttpStatusCode";
import { UserStatus } from "../../shared/enums/UserStatus";
import { AUTH_MESSAGES } from "../../shared/messages/authMessages";

export const authMiddleware = (
    jwtService: IJwtService,
    userRepository: IUserRepository
) => {
    return async (
        req: Request,
        _res: Response,
        next: NextFunction
    ) => {
        try {
            const authorizationHeader = req.headers.authorization;

            if (!authorizationHeader) {
                throw new AppError(
                    "Authentication token is required",
                    HttpStatusCode.UNAUTHORIZED
                );
            }

            const [scheme, token] = authorizationHeader.split(" ");

            if (scheme !== "Bearer" || !token) {
                throw new AppError(
                    "Invalid authentication token",
                    HttpStatusCode.UNAUTHORIZED
                );
            }

            // Verify access token
            let payload;

            try {
                payload = jwtService.verifyAccessToken(token);
            } catch {
                throw new AppError(
                    "Invalid or expired token",
                    HttpStatusCode.UNAUTHORIZED
                );
            }

            // Fetch the latest user state from MongoDB
            const user = await userRepository.findById(payload.userId);

            if (!user) {
                throw new AppError(
                    "User account not found",
                    HttpStatusCode.UNAUTHORIZED
                );
            }

            // Reject blocked accounts, even if their JWT is still valid
            if (user.status === UserStatus.BLOCKED) {
                throw new AppError(
                    AUTH_MESSAGES.ACCOUNT_BLOCKED,
                    HttpStatusCode.FORBIDDEN
                );
            }

            // Use the current role from the database, not the JWT
            req.user = {
                userId: user.id!,
                role: user.role
            };

            next();
        } catch (error) {
            next(error);
        }
    };
};
