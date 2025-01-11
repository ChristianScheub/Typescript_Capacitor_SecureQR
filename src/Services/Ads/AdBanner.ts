import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { Capacitor } from "@capacitor/core";

  const showBanner = async () => {
    let adId: string;
    if (Capacitor.getPlatform() === 'android') {
      adId = 'ca-app-pub-6250689577715326/8439901875';
    } else if (Capacitor.getPlatform() === 'ios') {
      adId = 'ca-app-pub-6250689577715326/5283255499';
    } else {
      adId = 'ca-app-pub-6250689577715326/8439901875';
    }

    const options: BannerAdOptions = {
      adId: adId,
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
    };
    await AdMob.showBanner(options);
  };

  export default showBanner;