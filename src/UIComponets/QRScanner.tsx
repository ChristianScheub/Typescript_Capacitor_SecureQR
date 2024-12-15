import React, { useEffect, useRef } from 'react';
import QrScanner from 'qr-scanner';
import Logger from '../Services/Logger/logger';

interface QRScannerProps {
  onScan: (data: string | null) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<any>(null);

  useEffect(() => {
    if (videoRef.current) {
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result: string) => {
          Logger.info('QR Code detected:'+ result);
          onScan(result);
        }
      );

      qrScannerRef.current.start().catch((error: any) =>
        Logger.error('Error starting QR scanner:'+ error)
      );
    }

    return () => {
      qrScannerRef.current?.destroy();
    };
  }, [onScan]);

  return <video ref={videoRef} style={{ width: '100%', height: 'auto', paddingTop: '5vh' }} />;
};
