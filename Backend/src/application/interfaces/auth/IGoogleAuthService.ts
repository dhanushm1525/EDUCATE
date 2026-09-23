export interface GoogleUserPayload {

    email: string;

    firstName: string;

    lastName: string;

    avatar?: string;

}


export interface IGoogleAuthService {

    verifyIdToken(
        credential: string
    ): Promise<GoogleUserPayload>;

}