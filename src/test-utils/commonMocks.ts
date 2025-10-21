/**
 * Common mock implementations used across multiple test files
 */

// Mock encryption service
export const createMockEncryptionService = () => ({
  encrypt: jest.fn(),
  decrypt: jest.fn(),
});

// Mock global browser APIs
export const setupGlobalMocks = () => {
  global.alert = jest.fn();
  global.prompt = jest.fn(() => 'testPassword');
};

// Clear all mocks
export const clearAllTestMocks = () => {
  jest.clearAllMocks();
};
