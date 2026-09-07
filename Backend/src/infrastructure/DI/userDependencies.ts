import { GetMyProfile } from "../../application/use-cases/user/GetMyProfile";
import {GetMyProfileController} from "../../presentation/controllers/user/GetMyProfileController";
import { userRepository } from "./authDependencies";





export const getMyProfile = new GetMyProfile(userRepository)

export const getMyProfileController= new GetMyProfileController(getMyProfile)