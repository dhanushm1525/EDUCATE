import type {
    UserRole
} from "./userRole";


export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  avatar?: string;
  status: string;
  createdAt: string;
}


export interface GetMyProfileResponse {

    success: boolean;

    message: string;

    data: UserProfile;

}