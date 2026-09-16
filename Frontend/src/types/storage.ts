export interface GenerateProfileImageUploadUrlDTO {
  fileName: string;
  contentType: string;
}

export interface GenerateProfileImageUploadUrlData {
  uploadUrl: string;
  key: string;
}

export interface GenerateProfileImageUploadUrlResponse {
  success: boolean;
  message: string;
  data: GenerateProfileImageUploadUrlData;
}