
export type SubmissionStatus = "submitted" | "graded";

export interface TeacherSubmissionStudent {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
}

export interface TeacherAssignmentSubmission {
    submissionId: string;
    student: TeacherSubmissionStudent;

    attemptNumber: number;

    score: number;
    totalMarks: number;
    passingMarks: number;
    percentage: number;

    isPassed: boolean;
    status: SubmissionStatus;

    submittedAt: string;
}

export interface TeacherAssignmentSubmissionsResponse {
    success: boolean;
    message: string;
    data: TeacherAssignmentSubmission[];
}

export interface TeacherSubmissionDetail {
    submissionId: string;
    student: TeacherSubmissionStudent;
    assignment: {
        assignmentId: string;
        title: string;
        totalMarks: number;
        passingMarks: number;
    };
    attemptNumber: number;
    answers: {
        questionId: string;
        question: string;
        options: string[];
        selectedAnswer: string;
        correctAnswer: string;
        marks: number;
        isCorrect: boolean;
    }[];
    score: number;
    totalMarks: number;
    passingMarks: number;
    percentage: number;
    isPassed: boolean;
    status: SubmissionStatus;
    teacherFeedback?: string;
    submittedAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface TeacherSubmissionDetailResponse {
    success: boolean;
    message: string;
    data: TeacherSubmissionDetail;
}

export interface GradeAssignmentRequest {
    teacherFeedback?: string;
}

export interface GradeAssignmentResponse {
    success: boolean;
    message: string;
    data: unknown;
}



export interface TeacherAssignment {
    assignmentId: string;
    title: string;
    description?: string;

    courseId: string;
    courseTitle: string;

    chapterId: string;
    chapterTitle: string;

    lessonId: string;
    lessonTitle: string;

    totalQuestions: number;
    totalMarks: number;
    passingMarks: number;

    timeLimit?: number;
    attemptsAllowed?: number;
    dueDate?: string | null;

    totalSubmissions: number;
    gradedSubmissions: number;
    pendingSubmissions: number;

    createdAt: string;
    updatedAt: string;
}

export interface TeacherAssignmentsResponse {
    success: boolean;
    message: string;
    data: TeacherAssignment[];
}
