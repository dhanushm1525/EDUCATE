import type {
    UserRole
} from "../../../shared/enums/UserRole";


export interface GoogleSignInResponseDTO {

    user: {

        id:
            string;

        firstName:
            string;

        lastName:
            string;

        email:
            string;

        avatar?:
            string;

        role:
            UserRole;

    };

    accessToken:
        string;

}