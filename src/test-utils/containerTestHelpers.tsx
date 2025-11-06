/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Helper functions and mocks for container tests
 */

/**
 * Setup encryption service mock with common return values
 */
export const setupEncryptionServiceMock = (encryptionService: any, mockService: any) => {
  (encryptionService.getService as jest.Mock).mockReturnValue(mockService);
  mockService.encrypt.mockReturnValue('encrypted-data');
  mockService.decrypt.mockReturnValue('Decrypted message');
};

