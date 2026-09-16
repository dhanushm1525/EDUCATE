import {Router} from "express";

import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes"
import storageRoutes from "./storageRoutes";

const router = Router();

router.get(
  "/health",
  (_req, res) => {
    return res.status(200).json({
      success: true,
      message:
        "EDUCATE API is running",
      data: null
    });
  }
);

router.use(
  "/auth",
  authRoutes
);

router.use(
    "/users",
    userRoutes
)

router.use(
    "/storage",
    storageRoutes
)

export default router;