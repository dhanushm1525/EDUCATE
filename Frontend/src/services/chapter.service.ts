import { apiClient } from "./apiClient";

import { API_ROUTES } from "../constants/apiRoutes";

import type {
    Chapter,
    ChapterApiResponse,
    CreateChapterRequest,
    UpdateChapterRequest,
} from "../types/chapter";

export const chapterService = {

    createChapter: async (
        courseId: string,
        payload: CreateChapterRequest
    ): Promise<Chapter> => {

        const response =
            await apiClient.post<
                ChapterApiResponse<Chapter>
            >(
                API_ROUTES.chapters.byCourse(courseId),
                payload
            );

        return response.data.data;
    },

    getChapters: async (
        courseId: string
    ): Promise<Chapter[]> => {

        const response =
            await apiClient.get<
                ChapterApiResponse<Chapter[]>
            >(
                API_ROUTES.chapters.byCourse(courseId)
            );

        return response.data.data;
    },

    getChapter: async (
        courseId: string,
        chapterId: string
    ): Promise<Chapter> => {

        const response =
            await apiClient.get<
                ChapterApiResponse<Chapter>
            >(
                API_ROUTES.chapters.byId(
                    courseId,
                    chapterId
                )
            );

        return response.data.data;
    },

    updateChapter: async (
        courseId: string,
        chapterId: string,
        payload: UpdateChapterRequest
    ): Promise<Chapter> => {

        const response =
            await apiClient.patch<
                ChapterApiResponse<Chapter>
            >(
                API_ROUTES.chapters.byId(
                    courseId,
                    chapterId
                ),
                payload
            );

        return response.data.data;
    },

    deleteChapter: async (
        courseId: string,
        chapterId: string
    ): Promise<void> => {

        await apiClient.delete(
            API_ROUTES.chapters.byId(
                courseId,
                chapterId
            )
        );
    },
};