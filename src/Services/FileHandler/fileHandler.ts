import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { downloadFile, generateFileName } from "./fileHandlerHelper";
import Logger from "../Logger/logger";

export const handleImageDownload = async (qrCode: string) => {
  try {
    const base64String = qrCode.split(",")[1];
    const fileName = generateFileName();

    await Filesystem.writeFile({
      path: fileName,
      data: base64String,
      directory: Directory.Documents,
    });

    const uriResult = await Filesystem.getUri({
      directory: Directory.Documents,
      path: fileName,
    });

    await Share.share({
      url: uriResult.uri,
    });
  } catch (error) {
    if (qrCode) {
      downloadFile(qrCode, generateFileName());
    }
    Logger.error("Error exporting QR Code:" + error);
  }
};
