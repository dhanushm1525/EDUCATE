import {Router} from "express";

import {getMyProfileController} from "../../infrastructure/DI/userDependencies";


import { authenticateUser } from "../../infrastructure/DI/authDependencies";



const router = Router();


router.get(
    "/profile",

    authenticateUser,

    getMyProfileController.handle.bind(
        getMyProfileController
    )
);


export default router;