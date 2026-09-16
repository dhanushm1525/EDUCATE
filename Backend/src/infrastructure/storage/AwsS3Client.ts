import {
    DeleteObjectCommand,
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { IS3Client } from "../../application/interfaces/IS3Client";

export class AwsS3Client implements IS3Client {
    constructor(private readonly _client: S3Client) {}

 
    async generateUploadUrl(
        bucketName: string,
        key: string,
        contentType: string,
        expiresIn: number
    ): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            ContentType: contentType,
        });

        const signedUrl = await getSignedUrl(this._client, command, {
            expiresIn,
        });

        console.log("Generated S3 upload URL host:", new URL(signedUrl).host);

        return signedUrl;
    }

    async generateDownloadUrl(
        bucketName: string,
        key: string,
        expiresIn: number
    ): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: key,
        });

        return getSignedUrl(this._client, command, { expiresIn });
    }

    async deleteFile(bucketName: string, key: string): Promise<void> {
        await this._client.send(
            new DeleteObjectCommand({
                Bucket: bucketName,
                Key: key,
            })
        );
    }
}