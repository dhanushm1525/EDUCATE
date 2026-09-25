import { s3Config } from "../config/s3Config";

import {
    S3StorageService,
} from "../storage/S3StorageService";
import { AwsS3Client } from "../../infrastructure/storage/AwsS3Client"
import { S3Client } from "@aws-sdk/client-s3";
import { S3ProfileImagePolicy } from "../storage/S3ProfileImagePolicy";
import { ProfileImageTypePolicy } from "../storage/ProfileImageTypePolicy";

const awsClient = new S3Client({
    region: s3Config.region,
    credentials: {
        accessKeyId: s3Config.accessKeyId,
        secretAccessKey: s3Config.secretAccessKey,
    },
    
});

const s3Client = new AwsS3Client(awsClient);

export const s3StorageService = new S3StorageService(s3Client, {
    bucketName: s3Config.bucketName,
});

export const profileImagePolicy = new S3ProfileImagePolicy();
export const imageTypePolicy = new ProfileImageTypePolicy();

console.log("S3 region:", JSON.stringify(s3Config.region));
console.log("S3 bucket:", JSON.stringify(s3Config.bucketName));
console.log(
    "S3 access key:",
    s3Config.accessKeyId.slice(0, 6) + "..."
);