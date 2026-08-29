import {Router} from "express";

import {getMyProfileController} from "../../infrastructure/DI/userDependencies";

import {authMiddleware} from "../middlewares/authMiddleware"
import { jwtService } from "../../infrastructure/DI/authDependencies";



const router = Router();


router.get(
    "/profile",

    authMiddleware(jwtService),

    getMyProfileController.handle.bind(
        getMyProfileController
    )
);


export default router;