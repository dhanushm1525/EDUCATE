import { GetMyProfile } from "../../application/use-cases/user/GetMyProfile";
import { MongoUserRepository } from "../repositories/MongoUserRepository";
import {GetMyProfileController} from "../../presentation/controllers/user/GetMyProfileController";



const userRepository = new MongoUserRepository();

export const getMyProfile = new GetMyProfile(userRepository)

export const getMyProfileController= new GetMyProfileController(getMyProfile)