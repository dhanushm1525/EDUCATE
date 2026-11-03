import { Router } from "express";

import {
    generateProfileImageUploadUrlController
} from "../../infrastructure/DI/storageControllerDependencies";

import {
    updateProfileImageController
} from "../../infrastructure/DI/userDependencies";

import { authenticateUser } from "../../infrastructure/DI/authDependencies";


const router = Router();

router.post(
    "/profile-image/upload-url",
    authenticateUser,
    generateProfileImageUploadUrlController.handle.bind(
        generateProfileImageUploadUrlController
    )
);

router.patch(
    "/profile-image",
    authenticateUser,
    updateProfileImageController.handle.bind(
        updateProfileImageController
    )
);

export default router;