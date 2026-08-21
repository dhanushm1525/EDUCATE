import {
    Request,
    Response,
    NextFunction
} from "express";

import {
    ZodError
} from "zod";

import {
    AppError
} from "../../shared/errors/AppError";

import {
    errorResponse
} from "../../shared/response/apiResponse";

import {
    logger
} from "../../infrastructure/services/logger";


export const errorMiddleware = (
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {

    if (error instanceof ZodError) {

        return errorResponse(
            res,
            400,
            "Validation failed",
            error.flatten()
        );
    }


    if (error instanceof AppError) {

        return errorResponse(
            res,
            error.statusCode,
            error.message
        );
    }


    logger.error(
        "Unexpected server error",
        {
            error
        }
    );


    return errorResponse(
        res,
        500,
        "Internal Server error"
    );
};