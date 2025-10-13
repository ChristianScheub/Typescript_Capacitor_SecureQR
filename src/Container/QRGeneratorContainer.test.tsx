import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QRGeneratorContainer } from './QRGeneratorContainer';
import { encryptionService } from '../Services/EncryptionService/encryptionService';
import QRCode from 'qrcode';
import Logger from '../Services/Logger/logger';

// Mock dependencies
jest.mock('../Services/EncryptionService/encryptionService');
jest.mock('qrcode');
jest.mock('../Services/Logger/logger');
jest.mock('../Services/FileHandler/fileHandler', () => ({
  handleImageDownload: jest.fn(),
}));
jest.mock('../Services/Ads/AdInterstitial', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock the view component
jest.mock('../Views/QRGeneratorView', () => ({
  QRGeneratorView: ({ 
    text, 
    password, 
    encryptionMethod, 
    qrCode, 
    onTextChange, 
    onPasswordChange, 
    onEncryptionMethodChange, 
    onGenerateQRCode, 
    onDownloadQRCode 
  }: any) => (
    <div>
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
      <button data-testid="generate-button" onClick={onGenerateQRCode}>Generate</button>
      <button data-testid="download-button" onClick={onDownloadQRCode}>Download</button>
      {qrCode && <div data-testid="qr-code">QR Code Generated</div>}
    </div>
  ),
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('QRGeneratorContainer', () => {
  const mockEncryptionService = {
    encrypt: jest.fn(),
    decrypt: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (encryptionService.getService as jest.Mock).mockReturnValue(mockEncryptionService);
    mockEncryptionService.encrypt.mockReturnValue('encrypted-data');
    (QRCode.toDataURL as jest.Mock).mockResolvedValue('data:image/png;base64,mockqrcode');
    global.alert = jest.fn();
  });

  it('renders without crashing', () => {
    render(<QRGeneratorContainer />);
    expect(screen.getByTestId('text-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
  });

  it('updates text input', () => {
    render(<QRGeneratorContainer />);
    const textInput = screen.getByTestId('text-input') as HTMLInputElement;
    
    fireEvent.change(textInput, { target: { value: 'Test message' } });
    expect(textInput.value).toBe('Test message');
  });

  it('updates password input', () => {
    render(<QRGeneratorContainer />);
    const passwordInput = screen.getByTestId('password-input') as HTMLInputElement;
    
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput.value).toBe('password123');
  });

  it('updates encryption method', () => {
    render(<QRGeneratorContainer />);
    const encryptionSelect = screen.getByTestId('encryption-select') as HTMLSelectElement;
    
    fireEvent.change(encryptionSelect, { target: { value: 'TripleDES' } });
    expect(encryptionSelect.value).toBe('TripleDES');
  });

  it('shows alert when generating QR without text or password', async () => {
    render(<QRGeneratorContainer />);
    const generateButton = screen.getByTestId('generate-button');
    
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('generatorContainer_PopupNoTextPassword');
    });
  });

  it('generates QR code successfully', async () => {
    render(<QRGeneratorContainer />);
    
    const textInput = screen.getByTestId('text-input');
    const passwordInput = screen.getByTestId('password-input');
    const generateButton = screen.getByTestId('generate-button');
    
    fireEvent.change(textInput, { target: { value: 'Test message' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      expect(mockEncryptionService.encrypt).toHaveBeenCalledWith('Test message', 'password123');
      expect(QRCode.toDataURL).toHaveBeenCalledWith('encrypted-data');
      expect(screen.getByTestId('qr-code')).toBeInTheDocument();
    });
  });

  it('handles QR generation error', async () => {
    mockEncryptionService.encrypt.mockImplementation(() => {
      throw new Error('Encryption failed');
    });

    render(<QRGeneratorContainer />);
    
    const textInput = screen.getByTestId('text-input');
    const passwordInput = screen.getByTestId('password-input');
    const generateButton = screen.getByTestId('generate-button');
    
    fireEvent.change(textInput, { target: { value: 'Test message' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      expect(Logger.error).toHaveBeenCalled();
      expect(global.alert).toHaveBeenCalledWith('popup_error');
    });
  });

  it('downloads QR code when available', async () => {
    const { handleImageDownload } = require('../Services/FileHandler/fileHandler');
    
    render(<QRGeneratorContainer />);
    
    // Generate QR code first
    const textInput = screen.getByTestId('text-input');
    const passwordInput = screen.getByTestId('password-input');
    const generateButton = screen.getByTestId('generate-button');
    
    fireEvent.change(textInput, { target: { value: 'Test message' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('qr-code')).toBeInTheDocument();
    });
    
    // Now download
    const downloadButton = screen.getByTestId('download-button');
    fireEvent.click(downloadButton);
    
    await waitFor(() => {
      expect(handleImageDownload).toHaveBeenCalledWith('data:image/png;base64,mockqrcode');
    });
  });

  it('shows warning when trying to download without QR code', () => {
    render(<QRGeneratorContainer />);
    
    const downloadButton = screen.getByTestId('download-button');
    fireEvent.click(downloadButton);
    
    expect(Logger.warn).toHaveBeenCalledWith('No QR code to download');
    expect(global.alert).toHaveBeenCalledWith('generatorContainer_NoQrCodeDownload');
  });
});
