import {
    Request,
    Response,
    NextFunction
} from "express";

import {
    LoginUser
} from "../../../application/use-cases/auth/LoginUser";

import {
    LoginUserDTO
} from "../../../application/dtos/auth/LoginUserDTO";

import {
    successResponse
} from "../../../shared/response/apiResponse";

import {
    AUTH_MESSAGES
} from "../../../shared/messages/authMessages";

import { IRefreshTokenCookie } from "../../../application/interfaces/IRefreshTokenCookie";




export class LoginController {

    constructor(
        private readonly loginUser: LoginUser,
        private readonly refreshTokenCookie:IRefreshTokenCookie
    ) {}


    async handle(
        req: Request,
        res: Response,
        next: NextFunction
    ) {

        try {

            const dto: LoginUserDTO = {
                email: req.body.email,
                password: req.body.password
            };


            const result =
                await this.loginUser.execute(dto);


            res.cookie(
                this.refreshTokenCookie.name,
                result.refreshToken,
                this.refreshTokenCookie.options
            );

 
            return successResponse(
                res,
                200,
                AUTH_MESSAGES.LOGIN_SUCCESS,
                result.response
            );

        } catch (error) {

            next(error);
        }
    }
}