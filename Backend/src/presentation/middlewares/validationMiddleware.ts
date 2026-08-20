import {
  Request,
  Response,
  NextFunction
} from "express";

import { ZodType } from "zod";

export const validate = (
  schema: ZodType
) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.flatten()
      });
    }

    next();
  };
};