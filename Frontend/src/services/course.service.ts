import { apiClient } from "./apiClient";

import { API_ROUTES } from "../constants/apiRoutes";

import type {
    Course,
    CourseApiResponse,
    CourseSearchFilters,
    CreateCourseRequest,
    UpdateCourseRequest,
} from "../types/course";

import type {
    CourseLearningContent,
    CourseLearningContentApiResponse,
} from "../types/courseLearningContent";

export const courseService = {

    createCourse: async (
        payload: CreateCourseRequest
    ): Promise<Course> => {

        const response =
            await apiClient.post<CourseApiResponse<Course>>(
                API_ROUTES.courses.base,
                payload
            );

        return response.data.data;
    },

    getCourses: async (
        filters: CourseSearchFilters = {}
    ): Promise<Course[]> => {
        const response = await apiClient.get<
            CourseApiResponse<Course[]>
        >(API_ROUTES.courses.base, {
            params: filters,
        });

        return response.data.data;
    },

    getCourse: async (
        courseId: string
    ): Promise<Course> => {

        const response =
            await apiClient.get<
                CourseApiResponse<Course>
            >(
                API_ROUTES.courses.byId(courseId)
            );

        return response.data.data;
    },

    getTeacherCourseById: async (
        courseId: string
    ): Promise<Course> => {

        const response =
            await apiClient.get<CourseApiResponse<Course>>(
                API_ROUTES.courses.manage(courseId)
            );

        return response.data.data;
    },


    getMyCourses: async (): Promise<Course[]> => {
        const response = await apiClient.get<
            CourseApiResponse<Course[]>
        >(API_ROUTES.courses.myCourses);

        return response.data.data;
    },


    updateCourse: async (
        courseId: string,
        payload: UpdateCourseRequest
    ): Promise<Course> => {

        const response =
            await apiClient.patch<
                CourseApiResponse<Course>
            >(
                API_ROUTES.courses.byId(courseId),
                payload
            );

        return response.data.data;
    },

    submitCourse: async (
        courseId: string
    ): Promise<Course> => {

        const response =
            await apiClient.patch<
                CourseApiResponse<Course>
            >(
                API_ROUTES.courses.submit(courseId)
            );

        return response.data.data;
    },

    getPendingCourses: async (): Promise<Course[]> => {
        const response = await apiClient.get<
            CourseApiResponse<Course[]>
        >(API_ROUTES.courses.pending);

        return response.data.data;
    },

    approveCourse: async (
        courseId: string
    ): Promise<Course> => {
        const response = await apiClient.patch<
            CourseApiResponse<Course>
        >(
            API_ROUTES.courses.approve(courseId)
        );

        return response.data.data;
    },

    rejectCourse: async (
        courseId: string,
        rejectionReason: string
    ): Promise<Course> => {
        const response = await apiClient.patch<
            CourseApiResponse<Course>
        >(
            API_ROUTES.courses.reject(courseId),
            { rejectionReason }
        );

        return response.data.data;
    },

    getLearningContent: async (
        courseId: string
    ): Promise<CourseLearningContent> => {

        const response =
            await apiClient.get<CourseLearningContentApiResponse>(
                API_ROUTES.courses.learningContent(courseId)
            );

        return response.data.data;
    },
};