import { generateFileName, downloadFile } from './fileHandlerHelper';
import { setupDownloadLinkMocks } from '../../test-utils/domMockHelpers';

describe('fileHandlerHelper', () => {
  const FILENAME_PATTERN = /^qrCode-\d{8}-\d{6}\.png$/;

  describe('generateFileName', () => {
    it('should generate a filename with correct format', () => {
      const fileName = generateFileName();
      expect(fileName).toMatch(FILENAME_PATTERN);
    });

    it('should generate unique filenames', () => {
      const fileName1 = generateFileName();
      const fileName2 = generateFileName();
      expect(fileName1).toMatch(FILENAME_PATTERN);
      expect(fileName2).toMatch(FILENAME_PATTERN);
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
    let mocks: ReturnType<typeof setupDownloadLinkMocks>;
    const testData = 'test data';
    const testFileName = 'test.png';

    beforeEach(() => {
      mocks = setupDownloadLinkMocks();
    });

    afterEach(() => {
      mocks.cleanup();
    });

    it('should create a download link', () => {
      downloadFile(testData, testFileName);

      expect(mocks.createElement).toHaveBeenCalledWith('a');
      expect(mocks.mockLink.download).toBe(testFileName);
    });

    it('should trigger click on link', () => {
      downloadFile(testData, testFileName);
      expect(mocks.mockLink.click).toHaveBeenCalled();
    });

    it('should append and remove link from document', () => {
      downloadFile(testData, testFileName);

      expect(mocks.appendChild).toHaveBeenCalledWith(mocks.mockLink);
      expect(mocks.removeChild).toHaveBeenCalledWith(mocks.mockLink);
    });

    it('should create and revoke object URL', () => {
      downloadFile(testData, testFileName);

      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(global.URL.revokeObjectURL).toHaveBeenCalled();
    });
  });
});
