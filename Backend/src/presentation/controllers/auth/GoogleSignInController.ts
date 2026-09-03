import { Request, Response, NextFunction } from "express";
import { GoogleSignIn } from "../../../application/use-cases/auth/GoogleSignIn";
import { successResponse } from "../../../shared/response/apiResponse";
import { IRefreshTokenCookie } from "../../../application/interfaces/IRefreshTokenCookie";

export class GoogleSignInController {
  constructor(
    private readonly googleSignIn: GoogleSignIn,
    private readonly refreshTokenCookie: IRefreshTokenCookie
  ) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { credential } = req.body;

      // Execute Google Sign-In use case
      const result = await this.googleSignIn.execute({ credential });

      // Store refresh token in HTTP-only cookie
      res.cookie(
        this.refreshTokenCookie.name,
        result.refreshToken,
        this.refreshTokenCookie.options
      );

      // Return user data and access token
      successResponse(
        res,
        200,
        "Google sign-in successful",
        result.response
      );
    } catch (error) {
      next(error);
    }
  }
}