import { Resend } from "resend";
import { IEmailService } from "../../application/interfaces/IEmailService";

export class ResendEmailService implements IEmailService {
    constructor(
        private readonly _resend: Resend,
        private readonly _emailFrom: string
    ) {}

    async send(
        to:string,
        subject:string,
        html:string
    ):Promise<void>{
        const {error} = await this._resend.emails.send({
            from:this._emailFrom,
            to,
            subject,
            html
        });


        if(error){
            throw new Error(`Failed to send email: ${error.message}`)
        }
    }
}