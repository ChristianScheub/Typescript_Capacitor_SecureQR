import { makeStatusBarTransparent } from './statusBarUtils';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

jest.mock('@capacitor/core');
jest.mock('@capacitor/status-bar');

describe('statusBarUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('makeStatusBarTransparent', () => {
    it('should set status bar style and color on native platform', async () => {
      (Capacitor.getPlatform as jest.Mock).mockReturnValue('android');

      await makeStatusBarTransparent();

      expect(StatusBar.setStyle).toHaveBeenCalledWith({ style: Style.Light });
      expect(StatusBar.setBackgroundColor).toHaveBeenCalledWith({ color: '#3d6868' });
    });

    it('should not set status bar on web platform', async () => {
      (Capacitor.getPlatform as jest.Mock).mockReturnValue('web');

      await makeStatusBarTransparent();

      expect(StatusBar.setStyle).not.toHaveBeenCalled();
      expect(StatusBar.setBackgroundColor).not.toHaveBeenCalled();
    });

    it('should work on iOS platform', async () => {
      (Capacitor.getPlatform as jest.Mock).mockReturnValue('ios');

      await makeStatusBarTransparent();

      expect(StatusBar.setStyle).toHaveBeenCalledWith({ style: Style.Light });
      expect(StatusBar.setBackgroundColor).toHaveBeenCalledWith({ color: '#3d6868' });
    });
  });
});
