import { Request, Response, NextFunction } from "express";
import { z } from "zod";

type ValidationData = {
  body: unknown;
  params: unknown;
  query: unknown;
};

export const validate = (
  schema: z.ZodType<ValidationData>
) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.flatten(),
      });
    }

    req.body = result.data.body;
    req.params = result.data.params;
    req.query = result.data.query;

    next();
  };
};