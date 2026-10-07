export interface Assignment {
    assignmentId?: string;

    lessonId: string;

    title: string;
    description?: string;

    questions: AssignmentQuestion[];

    totalMarks: number;
    passingMarks: number;

    timeLimit?: number;
    attemptsAllowed?: number;

    createdAt: Date;
    updatedAt: Date;
}

export interface AssignmentQuestion {
    questionId: string;

    question: string;

    options: string[];

    correctAnswer: string;

    marks: number;
}