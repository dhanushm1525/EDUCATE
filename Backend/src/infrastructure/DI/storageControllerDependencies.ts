import { GenerateProfileImageUploadUrl } from "../../application/use-cases/user/GenerateProfileImageUploadUrl";
import { GenerateProfileImageUploadUrlController } from "../../presentation/controllers/user/GenerateProfileImageUploadController";
import { s3StorageService } from "./storageDependencies";

const generateProfileImageUploadUrl = new GenerateProfileImageUploadUrl(
    s3StorageService
);

export const generateProfileImageUploadUrlController =
    new GenerateProfileImageUploadUrlController(
        generateProfileImageUploadUrl
    );