import { Resend } from "resend";
import { IEmailService } from "../../application/interfaces/IEmailService";
import {env} from "../config/env"


export class ResendEmailService implements IEmailService{

    private readonly _resend:Resend;

    constructor(){
        this._resend = new Resend(env.resendApiKey)
    }


    async send(
        to:string,
        subject:string,
        html:string
    ):Promise<void>{
        const {error} = await this._resend.emails.send({
            from:env.emailFrom,
            to,
            subject,
            html
        });


        if(error){
            throw new Error(`Failed to send email: ${error.message}`)
        }
    }
}