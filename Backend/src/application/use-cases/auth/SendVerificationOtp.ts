import { IEmailVerificationRepository }
    from "../../../domain/repositories/IEmailVerificationRepository";

import { ITokenHasher }
    from "../../interfaces/ITokenHasher";

import { IOtpGenerator }
    from "../../interfaces/IOtpGenerator";

import { IEmailService }
    from "../../interfaces/IEmailService";

import { IAuthConfig }
    from "../../interfaces/IAuthConfig";

    import { SendVerificationOtpDTO } from "../../dtos/auth/SendVerificationOtpDTO";


export class SendVerificationOtp {

    constructor(
        private readonly emailVerificationRepository:
            IEmailVerificationRepository,

        private readonly otpGenerator:
            IOtpGenerator,

        private readonly tokenHasher:
            ITokenHasher,

        private readonly emailService:
            IEmailService,

        private readonly authConfig:
            IAuthConfig
    ) {}


    async execute(
        request: SendVerificationOtpDTO
    ): Promise<void> {

        const {
            userId,
            email
        } = request;


        await this.emailVerificationRepository
            .deleteByUserId(userId);


        const otp =
            this.otpGenerator.generate();


        const otpHash =
            await this.tokenHasher.hash(otp);


        const expiresAt =
            new Date(
                Date.now() +
                this.authConfig
                    .emailVerificationOtpExpiresInMs
            );


        await this.emailVerificationRepository.create(
            userId,
            otpHash,
            expiresAt
        );


        await this.emailService.send(
            email,
            "Verify your EDUCATE account",
            `
                <h2>Email Verification</h2>

                <p>
                    Your verification code is:
                </p>

                <h1>${otp}</h1>

                <p>
                    This code will expire in 10 minutes.
                </p>
            `
        );

    }

}