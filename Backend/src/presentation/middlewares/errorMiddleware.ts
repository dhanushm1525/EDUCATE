import { Request, Response, NextFunction } from "express";
import { AppError } from "../../shared/errors/AppError";



export const errorMiddleware = (
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
)=>{
    console.error(error)

    if(error instanceof AppError){
        return res.status(error.statusCode).json({
            success:false,
            message:error.message
        });
    }

    return res.status(500).json({
        success:false,
        message:"Internal Server error"
    });
}

