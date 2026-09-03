import type {
    UserRole
} from "./userRole";


export interface UserProfile {

    id: string;

    firstName: string;

    lastName: string;

    email: string;

    avatar?: string;

    role: UserRole;

    status: string;

    isVerified: boolean;

}


export interface GetMyProfileResponse {

    success: boolean;

    message: string;

    data: UserProfile;

}