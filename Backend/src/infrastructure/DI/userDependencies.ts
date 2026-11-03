import { userRepository } from "./repositoryDependencies";

import { GetMyProfile } from "../../application/use-cases/user/GetMyProfile";
import { GetMyProfileController } from "../../presentation/controllers/user/GetMyProfileController";

import { UpdateProfileImage } from "../../application/use-cases/user/UpdateProfileImage";
import { UpdateProfileImageController } from "../../presentation/controllers/user/UpdateProfileImageController";
import {
    profileImagePolicy,
    s3StorageService
} from "./storageDependencies";

import { GetUsers } from "../../application/use-cases/user/GetUsers";
import { UpdateUserStatus } from "../../application/use-cases/user/UpdateUserStatus";

import { GetUsersController } from "../../presentation/controllers/user/GetUsersController";
import { UpdateUserStatusController } from "../../presentation/controllers/user/UpdateUserStatusController";

const getMyProfile = new GetMyProfile(
    userRepository,
    s3StorageService,
    profileImagePolicy
);

export const getMyProfileController =
    new GetMyProfileController(getMyProfile);

const updateProfileImage = new UpdateProfileImage(
    userRepository,
    profileImagePolicy
);

export const updateProfileImageController =
    new UpdateProfileImageController(
        updateProfileImage
    );


// Admin: User management

const getUsers = new GetUsers(userRepository);

export const getUsersController =
    new GetUsersController(getUsers);

const updateUserStatus =
    new UpdateUserStatus(userRepository);

export const updateUserStatusController =
    new UpdateUserStatusController(updateUserStatus);