import type {
    UserRole
} from "../types/userRole";


export function getRoleDashboardPath(
    role: UserRole
): string {

    switch (role) {

        case "student":

            return "/student";


        case "teacher":

            return "/teacher";


        case "admin":

            return "/admin";


        default:

            return "/";

    }

}