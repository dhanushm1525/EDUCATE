
export interface GradeAssignmentSubmissionDTO {
    assignmentId: string;
    submissionId: string;
    teacherId: string;
    score: number;
    teacherFeedback?: string;
}
