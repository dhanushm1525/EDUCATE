export interface IDeleteAssignmentUseCase {
    execute(
        assignmentId: string,
        teacherId: string
    ): Promise<void>;
}