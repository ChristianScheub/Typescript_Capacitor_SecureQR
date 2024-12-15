import { useEffect } from "react";
import initializeAds from "./AdConsentForm";
import showBanner from "./AdBanner";
import Logger from "../Logger/logger";

export const AdManager: React.FC = () => {
  useEffect(() => {
    const timer = setTimeout(async () => {
      await initializeAds().catch((err) =>
        Logger.error("Error initializing ads:" + err)
      );
      await showBanner().catch((err) =>
        Logger.error("Error showing banner:" + err)
      );
      return () => clearTimeout(timer);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return null;
};