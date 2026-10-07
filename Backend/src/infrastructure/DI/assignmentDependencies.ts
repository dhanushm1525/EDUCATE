import { MongoAssignmentRepository } from "../repositories/MongoAssignmentRepository";
import { CreateAssignmentUseCase } from "../../application/use-cases/assingment/CreateAssignmentUseCase";
import { CreateAssignmentController } from "../../presentation/controllers/assingment/CreateAssignmentController";
import { lessonRepository,courseRepository,chapterRepository } from "./repositoryDependencies";

const assignmentRepository =
    new MongoAssignmentRepository();

const createAssignmentUseCase =
    new CreateAssignmentUseCase(
        assignmentRepository,
        lessonRepository,
        chapterRepository,
        courseRepository
    );

export const createAssignmentController =
    new CreateAssignmentController(
        createAssignmentUseCase
    );