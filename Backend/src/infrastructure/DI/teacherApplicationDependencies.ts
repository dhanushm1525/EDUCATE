import { CreateTeacherApplication }
    from "../../application/use-cases/teacherApplication/CreatTeacherApplication";

import { GetPendingTeacherApplications }
    from "../../application/use-cases/teacherApplication/GetPendingTeacherApplications";

import { ApproveTeacherApplication }
    from "../../application/use-cases/teacherApplication/ApproveTeacherApplication";

import { RejectTeacherApplication }
    from "../../application/use-cases/teacherApplication/RejectTeacherApplication";


import { CreateTeacherApplicationController }
    from "../../presentation/controllers/teacherApplication/CreateTeacherApplicationController";

import { GetPendingTeacherApplicationsController }
    from "../../presentation/controllers/teacherApplication/GetPendingTeacherApplicationsController";

import { ApproveTeacherApplicationController }
    from "../../presentation/controllers/teacherApplication/ApproveTeacherApplicationController";

import { RejectTeacherApplicationController }
    from "../../presentation/controllers/teacherApplication/RejectTeacherApplicationController";


import {
    teacherApplicationRepository,
    userRepository
} from "./repositoryDependencies";

import { GenerateTeacherApplicationUploadUrl }
    from "../../application/use-cases/teacherApplication/GenerateTeacherApplicationUploadUrl";

import { GenerateTeacherApplicationUploadUrlController }
    from "../../presentation/controllers/teacherApplication/GenerateTeacherApplicationUploadUrlController";

import { S3TeacherApplicationDocumentPolicy }
    from "../services/TeacherApplicationDocumentPolicy";

import { s3Client }
    from "./storageDependencies";

import { env }
    from "../config/env";

import { GetMyTeacherApplication }
    from "../../application/use-cases/teacherApplication/GetMyTeacherApplication";

import { GetMyTeacherApplicationController }
    from "../../presentation/controllers/teacherApplication/GetMyTeacherApplicationController";


// Create Teacher Application

export const createTeacherApplicationUseCase =
    new CreateTeacherApplication(
        teacherApplicationRepository,
        userRepository
    );

export const createTeacherApplicationController =
    new CreateTeacherApplicationController(
        createTeacherApplicationUseCase
    );


// Get Pending Teacher Applications

export const getPendingTeacherApplicationsUseCase =
    new GetPendingTeacherApplications(
        teacherApplicationRepository,
        userRepository
    );

export const getPendingTeacherApplicationsController =
    new GetPendingTeacherApplicationsController(
        getPendingTeacherApplicationsUseCase
    );


// Approve Teacher Application

export const approveTeacherApplicationUseCase =
    new ApproveTeacherApplication(
        teacherApplicationRepository,
        userRepository
    );

export const approveTeacherApplicationController =
    new ApproveTeacherApplicationController(
        approveTeacherApplicationUseCase
    );


// Reject Teacher Application

export const rejectTeacherApplicationUseCase =
    new RejectTeacherApplication(
        teacherApplicationRepository
    );

export const rejectTeacherApplicationController =
    new RejectTeacherApplicationController(
        rejectTeacherApplicationUseCase
    );

// Teacher Application Document Upload

const teacherApplicationDocumentPolicy =
    new S3TeacherApplicationDocumentPolicy();

export const generateTeacherApplicationUploadUrlUseCase =
    new GenerateTeacherApplicationUploadUrl(
        s3Client,
        teacherApplicationDocumentPolicy,
        env.awsS3BucketName
    );

export const generateTeacherApplicationUploadUrlController =
    new GenerateTeacherApplicationUploadUrlController(
        generateTeacherApplicationUploadUrlUseCase
    );


// Get My Teacher Application

export const getMyTeacherApplicationUseCase =
    new GetMyTeacherApplication(
        teacherApplicationRepository
    );

export const getMyTeacherApplicationController =
    new GetMyTeacherApplicationController(
        getMyTeacherApplicationUseCase
    );