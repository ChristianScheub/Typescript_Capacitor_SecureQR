/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QRGeneratorContainer } from './QRGeneratorContainer';
import { encryptionService } from '../Services/EncryptionService/encryptionService';
import QRCode from 'qrcode';
import Logger from '../Services/Logger/logger';
import { createMockEncryptionService, setupGlobalMocks, clearAllTestMocks } from '../test-utils/commonMocks';
import { setupEncryptionServiceMock } from '../test-utils/containerTestHelpers';

jest.mock('../Services/EncryptionService/encryptionService');
jest.mock('qrcode');
jest.mock('../Services/Logger/logger');
jest.mock('../Services/FileHandler/fileHandler', () => ({ handleImageDownload: jest.fn() }));
jest.mock('../Services/Ads/AdInterstitial', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('../Views/QRGeneratorView', () => ({
  QRGeneratorView: ({ text, password, encryptionMethod, qrCode, onTextChange, onPasswordChange, onEncryptionMethodChange, onGenerateQRCode, onDownloadQRCode }: any) => (
    <div>
      <input data-testid="text-input" value={text} onChange={(e) => onTextChange(e.target.value)} />
      <input data-testid="password-input" value={password} onChange={(e) => onPasswordChange(e.target.value)} />
      <select data-testid="encryption-select" value={encryptionMethod} onChange={(e) => onEncryptionMethodChange(e.target.value)}>
        <option value="AES256">AES256</option>
        <option value="TripleDES">TripleDES</option>
      </select>
      <button data-testid="generate-button" onClick={onGenerateQRCode}>Generate</button>
      <button data-testid="download-button" onClick={onDownloadQRCode}>Download</button>
      {qrCode && <div data-testid="qr-code">QR Code Generated</div>}
    </div>
  ),
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('QRGeneratorContainer', () => {
  const mockEncryptionService = createMockEncryptionService();

  beforeEach(() => {
    clearAllTestMocks();
    setupGlobalMocks();
    setupEncryptionServiceMock(encryptionService, mockEncryptionService);
    (QRCode.toDataURL as jest.Mock).mockResolvedValue('data:image/png;base64,mockqrcode');
  });

  it('renders without crashing', () => {
    render(<QRGeneratorContainer />);
    expect(screen.getByTestId('text-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
  });

  it('updates text input', () => {
    render(<QRGeneratorContainer />);
    fireEvent.change(screen.getByTestId('text-input'), { target: { value: 'Test message' } });
    expect((screen.getByTestId('text-input') as HTMLInputElement).value).toBe('Test message');
  });

  it('updates password input', () => {
    render(<QRGeneratorContainer />);
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } });
    expect((screen.getByTestId('password-input') as HTMLInputElement).value).toBe('password123');
  });

  it('updates encryption method', () => {
    render(<QRGeneratorContainer />);
    fireEvent.change(screen.getByTestId('encryption-select'), { target: { value: 'TripleDES' } });
    expect((screen.getByTestId('encryption-select') as HTMLSelectElement).value).toBe('TripleDES');
  });

  it('shows alert when generating QR without text or password', async () => {
    render(<QRGeneratorContainer />);
    fireEvent.click(screen.getByTestId('generate-button'));
    await waitFor(() => expect(global.alert).toHaveBeenCalledWith('generatorContainer_PopupNoTextPassword'));
  });

  it('generates QR code successfully', async () => {
    render(<QRGeneratorContainer />);
    fireEvent.change(screen.getByTestId('text-input'), { target: { value: 'Test message' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByTestId('generate-button'));
    
    await waitFor(() => {
      expect(mockEncryptionService.encrypt).toHaveBeenCalledWith('Test message', 'password123');
      expect(QRCode.toDataURL).toHaveBeenCalledWith('encrypted-data');
      expect(screen.getByTestId('qr-code')).toBeInTheDocument();
    });
  });

  it('handles QR generation error', async () => {
    mockEncryptionService.encrypt.mockImplementation(() => { throw new Error('Encryption failed'); });
    render(<QRGeneratorContainer />);
    fireEvent.change(screen.getByTestId('text-input'), { target: { value: 'Test message' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByTestId('generate-button'));
    
    await waitFor(() => {
      expect(Logger.error).toHaveBeenCalled();
      expect(global.alert).toHaveBeenCalledWith('popup_error');
    });
  });

  it('downloads QR code when available', async () => {
    const { handleImageDownload } = require('../Services/FileHandler/fileHandler');
    render(<QRGeneratorContainer />);
    fireEvent.change(screen.getByTestId('text-input'), { target: { value: 'Test message' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByTestId('generate-button'));
    
    await waitFor(() => expect(screen.getByTestId('qr-code')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('download-button'));
    await waitFor(() => expect(handleImageDownload).toHaveBeenCalledWith('data:image/png;base64,mockqrcode'));
  });

  it('shows warning when trying to download without QR code', () => {
    render(<QRGeneratorContainer />);
    fireEvent.click(screen.getByTestId('download-button'));
    expect(Logger.warn).toHaveBeenCalledWith('No QR code to download');
    expect(global.alert).toHaveBeenCalledWith('generatorContainer_NoQrCodeDownload');
  });
});
