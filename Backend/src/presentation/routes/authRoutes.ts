import { Router } from "express";

import { validate } from "../middlewares/validationMiddleware";

import { registerSchema }from "../../shared/schema/auth/registerSchema";

import { RegisterController }from "../controllers/auth/RegisterController";

import { registerUser }from "../../infrastructure/DI/authDependencies";


const router = Router();


const registerController =
    new RegisterController(
        registerUser
    );


router.post("/register",validate(registerSchema),(req, res, next) =>registerController.handle(
            req,
            res,
            next
        )
);


export default router;