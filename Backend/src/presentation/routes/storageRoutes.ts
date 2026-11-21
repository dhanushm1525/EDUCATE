import { Router } from "express";
import type { RouteDependencies } from "./routeDependencies";

export const createStorageRoutes = (
  dependencies: Pick<RouteDependencies, "authenticateUser"> & {
    users: Pick<RouteDependencies["users"], "generateProfileImageUploadUrl" | "updateProfileImage">;
  },
) => {
  const router = Router();
  router.post(
    "/profile-image/upload-url",
    dependencies.authenticateUser,
    dependencies.users.generateProfileImageUploadUrl.handle.bind(
      dependencies.users.generateProfileImageUploadUrl,
    ),
  );
  router.patch(
    "/profile-image",
    dependencies.authenticateUser,
    dependencies.users.updateProfileImage.handle.bind(dependencies.users.updateProfileImage),
  );
  return router;
};
