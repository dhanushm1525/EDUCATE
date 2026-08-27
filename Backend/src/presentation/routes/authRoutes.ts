import { Router } from "express";

import { validate } from "../middlewares/validationMiddleware";

import { registerSchema } from "../../shared/schema/auth/registerSchema";
import { loginSchema } from "../../shared/schema/auth/loginSchema";

import { RegisterController } from "../controllers/auth/RegisterController";

import {registerUser,loginController,refreshTokenController} from "../../infrastructure/DI/authDependencies";


const router = Router();


const registerController =
    new RegisterController(
        registerUser
    );




router.post(
    "/register",
    validate(registerSchema),
    registerController.handle.bind(registerController)
);

router.post(
    "/login",
    validate(loginSchema),
    loginController.handle.bind(loginController)
);

router.post(
    "/refresh",
    refreshTokenController.handle.bind(
        refreshTokenController
    )
);

export default router;