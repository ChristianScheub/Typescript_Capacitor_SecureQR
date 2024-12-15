import CryptoJS from 'crypto-js';
import { IEncryptionService } from './IEncryptionService';
import { EncryptionMethod } from '../../types/EncryptionMethod.types';

// AES256 Encryption
class AES256EncryptionService implements IEncryptionService {
  encrypt(data: string, password: string): string {
    return CryptoJS.AES.encrypt(data, password).toString();
  }

  decrypt(encryptedData: string, password: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, password);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}

// TripleDES Encryption
class TripleDESEncryptionService implements IEncryptionService {
  encrypt(data: string, password: string): string {
    return CryptoJS.TripleDES.encrypt(data, password).toString();
  }

  decrypt(encryptedData: string, password: string): string {
    const bytes = CryptoJS.TripleDES.decrypt(encryptedData, password);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}

// Blowfish Encryption
class BlowfishEncryptionService implements IEncryptionService {
  encrypt(data: string, password: string): string {
    return CryptoJS.Blowfish.encrypt(data, password).toString();
  }

  decrypt(encryptedData: string, password: string): string {
    const bytes = CryptoJS.Blowfish.decrypt(encryptedData, password);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}

// Rabbit Encryption
class RabbitEncryptionService implements IEncryptionService {
  encrypt(data: string, password: string): string {
    return CryptoJS.Rabbit.encrypt(data, password).toString();
  }

  decrypt(encryptedData: string, password: string): string {
    const bytes = CryptoJS.Rabbit.decrypt(encryptedData, password);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}

export const encryptionService = {
  getService(encryptionMethod: EncryptionMethod): IEncryptionService {
    switch (encryptionMethod) {
      case EncryptionMethod.AES256:
        return new AES256EncryptionService();
      case EncryptionMethod.TripleDES:
        return new TripleDESEncryptionService();
      case EncryptionMethod.Blowfish:
        return new BlowfishEncryptionService();
      case EncryptionMethod.Rabbit:
        return new RabbitEncryptionService();
      default:
        throw new Error('Unsupported encryption method');
    }
  }
};