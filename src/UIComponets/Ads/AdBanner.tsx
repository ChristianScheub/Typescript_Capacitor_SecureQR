import React, { useEffect } from "react";
import { AdMob, BannerAdOptions, AdmobConsentStatus, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { Capacitor } from "@capacitor/core";
import Logger from "../../Services/Logger/logger";

export const AdBanner: React.FC = () => {
  
  const initializeAds = async () => {
    if (Capacitor.isNativePlatform()) {
      await AdMob.initialize();

      const [trackingInfo, consentInfo] = await Promise.all([
        AdMob.trackingAuthorizationStatus(),
        AdMob.requestConsentInfo(),
      ]);

      if (trackingInfo.status === 'notDetermined') {
        await AdMob.requestTrackingAuthorization();
      }

      const authorizationStatus = await AdMob.trackingAuthorizationStatus();
      if (
        authorizationStatus.status === 'authorized' &&
        consentInfo.isConsentFormAvailable &&
        consentInfo.status === AdmobConsentStatus.REQUIRED
      ) {
        await AdMob.showConsentForm();
      }
    }
  };

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
      margin: 0
    };
    await AdMob.showBanner(options);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      initializeAds().catch(err => Logger.error("Error initializing ads:"+ err));
      showBanner().catch(err => Logger.error("Error showing banner:"+ err));
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return null;
};