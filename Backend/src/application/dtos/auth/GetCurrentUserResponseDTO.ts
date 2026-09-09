import { UserRole } from "../../../shared/enums/UserRole";

export interface GetCurrentUserResponseDTO {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
}