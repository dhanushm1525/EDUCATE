import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { env } from "./infrastructure/config/env";



import { notFoundMiddleware } from "./presentation/middlewares/notFoundMiddleware";
import { errorMiddleware } from "./presentation/middlewares/errorMiddleware";
import { requestLoggerMiddleware } from "./presentation/middlewares/requestLoggerMiddleware";

import apiRoutes from "./presentation/routes"

const app = express();

app.disable("x-powered-by");

app.use(helmet());

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false
  })
);

app.use(express.json({ limit: "1mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb"
  })
);

app.use(requestLoggerMiddleware)
app.use("/api",apiRoutes)

app.use(notFoundMiddleware);

app.use(errorMiddleware);



export default app;