import React, { useState } from "react";
import { QRGeneratorView } from "../Views/QRGeneratorView";
import { encryptionService } from "../Services/EncryptionService/encryptionService";
import QRCode from "qrcode";
import { EncryptionMethod } from "../types/EncryptionMethod.types";
import { useTranslation } from "react-i18next";
import Logger from "../Services/Logger/logger";
import { AdMob, AdOptions } from "@capacitor-community/admob";
import { handleImageDownload } from "../Services/FileHandler/fileHandler";
import { Capacitor } from "@capacitor/core";

export const QRGeneratorContainer: React.FC = () => {
  const [text, setText] = useState("");
  const [password, setPassword] = useState("");
  const [encryptionMethod, setEncryptionMethod] = useState<EncryptionMethod>(
    EncryptionMethod.AES256
  );
  const [qrCode, setQrCode] = useState<string | null>(null);
  const { t } = useTranslation();

  const generateQRCode = async () => {
    if (!text || !password) {
      alert(t("generatorContainer_PopupNoTextPassword"));
      return;
    }
    try {
      const encryptionServiceInstance =
        encryptionService.getService(encryptionMethod);
      const encryptedData = encryptionServiceInstance.encrypt(text, password);
      const qr = await QRCode.toDataURL(encryptedData);
      setQrCode(qr);
      showAdBanner();
    } catch (error) {
      Logger.error("Error generating QR Code: " + error);
      alert(t("popup_error"));
    }
  };

  const showAdBanner = async () => {
    try {
      let adId: string;
      if (Capacitor.getPlatform() === "android") {
        adId = "ca-app-pub-6250689577715326/6053411682";
      } else if (Capacitor.getPlatform() === "ios") {
        adId = "ca-app-pub-6250689577715326/2563290057";
      } else {
        adId = "ca-app-pub-6250689577715326/6053411682";
      }

      const options: AdOptions = {
        adId: adId
      };

      await AdMob.prepareInterstitial(options);
      await AdMob.showInterstitial();
    } catch (error) {
      Logger.error("Fehler beim Anzeigen des Banners: " + error);
    }
  };

  const downloadQRCode = () => {
    if (qrCode) {
      handleImageDownload(qrCode);
    } else {
      Logger.warn("No QR code to download");
      alert(t("generatorContainer_NoQrCodeDownload"));
    }
  };

  return (
      <QRGeneratorView
        text={text}
        password={password}
        encryptionMethod={encryptionMethod}
        qrCode={qrCode}
        onTextChange={setText}
        onPasswordChange={setPassword}
        onEncryptionMethodChange={setEncryptionMethod}
        onGenerateQRCode={generateQRCode}
        onDownloadQRCode={downloadQRCode}
      />
  );
};
