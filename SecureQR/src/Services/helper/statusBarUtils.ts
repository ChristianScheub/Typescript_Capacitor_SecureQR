import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";

export const makeStatusBarTransparent = async () => {
    if (Capacitor.getPlatform() !== 'web') {
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setBackgroundColor({ color: '#3d6868' });
    }
  };