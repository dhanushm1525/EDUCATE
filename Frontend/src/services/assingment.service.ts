

import { apiClient } from "./apiClient";
import { API_ROUTES } from "../constants/apiRoutes";

import type {
    AssignmentResponse,
    CreateAssignmentRequest,
} from "../types/assingment";

export const assignmentService = {

    create: async (
        lessonId: string,
        data: CreateAssignmentRequest
    ): Promise<AssignmentResponse> => {

        const response =
            await apiClient.post<AssignmentResponse>(
                API_ROUTES.assignments.byLesson(lessonId),
                data
            );

        return response.data;
    },

    getByLesson: async (
        lessonId: string
    ): Promise<AssignmentResponse> => {

        const response =
            await apiClient.get<AssignmentResponse>(
                API_ROUTES.assignments.byLesson(lessonId)
            );

        return response.data;
    },

};