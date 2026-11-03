export const API_ROUTES = {
  auth: {
    register: "/auth/register",
    verifyEmail: "/auth/verify-email",
    resendVerificationOtp: "/auth/resend-verification-otp",
    login: "/auth/login",
    refresh: "/auth/refresh",
    currentUser: "/auth/me",
    logout: "/auth/logout",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    googleSignIn: "/auth/google",
  },

  users: {
    profile: "/users/profile",
  },

  storage: {
    profileImageUploadUrl:
      "/storage/profile-image/upload-url",

    profileImage:
      "/storage/profile-image",
  },

  categories: {
    base: "/categories",
  },


  courses: {
    base: "/courses",
    myCourses: "/courses/my-courses",
    pending: "/courses/pending",

    byId: (courseId: string) =>
      `/courses/${courseId}`,

    manage: (courseId: string) =>
      `/courses/${courseId}/manage`,

    submit: (courseId: string) =>
      `/courses/${courseId}/submit`,

    approve: (courseId: string) =>
      `/courses/${courseId}/approve`,

    reject: (courseId: string) =>
      `/courses/${courseId}/reject`,

    learningContent: (courseId: string) =>
      `/courses/${courseId}/learning-content`,

    thumbnailUploadUrl: (courseId: string) =>
      `/courses/${courseId}/thumbnail/upload-url`,
  },


  chapters: {
    byCourse: (courseId: string) =>
      `/courses/${courseId}/chapters`,

    byId: (
      courseId: string,
      chapterId: string,
    ) =>
      `/courses/${courseId}/chapters/${chapterId}`,
  },

  lessons: {
    byChapter: (
      courseId: string,
      chapterId: string,
    ) =>
      `/courses/${courseId}/chapters/${chapterId}/lessons`,

    byId: (
      courseId: string,
      chapterId: string,
      lessonId: string,
    ) =>
      `/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`,

    mediaUploadUrl: (
      courseId: string,
      chapterId: string,
      lessonId: string,
    ) =>
      `/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/media/upload-url`,

    media: (courseId: string, chapterId: string, lessonId: string) =>
      `/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/media`,

    studentById: (
      courseId: string,
      chapterId: string,
      lessonId: string
    ) =>
      `/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/student`,
  },


  assignments: {
    byLesson: (lessonId: string) =>
      `/lessons/${lessonId}/assignment`,

    byId: (assignmentId: string) =>
      `/assignments/${assignmentId}`,

    // Teacher APIs
    teacher: {
      submissions: (assignmentId: string) =>
        `/teacher/assignments/${assignmentId}/submissions`,

      submissionDetail: (
        assignmentId: string,
        submissionId: string
      ) =>
        `/teacher/assignments/${assignmentId}/submissions/${submissionId}`,

      gradeSubmission: (
        assignmentId: string,
        submissionId: string
      ) =>
        `/teacher/assignments/${assignmentId}/submissions/${submissionId}/grade`,

      myAssignments: "/teacher/assignments",
    },

    // Student APIs
    student: {
      byLesson: (lessonId: string) =>
        `/assignments/student/lessons/${lessonId}/assignment`,

      submit: (assignmentId: string) =>
        `/assignments/student/assignments/${assignmentId}/submit`,

      results: (assignmentId: string) =>
        `/assignments/student/assignments/${assignmentId}/results`,
    },
  },


  enrollments: {
    base: "/enrollments",

    enroll: (courseId: string) =>
      `/enrollments/${courseId}`,

    myCourses: "/enrollments/my-courses",
  },

  teacher: {
    submissions: (assignmentId: string) =>
      `/teacher/assignments/${assignmentId}/submissions`,

    submissionDetail: (
      assignmentId: string,
      submissionId: string
    ) =>
      `/teacher/assignments/${assignmentId}/submissions/${submissionId}`,

    gradeSubmission: (
      assignmentId: string,
      submissionId: string
    ) =>
      `/teacher/assignments/${assignmentId}/submissions/${submissionId}/grade`,
  },

  adminUsers: {
    base: "/admin/users",

    updateStatus: (userId: string) =>
        `/admin/users/${userId}/status`,
},

teacherApplications: {
    base: "/teacher-applications",

    pending: "/teacher-applications/pending",

    myApplication: "/teacher-applications/my-application",

    uploadUrl: "/teacher-applications/upload-url",

    approve: (applicationId: string) =>
        `/teacher-applications/${applicationId}/approve`,

    reject: (applicationId: string) =>
        `/teacher-applications/${applicationId}/reject`,
},
} as const;