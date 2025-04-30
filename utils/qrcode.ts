import QRCode from "qrcode"

export async function generateQRCode(data: string): Promise<string> {
  try {
    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(data, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 300,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    })

    return qrCodeDataUrl
  } catch (error) {
    console.error("QR code generation error:", error)
    throw new Error("Failed to generate QR code")
  }
}
