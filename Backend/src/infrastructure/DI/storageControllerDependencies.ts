import { GenerateProfileImageUploadUrl } from "../../application/use-cases/user/GenerateProfileImageUploadUrl";
import { GenerateProfileImageUploadUrlController } from "../../presentation/controllers/user/GenerateProfileImageUploadController";
import {
    imageTypePolicy,
    profileImagePolicy,
    s3StorageService
} from "./storageDependencies";

const generateProfileImageUploadUrl = new GenerateProfileImageUploadUrl(
    s3StorageService,
    imageTypePolicy,
    profileImagePolicy
);

export const generateProfileImageUploadUrlController =
    new GenerateProfileImageUploadUrlController(
        generateProfileImageUploadUrl
    );