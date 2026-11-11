import type { RequestHandler } from "express";

export type RouteController = {
    handle: RequestHandler;
};

export interface RouteDependencies {
    authenticateUser: RequestHandler;
    auth: {
        register: RouteController;
        login: RouteController;
        refreshToken: RouteController;
        logout: RouteController;
        resetPassword: RouteController;
        getCurrentUser: RouteController;
        googleSignIn: RouteController;
        verifyEmailOtp: RouteController;
        resendVerificationOtp: RouteController;
        forgotPassword: RouteController;
    };
    users: {
        getMyProfile: RouteController;
        getUsers: RouteController;
        updateUserStatus: RouteController;
        generateProfileImageUploadUrl: RouteController;
        updateProfileImage: RouteController;
    };
    courses: {
        create: RouteController;
        update: RouteController;
        submit: RouteController;
        getMine: RouteController;
        getTeacherById: RouteController;
        getPublished: RouteController;
        getPublishedById: RouteController;
        getPending: RouteController;
        approve: RouteController;
        reject: RouteController;
        getLearningContent: RouteController;
        generateThumbnailUploadUrl: RouteController;
    };
    categories: {
        create: RouteController;
        getAll: RouteController;
    };
    chapters: {
        create: RouteController;
        getByCourse: RouteController;
        getById: RouteController;
        update: RouteController;
        delete: RouteController;
    };
    lessons: {
        create: RouteController;
        getByChapter: RouteController;
        getById: RouteController;
        update: RouteController;
        delete: RouteController;
        generateMediaUploadUrl: RouteController;
        cleanupMedia: RouteController;
        getStudentLesson: RouteController;
    };
    teacherApplications: {
        create: RouteController;
        getPending: RouteController;
        approve: RouteController;
        reject: RouteController;
        generateUploadUrl: RouteController;
        getMine: RouteController;
    };
    assignments: {
        create: RouteController;
        getByLesson: RouteController;
        update: RouteController;
        delete: RouteController;
        getStudent: RouteController;
        submit: RouteController;
        getResults: RouteController;
        getTeacherSubmissions: RouteController;
        getTeacherSubmissionDetail: RouteController;
        gradeSubmission: RouteController;
        getTeacherAssignments: RouteController;
    };
    enrollments: {
        enroll: RouteController;
        getMine: RouteController;
    };
}
