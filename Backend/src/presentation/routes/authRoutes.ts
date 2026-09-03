import { Router } from "express";

import { validate } from "../middlewares/validationMiddleware";

import { registerSchema } from "../../shared/schema/auth/registerSchema";
import { loginSchema } from "../../shared/schema/auth/loginSchema";

import { RegisterController } from "../controllers/auth/RegisterController";

import {registerUser,loginController,refreshTokenController,logoutController, resetPasswordController,getCurrentUserController, googleSignInController} from "../../infrastructure/DI/authDependencies";


import { verifyEmailOtpSchema } from "../../shared/schema/auth/verifyEmailOtpSchema";

import { verifyEmailOtpController } from "../../infrastructure/DI/authDependencies";

import { resendVerificationOtpSchema } from "../../shared/schema/auth/resendVerificationOtpSchema";

import { resendVerificationOtpController,forgotPasswordController } from "../../infrastructure/DI/authDependencies";

import { forgotPasswordSchema } from "../../shared/schema/auth/forgotPasswordSchema";
import { resetPasswordSchema } from "../../shared/schema/auth/resetPasswordSchema";
import { authenticateUser } from "../../infrastructure/DI/authDependencies";

import { googleSignInSchema } from "../../shared/schema/auth/googleSignInSchema";


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

router.post(
    "/logout",
    logoutController.handle.bind(logoutController)
)


router.post(
    "/verify-email",
    validate(verifyEmailOtpSchema),
    verifyEmailOtpController.handle.bind(
        verifyEmailOtpController
    )
);


router.post(
    "/resend-verification-otp",
    validate(resendVerificationOtpSchema),
    resendVerificationOtpController.handle.bind(
        resendVerificationOtpController
    )
);


router.post(
    "/forgot-password",
    validate(forgotPasswordSchema),
    forgotPasswordController.handle.bind(
        forgotPasswordController
    )
);


router.post(
    "/reset-password",
    validate(resetPasswordSchema),
    resetPasswordController.handle.bind(
        resetPasswordController
    )
);

router.get(
    "/me",
    authenticateUser,
    getCurrentUserController.handle.bind(getCurrentUserController)
)

router.post("/google",validate(googleSignInSchema),googleSignInController.handle.bind(googleSignInController))

export default router;
