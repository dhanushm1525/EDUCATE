import { GoogleSignInDTO } from "../dtos/auth/GoogleSignInDTO";
import { GoogleSignInResponseDTO } from "../dtos/auth/GoogleSignInResponseDTO";

export interface IGoogleSignIn {
  execute(request: GoogleSignInDTO): Promise<{
    response: GoogleSignInResponseDTO;
    refreshToken: string;
  }>;
}
