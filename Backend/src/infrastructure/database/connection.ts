import mongoose from "mongoose";

import { env } from "../config/env";
import { logger } from "../services/logger";
import * as dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

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