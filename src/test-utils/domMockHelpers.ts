/**
 * Helper functions for mocking DOM APIs in tests
 */

export interface MockLinkElement extends Partial<HTMLAnchorElement> {
  click: jest.Mock;
}

export interface DOMTestMocks {
  mockLink: MockLinkElement;
  createElement: jest.SpyInstance;
  appendChild: jest.SpyInstance;
  removeChild: jest.SpyInstance;
  cleanup: () => void;
}

/**
 * Setup mocks for download link testing
 */
export const setupDownloadLinkMocks = (): DOMTestMocks => {
  const mockLink: MockLinkElement = {
    href: '',
    download: '',
    click: jest.fn(),
  };

  const createElement = jest.spyOn(document, 'createElement').mockReturnValue(mockLink as unknown as HTMLElement);
  const appendChild = jest.spyOn(document.body, 'appendChild').mockImplementation();
  const removeChild = jest.spyOn(document.body, 'removeChild').mockImplementation();
  
  // Mock URL methods in jsdom
  global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
  global.URL.revokeObjectURL = jest.fn();

  const cleanup = () => {
    createElement.mockRestore();
    appendChild.mockRestore();
    removeChild.mockRestore();
  };

  return { mockLink, createElement, appendChild, removeChild, cleanup };
};
