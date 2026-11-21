import { Router } from "express";
import type { RouteDependencies } from "./routeDependencies";

export const createUserRoutes = (
  dependencies: Pick<RouteDependencies, "authenticateUser"> & {
    users: Pick<RouteDependencies["users"], "getMyProfile">;
  },
) => {
  const router = Router();
  router.get(
    "/profile",
    dependencies.authenticateUser,
    dependencies.users.getMyProfile.handle.bind(dependencies.users.getMyProfile),
  );
  return router;
};
