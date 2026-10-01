import { Router } from "express";

import {
    createTeacherApplicationController
} from "../../infrastructure/DI/teacherApplicationDependencies";

import { jwtService }
    from "../../infrastructure/DI/authDependencies";

import { authMiddleware }
    from "../middlewares/authMiddleware";

import { roleMiddleware }
    from "../middlewares/roleMiddleware";

import { UserRole }
    from "../../shared/enums/UserRole";

import { validate }
    from "../middlewares/validationMiddleware";

import { createTeacherApplicationSchema }
    from "../../shared/schema/teacherApplication/createTeacherApplicationSchema";


const router = Router();


router.post("/", authMiddleware(jwtService),
    roleMiddleware(UserRole.STUDENT),
    validate(createTeacherApplicationSchema),
    createTeacherApplicationController.handle.bind(
        createTeacherApplicationController));


export default router;