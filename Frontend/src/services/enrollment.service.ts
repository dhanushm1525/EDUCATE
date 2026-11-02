import { apiClient } from "./apiClient";
import { API_ROUTES } from "../constants/apiRoutes";

import type {
    EnrolledCourse,
    EnrolledCoursesResponse,
    EnrollInCourseResponse,
} from "../types/enrollment";

export const enrollmentService = {

    enroll: async (courseId: string): Promise<EnrolledCourse> => {
        const response =
            await apiClient.post<EnrollInCourseResponse>(
                API_ROUTES.enrollments.enroll(courseId)
            );

        if (!response.data.data) {
            throw new Error("Enrollment response is empty");
        }

        return response.data.data;
    },

    getMyCourses: async (): Promise<EnrolledCourse[]> => {
        const response =
            await apiClient.get<EnrolledCoursesResponse>(
                API_ROUTES.enrollments.myCourses
            );

        return response.data.data;
    },

};