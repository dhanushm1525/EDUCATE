export interface IStorageService {
    generateUploadUrl(key: string, contentType: string): Promise<string>


    generateDownloadUrl(key: string): Promise<string>

    deleteFile(key: string): Promise<void>
}