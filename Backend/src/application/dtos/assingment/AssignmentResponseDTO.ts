export interface AssignmentResponseQuestionDTO {
    questionId: string;
    question: string;
    options: string[];
    correctAnswer: string;
    marks: number;
}

export interface AssignmentResponseDTO {
    assignmentId: string;
    lessonId: string;
    title: string;
    description?: string;
    questions: AssignmentResponseQuestionDTO[];
    totalMarks: number;
    passingMarks: number;
    timeLimit?: number;
    attemptsAllowed?: number;
    dueDate?: string | null;
    createdAt: string;
    updatedAt: string;
}
