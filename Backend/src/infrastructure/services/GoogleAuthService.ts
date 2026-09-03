import { OAuth2Client } from "google-auth-library";
import {
  IGoogleAuthService,
  GoogleUserPayload,
} from "../../application/interfaces/IGoogleAuthService";
import { AppError } from "../../shared/errors/AppError";

export class GoogleAuthService implements IGoogleAuthService {
  private readonly client: OAuth2Client;

  constructor(private readonly clientId: string) {
    this.client = new OAuth2Client(clientId);
  }

  async verifyIdToken(credential: string): Promise<GoogleUserPayload> {
    const ticket = await this.client.verifyIdToken({
      idToken: credential,
      audience: this.clientId,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      throw new AppError("Invalid Google token", 401);
    }

    if (!payload.email_verified) {
      throw new AppError("Google email is not verified", 401);
    }

    const firstName = payload.given_name ?? "Google";
    const lastName = payload.family_name ?? "";

    return {
      email: payload.email.trim().toLowerCase(),
      firstName,
      lastName,
      avatar: payload.picture,
    };
  }
}