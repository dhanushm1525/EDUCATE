import { UserRole } from "../../../shared/enums/UserRole";

export interface LoginUserResponseDTO{
    user:{
        id:string;
        firstName:string;
        lastName:string;
        email:string;
        role:UserRole;
    }
    accessToken:string;
}