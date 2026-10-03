import { HttpStatusCode } from "../../shared/enums/HttpStatusCode";

import { Request,Response } from "express";


export const notFoundMiddleware=(
    _req:Request,
    res:Response
)=>{
    return res.status(HttpStatusCode.NOT_FOUND).json({
        success:false,
        message:"Route not found"
    });
};