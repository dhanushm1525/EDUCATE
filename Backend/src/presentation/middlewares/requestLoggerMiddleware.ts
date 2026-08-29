import {
  Request,
  Response,
  NextFunction
} from "express";

import { ILogger } from "../../application/interfaces/ILogger";

export const requestLoggerMiddleware = (logger:ILogger) =>(
    req:Request,
    res:Response,
    next:NextFunction
)=> {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    logger.info("HTTP request", {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get("user-agent")
    });
  });

  next();
};