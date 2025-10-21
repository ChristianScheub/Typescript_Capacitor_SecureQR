/**
 * Helper functions to reduce duplication in encryption service tests
 */
import { EncryptionMethod } from '../types/EncryptionMethod.types';
import { encryptionService } from '../Services/EncryptionService/encryptionService';

interface EncryptionTestSuite {
  method: EncryptionMethod;
  testData: string;
  testPassword: string;
}

/**
 * Run standard encryption tests for a given encryption method
 */
export const runStandardEncryptionTests = ({ method, testData, testPassword }: EncryptionTestSuite) => {
  let service: ReturnType<typeof encryptionService.getService>;

  beforeEach(() => {
    service = encryptionService.getService(method);
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
};

/**
 * Test encryption service method availability
 */
export const testServiceMethodAvailability = (method: EncryptionMethod) => {
  const service = encryptionService.getService(method);
  expect(service).toBeDefined();
  expect(service.encrypt).toBeDefined();
  expect(service.decrypt).toBeDefined();
};
