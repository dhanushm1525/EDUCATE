
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

import type {
    TeacherAssignmentsResponse,
    TeacherAssignmentSubmissionsResponse,
    TeacherSubmissionDetailResponse,
    GradeAssignmentRequest,
    GradeAssignmentResponse,
} from "../types/teacherAssignment";

export const assignmentService = {

    // ========================================
    // TEACHER APIs
    // ========================================

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

    getTeacherSubmissions: async (
        assignmentId: string
    ): Promise<TeacherAssignmentSubmissionsResponse> => {
        const response =
            await apiClient.get<TeacherAssignmentSubmissionsResponse>(
                API_ROUTES.assignments.teacher.submissions(assignmentId)
            );

        return response.data;
    },

    getTeacherSubmissionDetail: async (
        assignmentId: string,
        submissionId: string
    ): Promise<TeacherSubmissionDetailResponse> => {
        const response =
            await apiClient.get<TeacherSubmissionDetailResponse>(
                API_ROUTES.assignments.teacher.submissionDetail(
                    assignmentId,
                    submissionId
                )
            );

        return response.data;
    },

    gradeSubmission: async (
        assignmentId: string,
        submissionId: string,
        data: GradeAssignmentRequest
    ): Promise<GradeAssignmentResponse> => {
        const response =
            await apiClient.patch<GradeAssignmentResponse>(
                API_ROUTES.assignments.teacher.gradeSubmission(
                    assignmentId,
                    submissionId
                ),
                data
            );

        return response.data;
    },


    getTeacherAssignments: async (): Promise<TeacherAssignmentsResponse> => {
        const response =
            await apiClient.get<TeacherAssignmentsResponse>(
                API_ROUTES.assignments.teacher.myAssignments
            );

        return response.data;
    },


    // ========================================
    // STUDENT APIs
    // ========================================

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
