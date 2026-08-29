import {
    UserRole
} from "../../../shared/enums/UserRole";

import {
    UserStatus
} from "../../../shared/enums/UserStatus";


export interface GetMyProfileResponseDTO {

    id: string;

    firstName: string;

    lastName: string;

    email: string;

    avatar?: string;

    role: UserRole;

    status: UserStatus;

    isVerified: boolean;

    createdAt: Date;

}