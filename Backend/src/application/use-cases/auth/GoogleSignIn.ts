import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IGoogleAuthService } from "../../interfaces/IGoogleAuthService";
import { IJwtService } from "../../interfaces/IJwtService";
import { IRefreshTokenRepository } from "../../../domain/repositories/IRefreshTokenRepository";
import { ITokenHasher } from "../../interfaces/ITokenHasher";
import { IAuthConfig } from "../../interfaces/IAuthConfig";
import { GoogleSignInDTO } from "../../dtos/auth/GoogleSignInDTO";
import { GoogleSignInResponseDTO } from "../../dtos/auth/GoogleSignInResponseDTO";
import { User } from "../../../domain/entities/User";
import { UserRole } from "../../../shared/enums/UserRole";
import { UserStatus } from "../../../shared/enums/UserStatus";
import { AuthProvider } from "../../../shared/enums/AuthProvider";

export class GoogleSignIn {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly googleAuthService: IGoogleAuthService,
    private readonly jwtService: IJwtService,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly tokenHasher: ITokenHasher,
    private readonly authConfig: IAuthConfig
  ) {}

  async execute(request: GoogleSignInDTO): Promise<{
    response: GoogleSignInResponseDTO;
    refreshToken: string;
  }> {
  
    const googleUser = await this.googleAuthService.verifyIdToken(
      request.credential
    );

    
    let user = await this.userRepository.findByEmail(googleUser.email);

    if (!user) {
      user = new User({
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        email: googleUser.email,
        avatar: googleUser.avatar,
        authProvider:AuthProvider.GOOGLE,
        role: UserRole.STUDENT,
        status: UserStatus.ACTIVE,
        isVerified: true,
      });

      user = await this.userRepository.create(user);
    }

   
    if (!user.id) {
      throw new Error("User ID is missing");
    }

   
    const accessToken = this.jwtService.generateAccessToken({
      userId: user.id,
      role: user.role,
    });

   
    const refreshToken = this.jwtService.generateRefreshToken(user.id);

   
    const tokenHash = this.tokenHasher.hash(refreshToken);

    
    const expiresAt = new Date(
      Date.now() + this.authConfig.refreshTokenExpiresInMs
    );

    
    await this.refreshTokenRepository.create(user.id, tokenHash, expiresAt);

    
    return {
      response: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
        },
        accessToken,
      },
      refreshToken,
    };
  }
}