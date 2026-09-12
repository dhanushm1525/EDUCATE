import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { IStorageService } from "../../application/interfaces/IStorageService";

export interface S3Config {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucketName: string;
}

export class S3StorageService implements IStorageService {

    private readonly s3Client: S3Client;

    constructor(
        private readonly config: S3Config
    ) {

        this.s3Client = new S3Client({
            region: this.config.region,

            credentials: {
                accessKeyId: this.config.accessKeyId,

                secretAccessKey: this.config.secretAccessKey,
            },
        });
    }

    async generateUploadUrl(
        key: string,
        contentType: string
    ): Promise<string> {

        const command = new PutObjectCommand({
            Bucket: this.config.bucketName,

            Key: key,

            ContentType: contentType,
        });

        return await getSignedUrl(
            this.s3Client,

            command,

            {
                expiresIn: 300,
            }
        );
    }

    async generateDownloadUrl(
        key: string
    ): Promise<string> {

        const command = new GetObjectCommand({
            Bucket: this.config.bucketName,

            Key: key,
        });

        return await getSignedUrl(
            this.s3Client,

            command,

            {
                expiresIn: 300,
            }
        );
    }

    async deleteFile(
        key: string
    ): Promise<void> {

        const command = new DeleteObjectCommand({
            Bucket: this.config.bucketName,

            Key: key,
        });

        await this.s3Client.send(command);
    }
}