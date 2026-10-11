import { AssignmentQuestion } from "../entities/Assingment";
import { AppError } from "../../shared/errors/AppError";
import { HttpStatusCode } from "../../shared/enums/HttpStatusCode";

export class AssignmentPolicy {

    static validateTitle(title: string): void {
        if (!title.trim()) {
            throw new AppError(
                "Assignment title is required",
                HttpStatusCode.BAD_REQUEST
            );
        }
    }

    static validateQuestions(
        questions: AssignmentQuestion[]
    ): void {

        if (questions.length === 0) {
            throw new AppError(
                "Assignment must contain at least one question",
                HttpStatusCode.BAD_REQUEST
            );
        }

        for (const question of questions) {

            if (!question.question.trim()) {
                throw new AppError(
                    "Question cannot be empty",
                    HttpStatusCode.BAD_REQUEST
                );
            }

            if (question.options.length < 2) {
                throw new AppError(
                    "Each question must contain at least two options",
                    HttpStatusCode.BAD_REQUEST
                );
            }

            if (
                !question.options.includes(
                    question.correctAnswer
                )
            ) {
                throw new AppError(
                    "Correct answer must be one of the available options",
                    HttpStatusCode.BAD_REQUEST
                );
            }

            if (question.marks <= 0) {
                throw new AppError(
                    "Question marks must be greater than zero",
                    HttpStatusCode.BAD_REQUEST
                );
            }
        }
    }

    static calculateTotalMarks(
        questions: AssignmentQuestion[]
    ): number {

        return questions.reduce(
            (total, question) =>
                total + question.marks,
            0
        );
    }

    static validatePassingMarks(
        passingMarks: number,
        totalMarks: number
    ): void {

        if (
            passingMarks <= 0 ||
            passingMarks > totalMarks
        ) {
            throw new AppError(
                "Passing marks must be greater than zero and cannot exceed total marks",
                HttpStatusCode.BAD_REQUEST
            );
        }
    }

    static validateTimeLimit(
        timeLimit?: number
    ): void {

        if (
            timeLimit !== undefined &&
            timeLimit <= 0
        ) {
            throw new AppError(
                "Time limit must be greater than zero",
                HttpStatusCode.BAD_REQUEST
            );
        }
    }

    static validateAttemptsAllowed(
        attemptsAllowed?: number
    ): void {

        if (
            attemptsAllowed !== undefined &&
            attemptsAllowed <= 0
        ) {
            throw new AppError(
                "Attempts allowed must be greater than zero",
                HttpStatusCode.BAD_REQUEST
            );
        }
    }

    static validate(
        title: string,
        questions: AssignmentQuestion[],
        passingMarks: number,
        timeLimit?: number,
        attemptsAllowed?: number
    ): number {

        this.validateTitle(title);

        this.validateQuestions(questions);

        const totalMarks =
            this.calculateTotalMarks(questions);

        this.validatePassingMarks(
            passingMarks,
            totalMarks
        );

        this.validateTimeLimit(timeLimit);

        this.validateAttemptsAllowed(
            attemptsAllowed
        );

        return totalMarks;
    }
}