/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QRReaderContainer } from './QRReaderContainer';
import { encryptionService } from '../Services/EncryptionService/encryptionService';
import Logger from '../Services/Logger/logger';
import { createMockEncryptionService, setupGlobalMocks, clearAllTestMocks } from '../test-utils/commonMocks';
import { setupEncryptionServiceMock } from '../test-utils/containerTestHelpers';
import QrScanner from 'qr-scanner';

jest.mock('../Services/EncryptionService/encryptionService');
jest.mock('../Services/Logger/logger');
jest.mock('qr-scanner', () => ({
  default: jest.fn(),
  scanImage: jest.fn(),
}));
jest.mock('../Views/QRReaderView', () => ({
  QRReaderView: ({ scannedText, decryptedText, encryptionMethod, onScan, onNewScan, onEncryptionMethodChange, onImageUpload }: any) => (
    <div>
      <select data-testid="encryption-select" value={encryptionMethod} onChange={(e) => onEncryptionMethodChange(e.target.value)}>
        <option value="AES256">AES256</option>
        <option value="TripleDES">TripleDES</option>
      </select>
      <button data-testid="scan-button" onClick={() => onScan('encrypted-test-data')}>Scan</button>
      <button data-testid="new-scan-button" onClick={onNewScan}>New Scan</button>
      <input data-testid="image-upload" type="file" onChange={onImageUpload} />
      {scannedText && <div data-testid="scanned-text">{scannedText}</div>}
      {decryptedText && <div data-testid="decrypted-text">{decryptedText}</div>}
    </div>
  ),
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
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
    fireEvent.change(screen.getByTestId('encryption-select'), { target: { value: 'TripleDES' } });
    expect((screen.getByTestId('encryption-select') as HTMLSelectElement).value).toBe('TripleDES');
  });

  it('handles scan with valid data and password', async () => {
    render(<QRReaderContainer />);
    fireEvent.click(screen.getByTestId('scan-button'));
    
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
    fireEvent.click(screen.getByTestId('scan-button'));
    await waitFor(() => expect(global.alert).toHaveBeenCalledWith('readerContainer_noPasswortEntered'));
  });

  it('shows alert when password is empty string', async () => {
    global.prompt = jest.fn(() => '');
    render(<QRReaderContainer />);
    fireEvent.click(screen.getByTestId('scan-button'));
    await waitFor(() => expect(global.alert).toHaveBeenCalledWith('readerContainer_noPasswortEntered'));
  });

  it('handles decryption error', async () => {
    mockEncryptionService.decrypt.mockImplementation(() => { throw new Error('Decryption failed'); });
    render(<QRReaderContainer />);
    fireEvent.click(screen.getByTestId('scan-button'));
    
    await waitFor(() => {
      expect(Logger.error).toHaveBeenCalledWith(expect.stringContaining('Decryption Error'));
      expect(global.alert).toHaveBeenCalledWith('popup_error');
    });
  });

  it('handles scan with null data', async () => {
    const { QRReaderView } = require('../Views/QRReaderView');
    render(<QRReaderView scannedText={null} decryptedText={null} encryptionMethod="AES256" onScan={jest.fn()} onNewScan={jest.fn()} onEncryptionMethodChange={jest.fn()} />);
    expect(screen.queryByTestId('scanned-text')).not.toBeInTheDocument();
  });

  it('resets state on new scan', async () => {
    render(<QRReaderContainer />);
    fireEvent.click(screen.getByTestId('scan-button'));
    await waitFor(() => expect(screen.getByTestId('scanned-text')).toBeInTheDocument());
    
    fireEvent.click(screen.getByTestId('new-scan-button'));
    await waitFor(() => {
      expect(screen.queryByTestId('scanned-text')).not.toBeInTheDocument();
      expect(screen.queryByTestId('decrypted-text')).not.toBeInTheDocument();
    });
  });

  it('uses selected encryption method for decryption', async () => {
    render(<QRReaderContainer />);
    fireEvent.change(screen.getByTestId('encryption-select'), { target: { value: 'TripleDES' } });
    fireEvent.click(screen.getByTestId('scan-button'));
    await waitFor(() => expect(encryptionService.getService).toHaveBeenCalledWith('TripleDES'));
  });

  it('handles image upload with valid QR code', async () => {
    const mockScanImage = QrScanner.scanImage as jest.Mock;
    mockScanImage.mockResolvedValue({ data: 'encrypted-image-data' });

    render(<QRReaderContainer />);
    
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const input = screen.getByTestId('image-upload');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(mockScanImage).toHaveBeenCalledWith(file, { returnDetailedScanResult: true });
      expect(Logger.info).toHaveBeenCalledWith(expect.stringContaining('QR Code detected from image'));
      expect(global.prompt).toHaveBeenCalledWith('readerContainer_ScanPasswordPrompt');
      expect(screen.getByTestId('scanned-text')).toHaveTextContent('encrypted-image-data');
    });
  });

  it('handles image upload error', async () => {
    const mockScanImage = QrScanner.scanImage as jest.Mock;
    mockScanImage.mockRejectedValue(new Error('No QR code found'));

    render(<QRReaderContainer />);
    
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const input = screen.getByTestId('image-upload');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(Logger.error).toHaveBeenCalledWith(expect.stringContaining('Error scanning image'));
      expect(global.alert).toHaveBeenCalledWith('popup_error');
    });
  });

  it('handles image upload with no file selected', async () => {
    const mockScanImage = QrScanner.scanImage as jest.Mock;
    
    render(<QRReaderContainer />);
    
    const input = screen.getByTestId('image-upload');
    fireEvent.change(input, { target: { files: [] } });
    
    await waitFor(() => {
      expect(mockScanImage).not.toHaveBeenCalled();
    });
  });
});
