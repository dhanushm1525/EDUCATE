import {Router} from "express";

import authRoutes from "./authRoutes";

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

export default router;