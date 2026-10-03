import { HttpStatusCode } from "../../../../shared/enums/HttpStatusCode";

import { Request, Response, NextFunction } from "express";
import { IRegisterUser } from "../../../../application/interfaces/auth/IRegisterUser";
import { successResponse } from "../../../../shared/response/apiResponse";
import { AUTH_MESSAGES } from "../../../../shared/messages/authMessages";
import { AuthRequestMapper } from "../../../../application/mappers/AuthRequestMapper";


export class RegisterController {
    constructor(private readonly _registerUser: IRegisterUser) { }

    async handle(req: Request, res: Response, next: NextFunction) {
        try {

            const dto = AuthRequestMapper.toRegisterUserDTO(req.body);

            const result = await this._registerUser.execute(dto);

            return successResponse(res, HttpStatusCode.CREATED, AUTH_MESSAGES.REGISTRATION_SUCCESS, result);
        } catch (error) {
            next(error)
        }
    }
}