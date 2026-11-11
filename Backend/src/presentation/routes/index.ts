import { HttpStatusCode } from "../../shared/enums/HttpStatusCode";
import { Router } from "express";
import { createAuthRoutes } from "./authRoutes";
import { createUserRoutes } from "./userRoutes";
import { createStorageRoutes } from "./storageRoutes";
import { createCourseRoutes } from "./courseRoutes";
import { createCategoryRoutes } from "./categoryRoutes";
import { createChapterRoutes } from "./chapterRoutes";
import { createLessonRoutes } from "./lessonRoutes";
import { createTeacherApplicationRoutes } from "./teacherApplicationRoutes";
import { createAssignmentRoutes } from "./assingmentRoutes";
import { createEnrollmentRoutes } from "./enrollmentRoutes";
import { createAdminUserRoutes } from "./adminUserRoutes";
import type { RouteDependencies } from "./routeDependencies";

export const createApiRouter = (dependencies: RouteDependencies) => {
const router = Router();

router.get(
  "/health",
  (_req, res) => {
    return res.status(HttpStatusCode.OK).json({
      success: true,
      message:
        "EDUCATE API is running",
      data: null
    });
  }
);

router.use("/auth", createAuthRoutes({ ...dependencies.auth, authenticateUser: dependencies.authenticateUser }));

router.use("/users", createUserRoutes(dependencies));

router.use("/storage", createStorageRoutes(dependencies));

router.use("/courses", createCourseRoutes(dependencies));

router.use("/courses", createChapterRoutes(dependencies));

router.use("/categories", createCategoryRoutes(dependencies));

router.use("/courses", createLessonRoutes(dependencies));

router.use("/teacher-applications", createTeacherApplicationRoutes(dependencies));

router.use("/", createAssignmentRoutes(dependencies));

router.use("/enrollments", createEnrollmentRoutes(dependencies));

router.use("/admin/users", createAdminUserRoutes(dependencies));

return router;
};