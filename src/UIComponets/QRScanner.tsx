import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import Logger from "../Services/Logger/logger";
import { useTranslation } from "react-i18next";

interface QRScannerProps {
  onScan: (data: string | null) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<any>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result: string) => {
          Logger.info("QR Code detected: " + result);
          onScan(result);
        }
      );

      qrScannerRef.current
        .start()
        .then(() => {
          Logger.info("Camera ready.");
          setIsCameraReady(true);
        })
        .catch((error: any) => {
          Logger.error("Error starting QR scanner: " + error);
          setIsCameraReady(false);
        });
    }

    return () => {
      qrScannerRef.current?.destroy();
    };
  }, [onScan]);
  const { t } = useTranslation();
  

  return (
    <>
      <div style={{ display: isCameraReady ? "block" : "none" }}>
        <video
          ref={videoRef}
          style={{ width: "100%", height: "auto", paddingTop: "5vh" }}
        />
      </div>
      <p style={{ display: isCameraReady ? "none" : "block" }}>
        {t("qrScanner_waitingCamera")}
      </p>
    </>
  );
};
