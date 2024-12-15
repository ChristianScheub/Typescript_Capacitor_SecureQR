import { AdMob, AdmobConsentStatus } from "@capacitor-community/admob";
import { Capacitor } from "@capacitor/core";

export const initializeAds = async () => {
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

export default initializeAds;