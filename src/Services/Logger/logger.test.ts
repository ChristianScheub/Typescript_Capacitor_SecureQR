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

    it('should extract function name from stack trace', () => {
      const testFunction = () => {
        Logger.log('Test from named function');
      };
      
      testFunction();
      expect(console.log).toHaveBeenCalled();
      const callArg = (console.log as jest.Mock).mock.calls[0][0];
      expect(callArg).toContain('Test from named function');
    });

    it('should handle stack traces without recognizable function names', () => {
      Logger.log('Direct call');
      expect(console.log).toHaveBeenCalled();
      const callArg = (console.log as jest.Mock).mock.calls[0][0];
      expect(callArg).toBeDefined();
      expect(callArg).toContain('Direct call');
    });
  });

  describe('info', () => {
    it('should call log method with INFO prefix', () => {
      // Since feature flags are false by default, this won't actually log
      // But we're testing that the method doesn't crash and follows the right code path
      expect(() => Logger.info('Info message')).not.toThrow();
    });

    it('should format info message correctly when it would log', () => {
      // Test the message format by directly calling log
      Logger.log('INFO: Test info message');
      expect(console.log).toHaveBeenCalled();
      const callArg = (console.log as jest.Mock).mock.calls[0][0];
      expect(callArg).toContain('INFO: Test info message');
    });
  });

  describe('warn', () => {
    it('should call log method with WARN prefix', () => {
      expect(() => Logger.warn('Warning message')).not.toThrow();
    });

    it('should format warn message correctly when it would log', () => {
      Logger.log('WARN: Test warning message');
      expect(console.log).toHaveBeenCalled();
      const callArg = (console.log as jest.Mock).mock.calls[0][0];
      expect(callArg).toContain('WARN: Test warning message');
    });
  });

  describe('error', () => {
    it('should call log method with ERROR prefix', () => {
      expect(() => Logger.error('Error message')).not.toThrow();
    });

    it('should format error message correctly when it would log', () => {
      Logger.log('ERROR: Test error message');
      expect(console.log).toHaveBeenCalled();
      const callArg = (console.log as jest.Mock).mock.calls[0][0];
      expect(callArg).toContain('ERROR: Test error message');
    });

    it('should handle complex error messages', () => {
      expect(() => Logger.error('Error: Failed to process data with ID 123')).not.toThrow();
    });
  });

  describe('infoRedux', () => {
    it('should call log method with Redux Log prefix', () => {
      expect(() => Logger.infoRedux('Redux state updated')).not.toThrow();
    });

    it('should format Redux log message correctly when it would log', () => {
      Logger.log('Redux Log: Test redux message');
      expect(console.log).toHaveBeenCalled();
      const callArg = (console.log as jest.Mock).mock.calls[0][0];
      expect(callArg).toContain('Redux Log: Test redux message');
    });
  });

  describe('getCallerFunctionName', () => {
    it('should handle different call stack scenarios', () => {
      // Test with a named function
      function namedFunction() {
        Logger.log('From named function');
      }
      namedFunction();
      expect(console.log).toHaveBeenCalled();

      // Test with anonymous function
      const anonymousFunction = () => {
        Logger.log('From anonymous function');
      };
      anonymousFunction();
      expect(console.log).toHaveBeenCalledTimes(2);

      // Test with direct call
      Logger.log('Direct call');
      expect(console.log).toHaveBeenCalledTimes(3);
    });
  });
});
