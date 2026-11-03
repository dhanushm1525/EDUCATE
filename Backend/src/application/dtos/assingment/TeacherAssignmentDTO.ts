
export interface TeacherAssignmentDTO {
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
    dueDate?: Date | null;

    totalSubmissions: number;
    gradedSubmissions: number;
    pendingSubmissions: number;

    createdAt: Date;
    updatedAt: Date;
}
