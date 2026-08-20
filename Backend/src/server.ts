import http from "http";

import app from "./app";

import { env } from "./infrastructure/config/env";
import { connectDatabase } from "./infrastructure/database/connection";

import { logger } from "./infrastructure/services/logger";

let server: http.Server;

const startServer = async () => {
  await connectDatabase();

  server = app.listen(
    env.port,
    () => {
      logger.info(
        `EDUCATE server running on port ${env.port}`
      );
    }
  );
};

const gracefulShutdown = async (
  signal: string
) => {
  logger.info(
    `${signal} received. Starting graceful shutdown.`
  );

  server.close(async () => {
    logger.info(
      "HTTP server closed."
    );

    process.exit(0);
  });
};

process.on(
  "SIGTERM",
  () => gracefulShutdown("SIGTERM")
);

process.on(
  "SIGINT",
  () => gracefulShutdown("SIGINT")
);

startServer().catch((error) => {
  logger.error(
    "Failed to start server",
    { error }
  );

  process.exit(1);
});