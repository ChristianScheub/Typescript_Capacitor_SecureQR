/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QRReaderContainer } from './QRReaderContainer';
import { encryptionService } from '../Services/EncryptionService/encryptionService';
import Logger from '../Services/Logger/logger';
import { createMockEncryptionService, setupGlobalMocks, clearAllTestMocks } from '../test-utils/commonMocks';
import { setupEncryptionServiceMock } from '../test-utils/containerTestHelpers';

// Mock dependencies
jest.mock('../Services/EncryptionService/encryptionService');
jest.mock('../Services/Logger/logger');

// Mock the view component
jest.mock('../Views/QRReaderView', () => ({
  QRReaderView: ({ 
    scannedText, 
    decryptedText, 
    encryptionMethod, 
    onScan, 
    onNewScan, 
    onEncryptionMethodChange 
  }: any) => (
    <div>
      <select 
        data-testid="encryption-select" 
        value={encryptionMethod} 
        onChange={(e) => onEncryptionMethodChange(e.target.value)} 
      >
        <option value="AES256">AES256</option>
        <option value="TripleDES">TripleDES</option>
      </select>
      <button 
        data-testid="scan-button" 
        onClick={() => onScan('encrypted-test-data')}
      >
        Scan
      </button>
      <button data-testid="new-scan-button" onClick={onNewScan}>New Scan</button>
      {scannedText && <div data-testid="scanned-text">{scannedText}</div>}
      {decryptedText && <div data-testid="decrypted-text">{decryptedText}</div>}
    </div>
  ),
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('QRReaderContainer', () => {
  const mockEncryptionService = createMockEncryptionService();

  beforeEach(() => {
    clearAllTestMocks();
    setupGlobalMocks();
    setupEncryptionServiceMock(encryptionService, mockEncryptionService);
  });

  it('renders without crashing', () => {
    render(<QRReaderContainer />);
    expect(screen.getByTestId('encryption-select')).toBeInTheDocument();
    expect(screen.getByTestId('scan-button')).toBeInTheDocument();
  });

  it('updates encryption method', () => {
    render(<QRReaderContainer />);
    const encryptionSelect = screen.getByTestId('encryption-select') as HTMLSelectElement;
    
    fireEvent.change(encryptionSelect, { target: { value: 'TripleDES' } });
    expect(encryptionSelect.value).toBe('TripleDES');
  });

  it('handles scan with valid data and password', async () => {
    render(<QRReaderContainer />);
    
    const scanButton = screen.getByTestId('scan-button');
    fireEvent.click(scanButton);
    
    await waitFor(() => {
      expect(global.prompt).toHaveBeenCalledWith('readerContainer_ScanPasswordPrompt');
      expect(mockEncryptionService.decrypt).toHaveBeenCalledWith('encrypted-test-data', 'testPassword');
      expect(screen.getByTestId('scanned-text')).toHaveTextContent('encrypted-test-data');
      expect(screen.getByTestId('decrypted-text')).toHaveTextContent('Decrypted message');
    });
  });

  it('shows alert when password is not provided', async () => {
    global.prompt = jest.fn(() => null);
    
    render(<QRReaderContainer />);
    
    const scanButton = screen.getByTestId('scan-button');
    fireEvent.click(scanButton);
    
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('readerContainer_noPasswortEntered');
    });
  });

  it('shows alert when password is empty string', async () => {
    global.prompt = jest.fn(() => '');
    
    render(<QRReaderContainer />);
    
    const scanButton = screen.getByTestId('scan-button');
    fireEvent.click(scanButton);
    
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('readerContainer_noPasswortEntered');
    });
  });

  it('handles decryption error', async () => {
    mockEncryptionService.decrypt.mockImplementation(() => {
      throw new Error('Decryption failed');
    });

    render(<QRReaderContainer />);
    
    const scanButton = screen.getByTestId('scan-button');
    fireEvent.click(scanButton);
    
    await waitFor(() => {
      expect(Logger.error).toHaveBeenCalledWith(expect.stringContaining('Decryption Error'));
      expect(global.alert).toHaveBeenCalledWith('popup_error');
    });
  });

  it('handles scan with null data', async () => {
    render(<QRReaderContainer />);
    
    const { QRReaderView } = require('../Views/QRReaderView');
    const mockOnScan = jest.fn();
    
    render(
      <QRReaderView
        scannedText={null}
        decryptedText={null}
        encryptionMethod="AES256"
        onScan={mockOnScan}
        onNewScan={jest.fn()}
        onEncryptionMethodChange={jest.fn()}
      />
    );
    
    // Verify component can handle null scannedText
    expect(screen.queryByTestId('scanned-text')).not.toBeInTheDocument();
  });

  it('resets state on new scan', async () => {
    render(<QRReaderContainer />);
    
    // First scan
    const scanButton = screen.getByTestId('scan-button');
    fireEvent.click(scanButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('scanned-text')).toBeInTheDocument();
    });
    
    // New scan
    const newScanButton = screen.getByTestId('new-scan-button');
    fireEvent.click(newScanButton);
    
    await waitFor(() => {
      expect(screen.queryByTestId('scanned-text')).not.toBeInTheDocument();
      expect(screen.queryByTestId('decrypted-text')).not.toBeInTheDocument();
    });
  });

  it('uses selected encryption method for decryption', async () => {
    render(<QRReaderContainer />);
    
    // Change encryption method
    const encryptionSelect = screen.getByTestId('encryption-select');
    fireEvent.change(encryptionSelect, { target: { value: 'TripleDES' } });
    
    // Scan
    const scanButton = screen.getByTestId('scan-button');
    fireEvent.click(scanButton);
    
    await waitFor(() => {
      expect(encryptionService.getService).toHaveBeenCalledWith('TripleDES');
    });
  });
});
