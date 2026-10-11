export interface AssignmentQuestion {
    questionId?: string;
    question: string;
    options: string[];
    correctAnswer: string;
    marks: number;
}

export interface Assignment {
    assignmentId: string;
    lessonId: string;

    title: string;
    description?: string;

    questions: AssignmentQuestion[];

    totalMarks: number;
    passingMarks: number;

    timeLimit?: number;
    attemptsAllowed?: number;

    createdAt: string;
    updatedAt: string;
}

export interface CreateAssignmentRequest {
    title: string;
    description?: string;
    questions: AssignmentQuestion[];
    passingMarks: number;
    timeLimit?: number;
    attemptsAllowed?: number;
}

export interface AssignmentResponse {
    success: boolean;
    message: string;
    data: Assignment | null;
}