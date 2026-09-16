export interface IS3Client {
    generateUploadUrl(
        bucketName: string,
        key: string,
        contentType: string,
        expiresIn: number
    ): Promise<string>;

    generateDownloadUrl(
        bucketName: string,
        key: string,
        expiresIn: number
    ): Promise<string>;

    deleteFile(bucketName: string, key: string): Promise<void>;
}