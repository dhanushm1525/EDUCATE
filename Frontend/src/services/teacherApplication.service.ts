
import axios from "axios";

import { apiClient } from "./apiClient";
import { API_ROUTES } from "../constants/apiRoutes";

import type {
    TeacherApplication,
    TeacherApplicationsResponse,
    TeacherApplicationActionResponse,
    TeacherApplicationActionResult,
    StudentTeacherApplication,
    StudentTeacherApplicationResponse,
    CreateTeacherApplicationRequest,
    CreateTeacherApplicationResponse,
    GenerateTeacherApplicationUploadUrlResponse,
    TeacherApplicationFileType,
} from "../types/teacherApplication";

export const teacherApplicationService = {

    // Admin: Get pending applications
    getPendingApplications: async (): Promise<TeacherApplication[]> => {
        const response =
            await apiClient.get<TeacherApplicationsResponse>(
                API_ROUTES.teacherApplications.pending
            );

        return response.data.data;
    },

    // Admin: Approve application
   approveApplication: async (
    applicationId: string
): Promise<TeacherApplicationActionResult> => {
    const response =
        await apiClient.patch<TeacherApplicationActionResponse>(
            API_ROUTES.teacherApplications.approve(applicationId),
            {}
        );

    return response.data.data;
},

    // Admin: Reject application
    rejectApplication: async (
        applicationId: string,
        rejectionReason: string
    ): Promise<TeacherApplicationActionResult> => {
        const response =
            await apiClient.patch<TeacherApplicationActionResponse>(
                API_ROUTES.teacherApplications.reject(applicationId),
                { rejectionReason }
            );

        return response.data.data;
    },

    // Student: Get own application
    getMyApplication: async (): Promise<StudentTeacherApplication | null> => {
        const response =
            await apiClient.get<StudentTeacherApplicationResponse>(
                API_ROUTES.teacherApplications.myApplication
            );

        return response.data.data;
    },

    // Student: Generate document upload URL
    generateUploadUrl: async (
        fileType: TeacherApplicationFileType,
        contentType: string
    ): Promise<{ uploadUrl: string; key: string }> => {
        const response =
            await apiClient.post<GenerateTeacherApplicationUploadUrlResponse>(
                API_ROUTES.teacherApplications.uploadUrl,
                { fileType, contentType }
            );

        return response.data.data;
    },

    // Student: Upload file directly to S3
    uploadDocument: async (
        uploadUrl: string,
        file: File,
        onProgress?: (percentage: number) => void
    ): Promise<void> => {
        await axios.put(uploadUrl, file, {
            headers: {
                "Content-Type": file.type,
            },
            onUploadProgress: (event) => {
                if (event.total) {
                    onProgress?.(
                        Math.round((event.loaded / event.total) * 100)
                    );
                }
            },
        });
    },

    // Student: Submit application
    createApplication: async (
        payload: CreateTeacherApplicationRequest
    ): Promise<StudentTeacherApplication> => {
        const response =
            await apiClient.post<CreateTeacherApplicationResponse>(
                API_ROUTES.teacherApplications.base,
                payload
            );

        return response.data.data;
    },
};
