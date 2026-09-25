export interface IImageTypePolicy {
    supports(contentType: string): boolean;
}
