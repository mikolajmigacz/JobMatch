export const IFileStorageService = Symbol('IFileStorageService');

export interface IFileStorageService {
  uploadFile(bucket: string, key: string, body: Buffer, contentType: string): Promise<string>;
}
