import React from "react";
import { QRScanner } from "../UIComponets/QRScanner";
import Card from "../UIComponets/Card/Card";
import MaterialDropdown from "../UIComponets/MaterialDropdown";
import { EncryptionMethod } from "../types/EncryptionMethod.types";
import Button from "react-bootstrap/Button";
import { useTranslation } from "react-i18next";

interface QRReaderViewProps {
  scannedText: string | null;
  decryptedText: string | null;
  encryptionMethod: EncryptionMethod;
  onScan: (data: string | null) => void;
  onNewScan: () => void;
  onEncryptionMethodChange: (method: EncryptionMethod) => void;
}

export const QRReaderView: React.FC<QRReaderViewProps> = ({
  scannedText,
  decryptedText,
  encryptionMethod,
  onScan,
  onNewScan,
  onEncryptionMethodChange,
}) => {
  const encryptionOptions = Object.values(EncryptionMethod).map((method) => ({
    label: method,
    value: method,
  }));
  const { t } = useTranslation();

  return (
    <div className="fillScreen">
      <Card>
        <h2> {t("readerView_Titel")} </h2>
        <MaterialDropdown
          label={t("readerView_EncryptionOptionsMethods")}
          options={encryptionOptions}
          selectedValue={encryptionMethod}
          onChange={onEncryptionMethodChange}
        />
        <br />
        {!scannedText && !decryptedText && <QRScanner onScan={onScan} />}

        {(scannedText || decryptedText) && (
          <div>
            {scannedText && (
              <div className="scrollable-text">
                <h3>{t("readerView_EncryptedText")}</h3>
                <p>{scannedText}</p>
              </div>
            )}
            {decryptedText && (
              <div className="scrollable-text">
                <h3>{t("readerView_DecryptedText")}</h3>
                <p>{decryptedText}</p>
              </div>
            )}
            <Button
              className="password-submit-btn width100"
              onClick={onNewScan}
            >
              {t("readerView_ButtonNewScan")}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};
