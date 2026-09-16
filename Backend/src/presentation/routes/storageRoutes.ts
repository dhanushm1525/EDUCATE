import { Router } from "express";

import {
    generateProfileImageUploadUrlController
} from "../../infrastructure/DI/storageControllerDependencies";

import {
    updateProfileImageController
} from "../../infrastructure/DI/userDependencies";

import { jwtService } from "../../infrastructure/DI/authDependencies";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post(
    "/profile-image/upload-url",
    authMiddleware(jwtService),
    generateProfileImageUploadUrlController.handle.bind(
        generateProfileImageUploadUrlController
    )
);

router.patch(
    "/profile-image",
    authMiddleware(jwtService),
    updateProfileImageController.handle.bind(
        updateProfileImageController
    )
);

export default router;