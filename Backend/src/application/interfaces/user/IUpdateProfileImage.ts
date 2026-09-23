import { UpdateProfileImageDTO } from "../../dtos/user/UpdateProfileImageDTO";
import { User } from "../../../domain/entities/User";

export interface IUpdateProfileImage {
    execute(dto: UpdateProfileImageDTO): Promise<User>;
}