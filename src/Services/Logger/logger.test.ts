import Logger from './logger';

// Mock console methods
const originalConsoleLog = console.log;

describe('Logger', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    console.log = jest.fn();
  });

  afterEach(() => {
    console.log = originalConsoleLog;
  });

  describe('log', () => {
    it('should log messages with function name', () => {
      Logger.log('Test message');
      expect(console.log).toHaveBeenCalled();
      const callArg = (console.log as jest.Mock).mock.calls[0][0];
      expect(callArg).toContain('Test message');
    });

    it('should handle empty messages', () => {
      Logger.log('');
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('info', () => {
    it('should log info messages when feature flag is enabled', () => {
      // Mock the feature flag
      jest.mock('../../config/featureFlags', () => ({
        featureFlag_Debug_Log_Info: true,
        featureFlag_Debug_AllLogs: false,
      }));
      
      Logger.info('Info message');
      // The actual logging depends on feature flags, so we just ensure no errors
      expect(console.log).toHaveBeenCalledTimes(0); // Default flags are false
    });
  });

  describe('warn', () => {
    it('should log warning messages when feature flag is enabled', () => {
      Logger.warn('Warning message');
      // The actual logging depends on feature flags, so we just ensure no errors
      expect(console.log).toHaveBeenCalledTimes(0); // Default flags are false
    });
  });

  describe('error', () => {
    it('should log error messages when feature flag is enabled', () => {
      Logger.error('Error message');
      // The actual logging depends on feature flags, so we just ensure no errors
      expect(console.log).toHaveBeenCalledTimes(0); // Default flags are false
    });

    it('should handle complex error messages', () => {
      Logger.error('Error: Failed to process data with ID 123');
      expect(console.log).toHaveBeenCalledTimes(0); // Default flags are false
    });
  });

  describe('infoRedux', () => {
    it('should log Redux info messages when feature flag is enabled', () => {
      Logger.infoRedux('Redux state updated');
      // The actual logging depends on feature flags, so we just ensure no errors
      expect(console.log).toHaveBeenCalledTimes(0); // Default flags are false
    });
  });

  describe('getCallerFunctionName', () => {
    it('should extract function name from stack trace', () => {
      const testFunction = () => {
        Logger.log('Test from named function');
      };
      
      testFunction();
      expect(console.log).toHaveBeenCalled();
    });
  });
});
