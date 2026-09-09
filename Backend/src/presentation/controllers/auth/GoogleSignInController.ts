import { Request, Response, NextFunction } from "express";
import { successResponse } from "../../../shared/response/apiResponse";
import { IRefreshTokenCookie } from "../../../application/interfaces/IRefreshTokenCookie";
import { IGoogleSignIn } from "../../../application/interfaces/IGoogleSignIn";

export class GoogleSignInController {
  constructor(
    private readonly _googleSignIn: IGoogleSignIn,
    private readonly _refreshTokenCookie: IRefreshTokenCookie
  ) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { credential } = req.body;

      // Execute Google Sign-In use case
      const result = await this._googleSignIn.execute({ credential });

      // Store refresh token in HTTP-only cookie
      res.cookie(
        this._refreshTokenCookie.name,
        result.refreshToken,
        this._refreshTokenCookie.options
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