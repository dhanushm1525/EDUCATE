import { HttpStatusCode } from "../../shared/enums/HttpStatusCode";

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
    ILogger
} from "../../application/interfaces/services/ILogger";


export const errorMiddleware = (
    logger: ILogger
) => {

    return (
        error: unknown,
        _req: Request,
        res: Response,
        _next: NextFunction
    ) => {

        if (error instanceof ZodError) {

            return errorResponse(
                res,
                HttpStatusCode.BAD_REQUEST,
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
            HttpStatusCode.INTERNAL_SERVER_ERROR,
            "Internal Server error"
        );
    };
};