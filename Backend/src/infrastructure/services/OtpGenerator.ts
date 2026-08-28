import crypto from "crypto";
import { IOtpGenerator } from "../../application/interfaces/IOtpGenerator";


export class OtpGenerator implements IOtpGenerator{

    generate(): string {
        const otp = crypto.randomInt(100000,1000000);

        return otp.toString();
    }
}