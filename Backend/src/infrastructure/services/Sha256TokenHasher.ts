import crypto from "crypto";
import { ITokenHasher } from "../../application/interfaces/services/ITokenHasher";




export class Sha256TokenHasher implements ITokenHasher{
    hash(token:string):string{
        return crypto.createHash("sha256").update(token).digest("hex")
    }
}