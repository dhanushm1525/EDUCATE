import { HttpStatusCode } from "../../../../shared/enums/HttpStatusCode";

import {
    Request,
    Response,
    NextFunction
} from "express";

import {
    successResponse
} from "../../../../shared/response/apiResponse";

import {
    AUTH_MESSAGES
} from "../../../../shared/messages/authMessages";

import { IRefreshTokenCookie } from "../../../../application/interfaces/auth/IRefreshTokenCookie";
import { ILoginUser } from "../../../../application/interfaces/auth/ILoginUser";
import { AuthRequestMapper } from "../../../../application/mappers/AuthRequestMapper";




export class LoginController {

    constructor(
        private readonly _loginUser: ILoginUser,
        private readonly _refreshTokenCookie:IRefreshTokenCookie
    ) {}


    async handle(
        req: Request,
        res: Response,
        next: NextFunction
    ) {

        try {

            const dto = AuthRequestMapper.toLoginUserDTO(req.body);


            const result =
                await this._loginUser.execute(dto);


            res.cookie(
                this._refreshTokenCookie.name,
                result.refreshToken,
                this._refreshTokenCookie.options
            );

 
            return successResponse(
                res,
                HttpStatusCode.OK,
                AUTH_MESSAGES.LOGIN_SUCCESS,
                result.response
            );

        } catch (error) {

            next(error);
        }
    }
}