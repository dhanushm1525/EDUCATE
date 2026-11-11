import { Router } from "express";

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
import type { RouteDependencies } from "./routeDependencies";


export const createTeacherApplicationRoutes = (dependencies: Pick<RouteDependencies, "authenticateUser" | "teacherApplications">) => {
const router = Router();

// Student: Generate teacher application document upload URL

router.post(
    "/upload-url",
    dependencies.authenticateUser,
    roleMiddleware(UserRole.STUDENT),
    validate(generateTeacherApplicationUploadUrlSchema),
    dependencies.teacherApplications.generateUploadUrl.handle.bind(dependencies.teacherApplications.generateUploadUrl)
);

// Student: Get own teacher application

router.get(
    "/my-application",
    dependencies.authenticateUser,
    roleMiddleware(UserRole.STUDENT),
    dependencies.teacherApplications.getMine.handle.bind(dependencies.teacherApplications.getMine)
);


// Student: Submit teacher application
router.post(
    "/",
    dependencies.authenticateUser,
    roleMiddleware(UserRole.STUDENT),
    validate(createTeacherApplicationSchema),
    dependencies.teacherApplications.create.handle.bind(dependencies.teacherApplications.create)
);


// Admin: Get pending teacher applications
router.get(
    "/pending",
    dependencies.authenticateUser,
    roleMiddleware(UserRole.ADMIN),
    dependencies.teacherApplications.getPending.handle.bind(dependencies.teacherApplications.getPending)
);


// Admin: Approve teacher application
router.patch(
    "/:applicationId/approve",
    dependencies.authenticateUser,
    roleMiddleware(UserRole.ADMIN),
    validate(approveTeacherApplicationSchema),
    dependencies.teacherApplications.approve.handle.bind(dependencies.teacherApplications.approve)
);


// Admin: Reject teacher application
router.patch(
    "/:applicationId/reject",
    dependencies.authenticateUser,
    roleMiddleware(UserRole.ADMIN),
    validate(rejectTeacherApplicationSchema),
    dependencies.teacherApplications.reject.handle.bind(dependencies.teacherApplications.reject)
);


return router;
};