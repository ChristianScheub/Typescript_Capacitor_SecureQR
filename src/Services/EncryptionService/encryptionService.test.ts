import { encryptionService } from './encryptionService';
import { EncryptionMethod } from '../../types/EncryptionMethod.types';

describe('EncryptionService', () => {
  const testData = 'Hello, World!';
  const testPassword = 'securePassword123';
  
  describe('AES256 Encryption', () => {
    let service: ReturnType<typeof encryptionService.getService>;

    beforeEach(() => {
      service = encryptionService.getService(EncryptionMethod.AES256);
    });

    it('should encrypt data', () => {
      const encrypted = service.encrypt(testData, testPassword);
      expect(encrypted).toBeDefined();
      expect(encrypted).not.toBe(testData);
      expect(encrypted.length).toBeGreaterThan(0);
    });

    it('should decrypt data correctly', () => {
      const encrypted = service.encrypt(testData, testPassword);
      const decrypted = service.decrypt(encrypted, testPassword);
      expect(decrypted).toBe(testData);
    });

    it('should fail to decrypt with wrong password', () => {
      const encrypted = service.encrypt(testData, testPassword);
      const decrypted = service.decrypt(encrypted, 'wrongPassword');
      expect(decrypted).not.toBe(testData);
    });

    it('should handle empty string', () => {
      const encrypted = service.encrypt('', testPassword);
      const decrypted = service.decrypt(encrypted, testPassword);
      expect(decrypted).toBe('');
    });

    it('should handle special characters', () => {
      const specialData = '!@#$%^&*()_+-=[]{}|;:\'",.<>?/~`';
      const encrypted = service.encrypt(specialData, testPassword);
      const decrypted = service.decrypt(encrypted, testPassword);
      expect(decrypted).toBe(specialData);
    });

    it('should handle unicode characters', () => {
      const unicodeData = '你好世界 🌍 مرحبا';
      const encrypted = service.encrypt(unicodeData, testPassword);
      const decrypted = service.decrypt(encrypted, testPassword);
      expect(decrypted).toBe(unicodeData);
    });
  });

  describe('TripleDES Encryption', () => {
    let service: ReturnType<typeof encryptionService.getService>;

    beforeEach(() => {
      service = encryptionService.getService(EncryptionMethod.TripleDES);
    });

    it('should encrypt data', () => {
      const encrypted = service.encrypt(testData, testPassword);
      expect(encrypted).toBeDefined();
      expect(encrypted).not.toBe(testData);
      expect(encrypted.length).toBeGreaterThan(0);
    });

    it('should decrypt data correctly', () => {
      const encrypted = service.encrypt(testData, testPassword);
      const decrypted = service.decrypt(encrypted, testPassword);
      expect(decrypted).toBe(testData);
    });

    it('should fail to decrypt with wrong password', () => {
      const encrypted = service.encrypt(testData, testPassword);
      try {
        const decrypted = service.decrypt(encrypted, 'wrongPassword');
        expect(decrypted).not.toBe(testData);
      } catch (error) {
        // Wrong password may throw error, which is acceptable
        expect(error).toBeDefined();
      }
    });

    it('should handle long text', () => {
      const longText = 'A'.repeat(1000);
      const encrypted = service.encrypt(longText, testPassword);
      const decrypted = service.decrypt(encrypted, testPassword);
      expect(decrypted).toBe(longText);
    });
  });

  describe('Blowfish Encryption', () => {
    let service: ReturnType<typeof encryptionService.getService>;

    beforeEach(() => {
      service = encryptionService.getService(EncryptionMethod.Blowfish);
    });

    it('should encrypt data', () => {
      const encrypted = service.encrypt(testData, testPassword);
      expect(encrypted).toBeDefined();
      expect(encrypted).not.toBe(testData);
      expect(encrypted.length).toBeGreaterThan(0);
    });

    it('should decrypt data correctly', () => {
      const encrypted = service.encrypt(testData, testPassword);
      const decrypted = service.decrypt(encrypted, testPassword);
      expect(decrypted).toBe(testData);
    });

    it('should fail to decrypt with wrong password', () => {
      const encrypted = service.encrypt(testData, testPassword);
      try {
        const decrypted = service.decrypt(encrypted, 'wrongPassword');
        expect(decrypted).not.toBe(testData);
      } catch (error) {
        // Wrong password may throw error, which is acceptable
        expect(error).toBeDefined();
      }
    });
  });

  describe('Rabbit Encryption', () => {
    let service: ReturnType<typeof encryptionService.getService>;

    beforeEach(() => {
      service = encryptionService.getService(EncryptionMethod.Rabbit);
    });

    it('should encrypt data', () => {
      const encrypted = service.encrypt(testData, testPassword);
      expect(encrypted).toBeDefined();
      expect(encrypted).not.toBe(testData);
      expect(encrypted.length).toBeGreaterThan(0);
    });

    it('should decrypt data correctly', () => {
      const encrypted = service.encrypt(testData, testPassword);
      const decrypted = service.decrypt(encrypted, testPassword);
      expect(decrypted).toBe(testData);
    });

    it('should fail to decrypt with wrong password', () => {
      const encrypted = service.encrypt(testData, testPassword);
      try {
        const decrypted = service.decrypt(encrypted, 'wrongPassword');
        expect(decrypted).not.toBe(testData);
      } catch (error) {
        // Wrong password may throw error, which is acceptable
        expect(error).toBeDefined();
      }
    });
  });

  describe('getService', () => {
    it('should return AES256 service', () => {
      const service = encryptionService.getService(EncryptionMethod.AES256);
      expect(service).toBeDefined();
      expect(service.encrypt).toBeDefined();
      expect(service.decrypt).toBeDefined();
    });

    it('should return TripleDES service', () => {
      const service = encryptionService.getService(EncryptionMethod.TripleDES);
      expect(service).toBeDefined();
      expect(service.encrypt).toBeDefined();
      expect(service.decrypt).toBeDefined();
    });

    it('should return Blowfish service', () => {
      const service = encryptionService.getService(EncryptionMethod.Blowfish);
      expect(service).toBeDefined();
      expect(service.encrypt).toBeDefined();
      expect(service.decrypt).toBeDefined();
    });

    it('should return Rabbit service', () => {
      const service = encryptionService.getService(EncryptionMethod.Rabbit);
      expect(service).toBeDefined();
      expect(service.encrypt).toBeDefined();
      expect(service.decrypt).toBeDefined();
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
