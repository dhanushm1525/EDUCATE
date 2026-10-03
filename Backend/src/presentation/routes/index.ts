import { HttpStatusCode } from "../../shared/enums/HttpStatusCode";

import {Router} from "express";

import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes"
import storageRoutes from "./storageRoutes";
import courseRoutes from "./courseRoutes"
import categoryRoutes from "./categoryRoutes";
import chapterRoutes from "./chapterRoutes"
import lessonRoutes from "./lessonRoutes"
import teacherApplicationRoutes from "./teacherApplicationRoutes"

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

router.use("/auth",authRoutes);

router.use("/users",userRoutes)

router.use("/storage",storageRoutes)

router.use("/courses",courseRoutes);

router.use("/courses", chapterRoutes);

router.use("/categories", categoryRoutes);

router.use("/courses",lessonRoutes)

router.use("/teacher-applications",teacherApplicationRoutes)
export default router;