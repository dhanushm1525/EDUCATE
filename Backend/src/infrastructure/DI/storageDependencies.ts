import { s3Config } from "../config/s3Config";

import {
    S3StorageService,
} from "../storage/S3StorageService";
import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: s3Config.region,
    credentials: {
        accessKeyId: s3Config.accessKeyId,
        secretAccessKey: s3Config.secretAccessKey,
    },
});

export const s3StorageService = new S3StorageService(s3Client, s3Config);