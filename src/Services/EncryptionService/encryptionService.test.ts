import { encryptionService } from './encryptionService';
import { EncryptionMethod } from '../../types/EncryptionMethod.types';
import { runStandardEncryptionTests, testServiceMethodAvailability } from '../../test-utils/encryptionTestHelpers';

describe('EncryptionService', () => {
  const testData = 'Hello, World!';
  const testPassword = 'securePassword123';
  
  describe('AES256 Encryption', () => {
    runStandardEncryptionTests({ method: EncryptionMethod.AES256, testData, testPassword });

    it('should handle empty string', () => {
      const service = encryptionService.getService(EncryptionMethod.AES256);
      const encrypted = service.encrypt('', testPassword);
      const decrypted = service.decrypt(encrypted, testPassword);
      expect(decrypted).toBe('');
    });

    it('should handle special characters', () => {
      const service = encryptionService.getService(EncryptionMethod.AES256);
      const specialData = '!@#$%^&*()_+-=[]{}|;:\'",.<>?/~`';
      const encrypted = service.encrypt(specialData, testPassword);
      const decrypted = service.decrypt(encrypted, testPassword);
      expect(decrypted).toBe(specialData);
    });

    it('should handle unicode characters', () => {
      const service = encryptionService.getService(EncryptionMethod.AES256);
      const unicodeData = '你好世界 🌍 مرحبا';
      const encrypted = service.encrypt(unicodeData, testPassword);
      const decrypted = service.decrypt(encrypted, testPassword);
      expect(decrypted).toBe(unicodeData);
    });
  });

  describe('TripleDES Encryption', () => {
    runStandardEncryptionTests({ method: EncryptionMethod.TripleDES, testData, testPassword });

    it('should handle long text', () => {
      const service = encryptionService.getService(EncryptionMethod.TripleDES);
      const longText = 'A'.repeat(1000);
      const encrypted = service.encrypt(longText, testPassword);
      const decrypted = service.decrypt(encrypted, testPassword);
      expect(decrypted).toBe(longText);
    });
  });

  describe('Blowfish Encryption', () => {
    runStandardEncryptionTests({ method: EncryptionMethod.Blowfish, testData, testPassword });
  });

  describe('Rabbit Encryption', () => {
    runStandardEncryptionTests({ method: EncryptionMethod.Rabbit, testData, testPassword });
  });

  describe('getService', () => {
    it('should return AES256 service', () => {
      testServiceMethodAvailability(EncryptionMethod.AES256);
    });

    it('should return TripleDES service', () => {
      testServiceMethodAvailability(EncryptionMethod.TripleDES);
    });

    it('should return Blowfish service', () => {
      testServiceMethodAvailability(EncryptionMethod.Blowfish);
    });

    it('should return Rabbit service', () => {
      testServiceMethodAvailability(EncryptionMethod.Rabbit);
    });

    it('should throw error for unsupported encryption method', () => {
      expect(() => {
        encryptionService.getService('INVALID' as EncryptionMethod);
      }).toThrow('Unsupported encryption method');
    });
  });

  describe('Cross-method compatibility', () => {
    it('should produce different encrypted outputs for different methods', () => {
      const aesService = encryptionService.getService(EncryptionMethod.AES256);
      const tripleDesService = encryptionService.getService(EncryptionMethod.TripleDES);
      
      const aesEncrypted = aesService.encrypt(testData, testPassword);
      const tripleDesEncrypted = tripleDesService.encrypt(testData, testPassword);
      
      expect(aesEncrypted).not.toBe(tripleDesEncrypted);
    });

    it('should not decrypt data encrypted with different method', () => {
      const aesService = encryptionService.getService(EncryptionMethod.AES256);
      const tripleDesService = encryptionService.getService(EncryptionMethod.TripleDES);
      
      const aesEncrypted = aesService.encrypt(testData, testPassword);
      const wrongDecrypted = tripleDesService.decrypt(aesEncrypted, testPassword);
      
      expect(wrongDecrypted).not.toBe(testData);
    });
  });
});
