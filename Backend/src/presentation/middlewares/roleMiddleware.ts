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
                throw new AppError("Authentication required", 401);
            }

            if (req.user.role !== requiredRole) {
                throw new AppError("Access denied", 403);
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};