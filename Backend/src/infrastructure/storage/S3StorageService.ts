import { IS3Client } from "../../application/interfaces/storage/IS3Client";
import { IStorageService } from "../../application/interfaces/storage/IStorageService";

export interface S3Config {
    bucketName: string;
}

export class S3StorageService implements IStorageService {
    constructor(
        private readonly _s3Client: IS3Client,
        private readonly _config: S3Config
    ) {}

    generateUploadUrl(
        key: string,
        contentType: string
    ): Promise<string> {
        
        return this._s3Client.generateUploadUrl(
            this._config.bucketName,
            key,
            contentType,
            300
        );

        
    }

    generateDownloadUrl(key: string): Promise<string> {
        return this._s3Client.generateDownloadUrl(
            this._config.bucketName,
            key,
            300
        );
    }

    deleteFile(key: string): Promise<void> {
        return this._s3Client.deleteFile(this._config.bucketName, key);
    }
}