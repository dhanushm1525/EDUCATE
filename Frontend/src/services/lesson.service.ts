import axios from "axios";

import { apiClient } from "./apiClient";

import { API_ROUTES } from "../constants/apiRoutes";

import type {
    Lesson,
    LessonApiResponse,
    CreateLessonRequest,
    UpdateLessonRequest,
    GenerateLessonMediaUploadUrlRequest,
    GenerateLessonMediaUploadUrlResponse,
} from "../types/lesson";

export const lessonService = {

    createLesson: async (
        courseId: string,
        chapterId: string,
        payload: CreateLessonRequest
    ): Promise<Lesson> => {

        const response =
            await apiClient.post<
                LessonApiResponse<Lesson>
            >(
                API_ROUTES.lessons.byChapter(
                    courseId,
                    chapterId
                ),
                payload
            );

        return response.data.data;
    },

    getLessons: async (
        courseId: string,
        chapterId: string
    ): Promise<Lesson[]> => {

        const response =
            await apiClient.get<
                LessonApiResponse<Lesson[]>
            >(
                API_ROUTES.lessons.byChapter(
                    courseId,
                    chapterId
                )
            );

        return response.data.data;
    },

    getLesson: async (
        courseId: string,
        chapterId: string,
        lessonId: string
    ): Promise<Lesson> => {

        const response =
            await apiClient.get<
                LessonApiResponse<Lesson>
            >(
                API_ROUTES.lessons.byId(
                    courseId,
                    chapterId,
                    lessonId
                )
            );

        return response.data.data;
    },

    updateLesson: async (
        courseId: string,
        chapterId: string,
        lessonId: string,
        payload: UpdateLessonRequest
    ): Promise<Lesson> => {

        const response =
            await apiClient.patch<
                LessonApiResponse<Lesson>
            >(
                API_ROUTES.lessons.byId(
                    courseId,
                    chapterId,
                    lessonId
                ),
                payload
            );

        return response.data.data;
    },

    deleteLesson: async (
        courseId: string,
        chapterId: string,
        lessonId: string
    ): Promise<void> => {

        await apiClient.delete(
            API_ROUTES.lessons.byId(
                courseId,
                chapterId,
                lessonId
            )
        );
    },

    generateMediaUploadUrl: async (
        courseId: string,
        chapterId: string,
        lessonId: string,
        payload: GenerateLessonMediaUploadUrlRequest
    ) => {

        const response =
            await apiClient.post<
                GenerateLessonMediaUploadUrlResponse
            >(
                API_ROUTES.lessons.mediaUploadUrl(
                    courseId,
                    chapterId,
                    lessonId
                ),
                payload
            );

        return response.data.data;
    },

    uploadMedia: async (
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
                    const percentage = Math.round(
                        (event.loaded / event.total) * 100
                    );

                    onProgress?.(percentage);
                }
            },
        });
    },

    cleanupMedia: async (
        courseId: string,
        chapterId: string,
        lessonId: string,
        key: string
    ): Promise<void> => {
        await apiClient.delete(
            API_ROUTES.lessons.media(
                courseId,
                chapterId,
                lessonId
            ),
            {
                data: { key },
            }
        );
    },
};