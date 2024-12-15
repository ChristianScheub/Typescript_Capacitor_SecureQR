import React, { useState } from "react";
import { QRReaderView } from "../Views/QRReaderView";
import { encryptionService } from "../Services/EncryptionService/encryptionService";
import { EncryptionMethod } from "../types/EncryptionMethod.types";
import { useTranslation } from "react-i18next";
import Logger from "../Services/Logger/logger";

export const QRReaderContainer: React.FC = () => {
  const [scannedText, setScannedText] = useState<string | null>(null);
  const [decryptedText, setDecryptedText] = useState<string | null>(null);
  const [encryptionMethod, setEncryptionMethod] = useState<EncryptionMethod>(
    EncryptionMethod.AES256
  );
  const { t } = useTranslation();

  const handleScan = (data: string | null) => {
    setScannedText(data);
    if (data) {
      const password = prompt(t("readerContainer_ScanPasswordPrompt"));
      if (!password) {
        alert(t("readerContainer_noPasswortEntered"));
        return;
      }

      try {
        const service = encryptionService.getService(encryptionMethod);
        const decrypted = service.decrypt(data, password);
        setDecryptedText(decrypted);
      } catch (error) {
        Logger.error("Decryption Error:" + error);
        alert(t("popup_error"));
      }
    }
  };

  const handleNewScan = () => {
    setScannedText(null);
    setDecryptedText(null);
  };

  return (
    <QRReaderView
      scannedText={scannedText}
      decryptedText={decryptedText}
      encryptionMethod={encryptionMethod}
      onScan={handleScan}
      onNewScan={handleNewScan}
      onEncryptionMethodChange={setEncryptionMethod}
    />
  );
};