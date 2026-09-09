import bcrypt from "bcrypt";

import { IPasswordHasher } from "../../application/interfaces/IPasswordHasher";



export class BcryptPasswordHasher implements IPasswordHasher{
    private readonly _saltRounds = 12;

    async hash(password:string):Promise<string>{
        return bcrypt.hash(password,this._saltRounds);
    }


    async compare(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password,hashedPassword);
    }
}


