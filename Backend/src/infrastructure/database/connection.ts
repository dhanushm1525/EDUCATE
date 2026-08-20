import mongoose from "mongoose";

import { env } from "../config/env";
import { logger } from "../services/logger";

export const connectDatabase =
  async (): Promise<void> => {
    try {
      await mongoose.connect(env.mongoUri);

      logger.info(
        "MongoDB connected successfully"
      );
    } catch (error) {
      logger.error(
        "MongoDB connection failed",
        { error }
      );

      throw error;
    }
  };