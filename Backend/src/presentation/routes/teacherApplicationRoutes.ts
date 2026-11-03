import { Router } from "express";

import {
    createTeacherApplicationController,
    getPendingTeacherApplicationsController,
    approveTeacherApplicationController,
    rejectTeacherApplicationController,
    generateTeacherApplicationUploadUrlController,
    getMyTeacherApplicationController
} from "../../infrastructure/DI/teacherApplicationDependencies";

import { authenticateUser }
    from "../../infrastructure/DI/authDependencies";

import { roleMiddleware }
    from "../middlewares/roleMiddleware";

import { UserRole }
    from "../../shared/enums/UserRole";

import { validate }
    from "../middlewares/validationMiddleware";

import { createTeacherApplicationSchema }
    from "../../shared/schema/teacherApplication/createTeacherApplicationSchema";

import { approveTeacherApplicationSchema }
    from "../../shared/schema/teacherApplication/approveTeacherApplicationSchema";

import { rejectTeacherApplicationSchema }
    from "../../shared/schema/teacherApplication/rejectTeacherApplicationSchema";

import { generateTeacherApplicationUploadUrlSchema }
    from "../../shared/schema/teacherApplication/generateTeacherApplicationUploadUrlSchema";


const router = Router();

// Student: Generate teacher application document upload URL

router.post(
    "/upload-url",
    authenticateUser,
    roleMiddleware(UserRole.STUDENT),
    validate(generateTeacherApplicationUploadUrlSchema),
    generateTeacherApplicationUploadUrlController.handle.bind(
        generateTeacherApplicationUploadUrlController
    )
);

// Student: Get own teacher application

router.get(
    "/my-application",
    authenticateUser,
    roleMiddleware(UserRole.STUDENT),
    getMyTeacherApplicationController.handle.bind(
        getMyTeacherApplicationController
    )
);


// Student: Submit teacher application
router.post(
    "/",
    authenticateUser,
    roleMiddleware(UserRole.STUDENT),
    validate(createTeacherApplicationSchema),
    createTeacherApplicationController.handle.bind(
        createTeacherApplicationController
    )
);


// Admin: Get pending teacher applications
router.get(
    "/pending",
    authenticateUser,
    roleMiddleware(UserRole.ADMIN),
    getPendingTeacherApplicationsController.handle.bind(
        getPendingTeacherApplicationsController
    )
);


// Admin: Approve teacher application
router.patch(
    "/:applicationId/approve",
    authenticateUser,
    roleMiddleware(UserRole.ADMIN),
    validate(approveTeacherApplicationSchema),
    approveTeacherApplicationController.handle.bind(
        approveTeacherApplicationController
    )
);


// Admin: Reject teacher application
router.patch(
    "/:applicationId/reject",
    authenticateUser,
    roleMiddleware(UserRole.ADMIN),
    validate(rejectTeacherApplicationSchema),
    rejectTeacherApplicationController.handle.bind(
        rejectTeacherApplicationController
    )
);


export default router;