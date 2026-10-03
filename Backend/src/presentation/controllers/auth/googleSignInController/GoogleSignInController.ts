import { HttpStatusCode } from "../../../../shared/enums/HttpStatusCode";

import { Request, Response, NextFunction } from "express";
import { successResponse } from "../../../../shared/response/apiResponse";
import { IRefreshTokenCookie } from "../../../../application/interfaces/auth/IRefreshTokenCookie";
import { IGoogleSignIn } from "../../../../application/interfaces/auth/IGoogleSignIn";
import { AuthRequestMapper } from "../../../../application/mappers/AuthRequestMapper";

export class GoogleSignInController {
  constructor(
    private readonly _googleSignIn: IGoogleSignIn,
    private readonly _refreshTokenCookie: IRefreshTokenCookie
  ) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Execute Google Sign-In use case
      const dto = AuthRequestMapper.toGoogleSignInDTO(req.body);
      const result = await this._googleSignIn.execute(dto);

      // Store refresh token in HTTP-only cookie
      res.cookie(
        this._refreshTokenCookie.name,
        result.refreshToken,
        this._refreshTokenCookie.options
      );

      // Return user data and access token
      successResponse(
        res,
        HttpStatusCode.OK,
        "Google sign-in successful",
        result.response
      );
    } catch (error) {
      next(error);
    }
  }
}