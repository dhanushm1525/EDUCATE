import { LogoutUserDTO } from "../dtos/auth/LogoutUserDTO";

export interface ILogoutUser {
  execute(request: LogoutUserDTO): Promise<void>;
}
