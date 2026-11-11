
import { Router } from "express";

import { UserRole } from "../../shared/enums/UserRole";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import type { RouteDependencies } from "./routeDependencies";

export const createEnrollmentRoutes = (dependencies: Pick<RouteDependencies, "authenticateUser" | "enrollments">) => {
    const router = Router();
    router.post(
        "/:courseId",
        dependencies.authenticateUser,
        roleMiddleware([UserRole.STUDENT, UserRole.TEACHER]),
        dependencies.enrollments.enroll.handle.bind(dependencies.enrollments.enroll)
    );
    router.get(
        "/my-courses",
        dependencies.authenticateUser,
        roleMiddleware([UserRole.STUDENT, UserRole.TEACHER]),
        dependencies.enrollments.getMine.handle.bind(dependencies.enrollments.getMine)
    );
    return router;
};
