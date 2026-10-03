import { HttpStatusCode } from "../../shared/enums/HttpStatusCode";

import { Request, Response, NextFunction } from "express";
import { AppError } from "../../shared/errors/AppError";
import { UserRole } from "../../shared/enums/UserRole";
import { AUTH_MESSAGES } from "../../shared/messages/authMessages";

export const roleMiddleware = (requiredRole: UserRole) => {
    return (
        req: Request,
        _res: Response,
        next: NextFunction
    ) => {
        try {
            if (!req.user) {
                throw new AppError(AUTH_MESSAGES.AUTHENTICATION_REQUIRED, HttpStatusCode.UNAUTHORIZED);
            }

            if (req.user.role !== requiredRole) {
                throw new AppError(AUTH_MESSAGES.ACCESS_DENIED, HttpStatusCode.FORBIDDEN);
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};