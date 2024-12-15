import React from "react";
import Card from "../UIComponets/Card/Card";
import MaterialInput from "../UIComponets/MaterialInput";
import { useTranslation } from "react-i18next";
import MaterialDropdown from "../UIComponets/MaterialDropdown";
import Button from "react-bootstrap/Button";
import { EncryptionMethod } from "../types/EncryptionMethod.types";

interface QRGeneratorViewProps {
  text: string;
  password: string;
  encryptionMethod: EncryptionMethod;
  qrCode: string | null;
  onTextChange: (text: string) => void;
  onPasswordChange: (password: string) => void;
  onEncryptionMethodChange: (method: EncryptionMethod) => void;
  onGenerateQRCode: () => void;
  onDownloadQRCode: () => void;
}

export const QRGeneratorView: React.FC<QRGeneratorViewProps> = ({
  text,
  password,
  encryptionMethod,
  qrCode,
  onTextChange,
  onPasswordChange,
  onEncryptionMethodChange,
  onGenerateQRCode,
  onDownloadQRCode,
}) => {
  const { t } = useTranslation();

  const encryptionOptions = Object.values(EncryptionMethod).map((method) => ({
    label: method,
    value: method,
  }));

  return (
    <div className="fillScreen">
      <Card>
        <h3>{t("generatorView_TitleGenerateQrCode")}</h3>
        <div>
          <MaterialInput
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            type="text"
            label={t("generatorView_textToEncryptField")}
            helperText={t("generatorView_textToEncryptFieldHelper")}
          />
        </div>
        <div>
          <MaterialInput
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            type="text"
            label={t("generatorView_PasswordToEncryptField")}
            helperText={t("generatorView_PasswordToEncryptFieldHelper")}
          />
        </div>
        <div>
          <MaterialDropdown
            label={t("generatorView_EncryptionOptionsMethods")}
            options={encryptionOptions}
            selectedValue={encryptionMethod}
            onChange={onEncryptionMethodChange}
          />
        </div>
        <br />
        <Button
          className="password-submit-btn width100"
          onClick={onGenerateQRCode}
        >
          {t("generatorView_ButtonGenerateQrCode")}
        </Button>
      </Card>

      {qrCode && (
        <Card>
          <h3>{t("generatorView_TitleGeneratedQR")}</h3>
          <img src={qrCode} alt="Generated QR Code" width={"100%"} />
          <br />
          <Button
            className="password-submit-btn width100"
            onClick={onDownloadQRCode}
          >
            {t("generatorView_DownloadGeneratedQR")}
          </Button>
        </Card>
      )}
    </div>
  );
};