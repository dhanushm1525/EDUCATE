
export interface SubmitAssignmentAnswerDTO {
    questionId: string;
    selectedAnswer: string;
}

export interface SubmitAssignmentDTO {
    assignmentId: string;
    userId: string;
    answers: SubmitAssignmentAnswerDTO[];
}
