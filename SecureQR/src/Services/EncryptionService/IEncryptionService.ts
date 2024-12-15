export interface IEncryptionService {
    encrypt(data: string, password: string): string;
    decrypt(encryptedData: string, password: string): string;
  }  