import { s3Config } from "../config/s3Config";

import {
    S3StorageService,
} from "../storage/S3StorageService";

export const s3StorageService = new S3StorageService(s3Config);