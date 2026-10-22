import { Types } from "mongoose";

import { IIdentifierValidator } from "../../application/interfaces/services/IIdentifierValidator";

export class MongoObjectIdValidator implements IIdentifierValidator {
    isValid(identifier: string): boolean {
        return Types.ObjectId.isValid(identifier);
    }
}
