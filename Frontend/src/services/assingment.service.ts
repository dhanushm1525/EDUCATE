
import { apiClient } from "./apiClient";
import { API_ROUTES } from "../constants/apiRoutes";

import type {
    AssignmentResponse,
    CreateAssignmentRequest,
} from "../types/assingment";

import type {
    StudentAssignmentResponse,
    SubmitAssignmentRequest,
    SubmitAssignmentResponse,
    AssignmentResultsResponse,
} from "../types/studentAssignment";

export const assignmentService = {

    // -------------------------------
    // TEACHER APIs
    // -------------------------------

    create: async (
        lessonId: string,
        data: CreateAssignmentRequest
    ): Promise<AssignmentResponse> => {
        const response = await apiClient.post<AssignmentResponse>(
            API_ROUTES.assignments.byLesson(lessonId),
            data
        );

        return response.data;
    },

    getByLesson: async (
        lessonId: string
    ): Promise<AssignmentResponse> => {
        const response = await apiClient.get<AssignmentResponse>(
            API_ROUTES.assignments.byLesson(lessonId)
        );

        return response.data;
    },

    // -------------------------------
    // STUDENT APIs
    // -------------------------------

    getStudentAssignment: async (
        lessonId: string
    ): Promise<StudentAssignmentResponse> => {
        const response =
            await apiClient.get<StudentAssignmentResponse>(
                API_ROUTES.assignments.student.byLesson(lessonId)
            );

        return response.data;
    },

    submit: async (
        assignmentId: string,
        data: SubmitAssignmentRequest
    ): Promise<SubmitAssignmentResponse> => {
        const response =
            await apiClient.post<SubmitAssignmentResponse>(
                API_ROUTES.assignments.student.submit(assignmentId),
                data
            );

        return response.data;
    },

    getResults: async (
        assignmentId: string
    ): Promise<AssignmentResultsResponse> => {
        const response =
            await apiClient.get<AssignmentResultsResponse>(
                API_ROUTES.assignments.student.results(assignmentId)
            );

        return response.data;
    },
};
