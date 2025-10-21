/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Helper functions and mocks for container tests
 */

/**
 * Setup common mocks used in container tests
 */
export const setupContainerMocks = () => {
  // Mock react-i18next
  jest.mock('react-i18next', () => ({
    useTranslation: () => ({
      t: (key: string) => key,
    }),
  }));
};

/**
 * Create a mock view component with common form controls
 */
export const createMockFormView = (testId: string) => {
  return ({ 
    text = '', 
    password = '', 
    encryptionMethod = 'AES256',
    onTextChange = () => {},
    onPasswordChange = () => {},
    onEncryptionMethodChange = () => {},
    ...props 
  }: any) => (
    <div data-testid={testId}>
      <input 
        data-testid="text-input" 
        value={text} 
        onChange={(e) => onTextChange(e.target.value)} 
      />
      <input 
        data-testid="password-input" 
        value={password} 
        onChange={(e) => onPasswordChange(e.target.value)} 
      />
      <select 
        data-testid="encryption-select" 
        value={encryptionMethod} 
        onChange={(e) => onEncryptionMethodChange(e.target.value)} 
      >
        <option value="AES256">AES256</option>
        <option value="TripleDES">TripleDES</option>
      </select>
      {Object.entries(props).map(([key, value]) => {
        if (typeof value === 'function' && key.startsWith('on')) {
          const eventName = key.replace('on', '').toLowerCase();
          return <button key={key} data-testid={`${eventName}-button`} onClick={value as () => void}>{eventName}</button>;
        }
        return null;
      })}
    </div>
  );
};

/**
 * Setup encryption service mock with common return values
 */
export const setupEncryptionServiceMock = (encryptionService: any, mockService: any) => {
  (encryptionService.getService as jest.Mock).mockReturnValue(mockService);
  mockService.encrypt.mockReturnValue('encrypted-data');
  mockService.decrypt.mockReturnValue('Decrypted message');
};
