import { CreateTeacherApplication }
    from "../../application/use-cases/teacherApplication/CreatTeacherApplication";

import { CreateTeacherApplicationController }
    from "../../presentation/controllers/teacherApplication/CreateTeacherApplicationController";

import {
    teacherApplicationRepository,
    userRepository
} from "./repositoryDependencies";


export const createTeacherApplicationUseCase =
    new CreateTeacherApplication(
        teacherApplicationRepository,
        userRepository
    );


export const createTeacherApplicationController =
    new CreateTeacherApplicationController(
        createTeacherApplicationUseCase
    );