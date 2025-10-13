import { handleImageDownload } from './fileHandler';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import Logger from '../Logger/logger';

jest.mock('@capacitor/filesystem');
jest.mock('@capacitor/share');
jest.mock('../Logger/logger');

describe('fileHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleImageDownload', () => {
    const mockQRCode = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    it('should write file to filesystem', async () => {
      (Filesystem.writeFile as jest.Mock).mockResolvedValue({});
      (Filesystem.getUri as jest.Mock).mockResolvedValue({ uri: 'file://test.png' });
      (Share.share as jest.Mock).mockResolvedValue({});

      await handleImageDownload(mockQRCode);

      expect(Filesystem.writeFile).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.any(String),
          directory: Directory.Documents,
          path: expect.stringMatching(/qrCode-\d{8}-\d{6}\.png/),
        })
      );
    });

    it('should get URI of written file', async () => {
      (Filesystem.writeFile as jest.Mock).mockResolvedValue({});
      (Filesystem.getUri as jest.Mock).mockResolvedValue({ uri: 'file://test.png' });
      (Share.share as jest.Mock).mockResolvedValue({});

      await handleImageDownload(mockQRCode);

      expect(Filesystem.getUri).toHaveBeenCalledWith(
        expect.objectContaining({
          directory: Directory.Documents,
          path: expect.stringMatching(/qrCode-\d{8}-\d{6}\.png/),
        })
      );
    });

    it('should share the file', async () => {
      const mockUri = 'file://test.png';
      (Filesystem.writeFile as jest.Mock).mockResolvedValue({});
      (Filesystem.getUri as jest.Mock).mockResolvedValue({ uri: mockUri });
      (Share.share as jest.Mock).mockResolvedValue({});

      await handleImageDownload(mockQRCode);

      expect(Share.share).toHaveBeenCalledWith({ url: mockUri });
    });

    it('should handle errors and log them', async () => {
      const error = new Error('Filesystem error');
      (Filesystem.writeFile as jest.Mock).mockRejectedValue(error);

      // Mock DOM methods for fallback
      const mockLink = {
        href: '',
        download: '',
        click: jest.fn(),
      } as unknown as HTMLAnchorElement;
      jest.spyOn(document, 'createElement').mockReturnValue(mockLink);
      jest.spyOn(document.body, 'appendChild').mockImplementation();
      jest.spyOn(document.body, 'removeChild').mockImplementation();
      
      // Mock URL methods in jsdom
      global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
      global.URL.revokeObjectURL = jest.fn();

      await handleImageDownload(mockQRCode);

      expect(Logger.error).toHaveBeenCalledWith(expect.stringContaining('Error exporting QR Code'));
    });

    it('should use fallback download on error', async () => {
      const error = new Error('Filesystem error');
      (Filesystem.writeFile as jest.Mock).mockRejectedValue(error);

      const mockLink = {
        href: '',
        download: '',
        click: jest.fn(),
      } as unknown as HTMLAnchorElement;
      const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(mockLink);
      jest.spyOn(document.body, 'appendChild').mockImplementation();
      jest.spyOn(document.body, 'removeChild').mockImplementation();
      
      // Mock URL methods in jsdom
      global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
      global.URL.revokeObjectURL = jest.fn();

      await handleImageDownload(mockQRCode);

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(mockLink.click).toHaveBeenCalled();
    });
  });
});
