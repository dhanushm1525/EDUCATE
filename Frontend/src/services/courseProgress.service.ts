
import { apiClient } from "./apiClient";
import { API_ROUTES } from "../constants/apiRoutes";

import type {
    CourseProgress,
    CourseProgressApiResponse,
} from "../types/courseProgress";

export const courseProgressService = {
    getMyProgress: async (): Promise<CourseProgress[]> => {
        const response =
            await apiClient.get<CourseProgressApiResponse>(
                API_ROUTES.courseProgress.myProgress
            );

        return response.data.data;
    },

    recordLessonAccess: async (
        courseId: string,
        lessonId: string
    ): Promise<void> => {
        await apiClient.patch(
            API_ROUTES.courseProgress.recordAccess(
                courseId,
                lessonId
            )
        );
    },

    completeLesson: async (
        courseId: string,
        lessonId: string
    ): Promise<void> => {
        await apiClient.patch(
            API_ROUTES.courseProgress.completeLesson(
                courseId,
                lessonId
            )
        );
    },

    saveVideoProgress: async (
        courseId: string,
        lessonId: string,
        watchPercentage: number,
    ): Promise<void> => {
        await apiClient.patch(
            API_ROUTES.courseProgress.videoProgress(courseId, lessonId),
            { watchPercentage },
        );
    },
};
