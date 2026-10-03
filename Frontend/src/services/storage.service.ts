import axios from "axios";

import { apiClient } from "./apiClient";
import { API_ROUTES } from "../constants/apiRoutes";

import type {
  GenerateProfileImageUploadUrlDTO,
  GenerateProfileImageUploadUrlResponse,
} from "../types/storage";

export const storageService = {
  generateProfileImageUploadUrl: async (
    payload: GenerateProfileImageUploadUrlDTO
  ): Promise<GenerateProfileImageUploadUrlResponse> => {
    const response =
      await apiClient.post<GenerateProfileImageUploadUrlResponse>(
        API_ROUTES.storage.profileImageUploadUrl,
        payload
      );

    return response.data;
  },

  uploadFileToS3: async (
    uploadUrl: string,
    file: File
  ): Promise<void> => {
    await axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });
  },

  updateProfileImage: async (
    avatarKey: string
  ): Promise<void> => {
    await apiClient.patch(API_ROUTES.storage.profileImage, {
      avatarKey,
    });
  },
};