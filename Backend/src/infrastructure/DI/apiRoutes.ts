import { createApiRouter } from "../../presentation/routes";
import { authenticateUser } from "./authDependencies";
import {
    forgotPasswordController,
    getCurrentUserController,
    googleSignInController,
    loginController,
    logoutController,
    refreshTokenController,
    registerController,
    resendVerificationOtpController,
    resetPasswordController,
    verifyEmailOtpController
} from "./authDependencies";
import {
    getMyProfileController,
    getUsersController,
    updateProfileImageController,
    updateUserStatusController
} from "./userDependencies";
import { generateProfileImageUploadUrlController } from "./storageControllerDependencies";
import {
    approveCourseController,
    createCourseController,
    generateCourseThumbnailUploadUrlController,
    getCourseLearningContentController,
    getMyCoursesController,
    getPendingCoursesController,
    getPublishedCourseByIdController,
    getPublishedCoursesController,
    getTeacherCourseByIdController,
    rejectCourseController,
    submitCourseController,
    updateCourseController
} from "./courseDependencies";
import { createCategoryController, getCategoriesController } from "./categoryDependencies";
import {
    createChapterController,
    deleteChapterController,
    getChapterByIdController,
    getChaptersByCourseController,
    updateChapterController
} from "./chapterDependencies";
import {
    cleanupLessonMediaController,
    createLessonController,
    deleteLessonController,
    generateLessonMediaUploadUrlController,
    getLessonByIdController,
    getLessonsByChapterController,
    getStudentLessonController,
    updateLessonController
} from "./lessonDependencies";
import {
    approveTeacherApplicationController,
    createTeacherApplicationController,
    generateTeacherApplicationUploadUrlController,
    getMyTeacherApplicationController,
    getPendingTeacherApplicationsController,
    rejectTeacherApplicationController
} from "./teacherApplicationDependencies";
import {
    createAssignmentController,
    deleteAssignmentController,
    getAssignmentByLessonController,
    getAssignmentResultsController,
    getStudentAssignmentController,
    getTeacherAssignmentSubmissionsController,
    getTeacherAssignmentsController,
    getTeacherSubmissionDetailController,
    gradeAssignmentSubmissionController,
    submitAssignmentController,
    updateAssignmentController
} from "./assignmentDependencies";
import { enrollInCourseController, getMyEnrolledCoursesController } from "./enrollmentDependencies";

export const apiRoutes = createApiRouter({
    authenticateUser,
    auth: {
        register: registerController,
        login: loginController,
        refreshToken: refreshTokenController,
        logout: logoutController,
        resetPassword: resetPasswordController,
        getCurrentUser: getCurrentUserController,
        googleSignIn: googleSignInController,
        verifyEmailOtp: verifyEmailOtpController,
        resendVerificationOtp: resendVerificationOtpController,
        forgotPassword: forgotPasswordController
    },
    users: {
        getMyProfile: getMyProfileController,
        getUsers: getUsersController,
        updateUserStatus: updateUserStatusController,
        generateProfileImageUploadUrl: generateProfileImageUploadUrlController,
        updateProfileImage: updateProfileImageController
    },
    courses: {
        create: createCourseController,
        update: updateCourseController,
        submit: submitCourseController,
        getMine: getMyCoursesController,
        getTeacherById: getTeacherCourseByIdController,
        getPublished: getPublishedCoursesController,
        getPublishedById: getPublishedCourseByIdController,
        getPending: getPendingCoursesController,
        approve: approveCourseController,
        reject: rejectCourseController,
        getLearningContent: getCourseLearningContentController,
        generateThumbnailUploadUrl: generateCourseThumbnailUploadUrlController
    },
    categories: {
        create: createCategoryController,
        getAll: getCategoriesController
    },
    chapters: {
        create: createChapterController,
        getByCourse: getChaptersByCourseController,
        getById: getChapterByIdController,
        update: updateChapterController,
        delete: deleteChapterController
    },
    lessons: {
        create: createLessonController,
        getByChapter: getLessonsByChapterController,
        getById: getLessonByIdController,
        update: updateLessonController,
        delete: deleteLessonController,
        generateMediaUploadUrl: generateLessonMediaUploadUrlController,
        cleanupMedia: cleanupLessonMediaController,
        getStudentLesson: getStudentLessonController
    },
    teacherApplications: {
        create: createTeacherApplicationController,
        getPending: getPendingTeacherApplicationsController,
        approve: approveTeacherApplicationController,
        reject: rejectTeacherApplicationController,
        generateUploadUrl: generateTeacherApplicationUploadUrlController,
        getMine: getMyTeacherApplicationController
    },
    assignments: {
        create: createAssignmentController,
        getByLesson: getAssignmentByLessonController,
        update: updateAssignmentController,
        delete: deleteAssignmentController,
        getStudent: getStudentAssignmentController,
        submit: submitAssignmentController,
        getResults: getAssignmentResultsController,
        getTeacherSubmissions: getTeacherAssignmentSubmissionsController,
        getTeacherSubmissionDetail: getTeacherSubmissionDetailController,
        gradeSubmission: gradeAssignmentSubmissionController,
        getTeacherAssignments: getTeacherAssignmentsController
    },
    enrollments: {
        enroll: enrollInCourseController,
        getMine: getMyEnrolledCoursesController
    }
});
