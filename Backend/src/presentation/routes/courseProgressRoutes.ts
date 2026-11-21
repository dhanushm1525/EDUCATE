import { Router } from "express";

import { UserRole } from "../../shared/enums/UserRole";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import type { RouteController } from "./routeDependencies";

interface CourseProgressRouteDependencies {
  authenticateUser: import("express").RequestHandler;

  courseProgress: {
    recordAccess: RouteController;
    completeLesson: RouteController;
    getMine: RouteController;
    saveVideoProgress: RouteController;
  };
}

export const createCourseProgressRoutes = (dependencies: CourseProgressRouteDependencies) => {
  const router = Router();

  const allowedRoles = [UserRole.STUDENT, UserRole.TEACHER];

  router.get(
    "/my-progress",
    dependencies.authenticateUser,
    roleMiddleware(allowedRoles),
    dependencies.courseProgress.getMine.handle.bind(dependencies.courseProgress.getMine),
  );

  router.patch(
    "/:courseId/lessons/:lessonId/access",
    dependencies.authenticateUser,
    roleMiddleware(allowedRoles),
    dependencies.courseProgress.recordAccess.handle.bind(dependencies.courseProgress.recordAccess),
  );

  router.patch(
    "/:courseId/lessons/:lessonId/complete",
    dependencies.authenticateUser,
    roleMiddleware(allowedRoles),
    dependencies.courseProgress.completeLesson.handle.bind(
      dependencies.courseProgress.completeLesson,
    ),
  );

  router.patch(
    "/:courseId/lessons/:lessonId/video-progress",
    dependencies.authenticateUser,
    roleMiddleware(allowedRoles),
    dependencies.courseProgress.saveVideoProgress.handle.bind(
      dependencies.courseProgress.saveVideoProgress,
    ),
  );

  return router;
};
