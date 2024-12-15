import { AdMob, AdOptions } from "@capacitor-community/admob";
import { Capacitor } from "@capacitor/core";
import Logger from "../Logger/logger";

const showAdInterstitial = async () => {
  try {
    Logger.info("Start Interstitial Ad");
    let adId: string;
      if (Capacitor.getPlatform() === "android") {
        adId = "ca-app-pub-6250689577715326/6053411682";
      } else if (Capacitor.getPlatform() === "ios") {
        adId = "ca-app-pub-6250689577715326/2563290057";
      } else {
        adId = "ca-app-pub-6250689577715326/6053411682";
      }

    const options: AdOptions = {
      adId: adId,
      isTesting: true
    };

    await AdMob.prepareInterstitial(options);
    await AdMob.showInterstitial();
  } catch (error) {
    Logger.error("Error while loading Interstitial ad: " + error);
  }
};

export default showAdInterstitial;