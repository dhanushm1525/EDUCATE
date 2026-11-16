
export interface StudentAssignmentQuestionDTO {
    questionId: string;
    question: string;
    options: string[];
    marks: number;
}

export interface StudentAssignmentAnswerDTO {
    questionId: string;
    selectedAnswer: string;
}

export interface StudentActiveAttemptDTO {
    submissionId: string;
    attemptNumber: number;
    startedAt: Date;
    expiresAt?: Date;
    answers: StudentAssignmentAnswerDTO[];
}

export interface StudentAssignmentDTO {
    assignmentId: string;
    lessonId: string;

    title: string;
    description?: string;

    questions: StudentAssignmentQuestionDTO[];

    totalMarks: number;
    passingMarks: number;

    timeLimit?: number;
    attemptsAllowed?: number;
    dueDate?: Date | null;

    attemptsUsed: number;
    attemptsRemaining: number | null;

    isExpired: boolean;
    canAttempt: boolean;

    activeAttempt: StudentActiveAttemptDTO | null;
}
