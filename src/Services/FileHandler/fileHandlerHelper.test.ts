import { generateFileName, downloadFile } from './fileHandlerHelper';

describe('fileHandlerHelper', () => {
  describe('generateFileName', () => {
    it('should generate a filename with correct format', () => {
      const fileName = generateFileName();
      expect(fileName).toMatch(/^qrCode-\d{8}-\d{6}\.png$/);
    });

    it('should generate unique filenames', () => {
      const fileName1 = generateFileName();
      // Wait a tiny bit to ensure different timestamp
      const fileName2 = generateFileName();
      // Both should be valid filenames
      expect(fileName1).toMatch(/^qrCode-\d{8}-\d{6}\.png$/);
      expect(fileName2).toMatch(/^qrCode-\d{8}-\d{6}\.png$/);
    });

    it('should include date components', () => {
      const fileName = generateFileName();
      const now = new Date();
      const year = now.getFullYear();
      expect(fileName).toContain(year.toString());
    });

    it('should have .png extension', () => {
      const fileName = generateFileName();
      expect(fileName.endsWith('.png')).toBe(true);
    });
  });

  describe('downloadFile', () => {
    let createElement: jest.SpyInstance;
    let appendChild: jest.SpyInstance;
    let removeChild: jest.SpyInstance;
    let mockLink: HTMLAnchorElement;

    beforeEach(() => {
      // Create a mock link element
      mockLink = {
        href: '',
        download: '',
        click: jest.fn(),
      } as unknown as HTMLAnchorElement;

      createElement = jest.spyOn(document, 'createElement').mockReturnValue(mockLink);
      appendChild = jest.spyOn(document.body, 'appendChild').mockImplementation();
      removeChild = jest.spyOn(document.body, 'removeChild').mockImplementation();
      
      // Mock URL methods in jsdom
      global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
      global.URL.revokeObjectURL = jest.fn();
    });

    afterEach(() => {
      createElement.mockRestore();
      appendChild.mockRestore();
      removeChild.mockRestore();
    });

    it('should create a download link', () => {
      const testData = 'data:image/png;base64,test';
      const fileName = 'test.png';

      downloadFile(testData, fileName);

      expect(createElement).toHaveBeenCalledWith('a');
      expect(mockLink.download).toBe(fileName);
    });

    it('should trigger click on link', () => {
      const testData = 'test data';
      const fileName = 'test.png';

      downloadFile(testData, fileName);

      expect(mockLink.click).toHaveBeenCalled();
    });

    it('should append and remove link from document', () => {
      const testData = 'test data';
      const fileName = 'test.png';

      downloadFile(testData, fileName);

      expect(appendChild).toHaveBeenCalledWith(mockLink);
      expect(removeChild).toHaveBeenCalledWith(mockLink);
    });

    it('should create and revoke object URL', () => {
      const testData = 'test data';
      const fileName = 'test.png';

      downloadFile(testData, fileName);

      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(global.URL.revokeObjectURL).toHaveBeenCalled();
    });
  });
});
