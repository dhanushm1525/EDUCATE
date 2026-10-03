import { HttpStatusCode } from "../../shared/enums/HttpStatusCode";

import { Request, Response, NextFunction } from "express";
import { AppError } from "../../shared/errors/AppError";
import { UserRole } from "../../shared/enums/UserRole";

export const roleMiddleware = (requiredRole: UserRole) => {
    return (
        req: Request,
        _res: Response,
        next: NextFunction
    ) => {
        try {
            if (!req.user) {
                throw new AppError("Authentication required", HttpStatusCode.UNAUTHORIZED);
            }

            if (req.user.role !== requiredRole) {
                throw new AppError("Access denied", HttpStatusCode.FORBIDDEN);
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};