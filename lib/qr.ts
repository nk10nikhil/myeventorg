import QRCode from "qrcode";
import { randomBytes } from "crypto";

export const generateQRId = (): string => {
  return randomBytes(16).toString("hex");
};

export const generateQRCode = async (data: string): Promise<string> => {
  try {
    const qrDataURL = await QRCode.toDataURL(data, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 400,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
    return qrDataURL;
  } catch (error) {
    throw new Error("Failed to generate QR code");
  }
};

export const validateQRExpiry = (
  qrValidityStart?: Date,
  qrValidityEnd?: Date,
): boolean => {
  if (!qrValidityStart || !qrValidityEnd) return true;

  const now = new Date();
  return now >= qrValidityStart && now <= qrValidityEnd;
};
