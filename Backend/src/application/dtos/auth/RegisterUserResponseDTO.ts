import { UserRole } from "../../../shared/enums/UserRole";

export interface RegisterUserResponseDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}