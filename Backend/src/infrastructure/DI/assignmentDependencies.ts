import { MongoAssignmentRepository } from "../repositories/MongoAssignmentRepository";

import { CreateAssignmentUseCase } from "../../application/use-cases/assingment/CreateAssignmentUseCase";
import { GetAssignmentUseCase } from "../../application/use-cases/assingment/GetAssignmentUseCase";
import { UpdateAssignmentUseCase } from "../../application/use-cases/assingment/UpdateAssignmentUseCase";
import { DeleteAssignmentUseCase } from "../../application/use-cases/assingment/DeleteAssignmentUseCase";

import { CreateAssignmentController } from "../../presentation/controllers/assingment/CreateAssignmentController";
import { GetAssignmentController } from "../../presentation/controllers/assingment/GetAssignmentController";
import { UpdateAssignmentController } from "../../presentation/controllers/assingment/UpdateAssignmentController";
import { DeleteAssignmentController } from "../../presentation/controllers/assingment/DeleteAssignmentController";

import {
    lessonRepository,
    courseRepository,
    chapterRepository
} from "./repositoryDependencies";


const assignmentRepository =
    new MongoAssignmentRepository();


const createAssignmentUseCase =
    new CreateAssignmentUseCase(
        assignmentRepository,
        lessonRepository,
        chapterRepository,
        courseRepository
    );


const getAssignmentUseCase =
    new GetAssignmentUseCase(
        assignmentRepository
    );


const updateAssignmentUseCase =
    new UpdateAssignmentUseCase(
        assignmentRepository,
        lessonRepository,
        chapterRepository,
        courseRepository
    );


const deleteAssignmentUseCase =
    new DeleteAssignmentUseCase(
        assignmentRepository,
        lessonRepository,
        chapterRepository,
        courseRepository
    );


export const createAssignmentController =
    new CreateAssignmentController(
        createAssignmentUseCase
    );


export const getAssignmentController =
    new GetAssignmentController(
        getAssignmentUseCase
    );


export const updateAssignmentController =
    new UpdateAssignmentController(
        updateAssignmentUseCase
    );


export const deleteAssignmentController =
    new DeleteAssignmentController(
        deleteAssignmentUseCase
    );