import { env } from "./env";

export const s3Config = {
    region: env.awsRegion,

    accessKeyId: env.awsAccessKeyId,

    secretAccessKey: env.awsSecretAccessKey,

    bucketName: env.awsS3BucketName,
};