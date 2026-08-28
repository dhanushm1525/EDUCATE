import { UserRole } from "../../shared/enums/UserRole";


declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                role: UserRole;
            };
        }
    }
}


export {};