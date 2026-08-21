import { Request, Response, NextFunction } from "express";
import { RegisterUser } from "../../../application/use-cases/auth/RegisterUser";
import { successResponse } from "../../../shared/response/apiResponse";
import { RegisterUserDTO } from "../../../application/dtos/auth/RegisterUserDTO";


export class RegisterController {
    constructor(private readonly registerUser: RegisterUser) { }

    async handle(req: Request, res: Response, next: NextFunction) {
        try {

            const dto: RegisterUserDTO = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password
            };

            const result = await this.registerUser.execute(dto);

            return successResponse(res, 201, "registration successful", result);
        } catch (error) {
            next(error)
        }
    }
}