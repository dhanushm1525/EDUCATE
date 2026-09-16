import { userRepository } from "./repositoryDependencies";

import { GetMyProfile } from "../../application/use-cases/user/GetMyProfile";
import { GetMyProfileController } from "../../presentation/controllers/user/GetMyProfileController";

import { UpdateProfileImage } from "../../application/use-cases/user/UpdateProfileImage";
import { UpdateProfileImageController } from "../../presentation/controllers/user/UpdateProfileImageController";
import { s3StorageService } from "./storageDependencies";

const getMyProfile = new GetMyProfile(userRepository,s3StorageService);

export const getMyProfileController =
    new GetMyProfileController(getMyProfile);

const updateProfileImage = new UpdateProfileImage(
    userRepository
);

export const updateProfileImageController =
    new UpdateProfileImageController(
        updateProfileImage
    );