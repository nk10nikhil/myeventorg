import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendTicketEmail = async (
  to: string,
  userName: string,
  eventName: string,
  qrCode: string,
  ticketId: string,
) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `Your Ticket for ${eventName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .qr-container { text-align: center; margin: 30px 0; background: white; padding: 20px; border-radius: 10px; }
          .qr-code { max-width: 300px; height: auto; }
          .ticket-info { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; }
          .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎫 Your Event Ticket</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName}!</h2>
            <p>Thank you for registering for <strong>${eventName}</strong>. Your payment has been confirmed!</p>
            
            <div class="qr-container">
              <h3>Your QR Code</h3>
              <img src="${qrCode}" alt="QR Code" class="qr-code" />
              <p style="margin-top: 15px; color: #666; font-size: 14px;">
                Present this QR code at the venue for entry
              </p>
            </div>

            <div class="ticket-info">
              <div class="info-row">
                <span><strong>Event:</strong></span>
                <span>${eventName}</span>
              </div>
              <div class="info-row">
                <span><strong>Ticket ID:</strong></span>
                <span>${ticketId}</span>
              </div>
              <div class="info-row">
                <span><strong>Name:</strong></span>
                <span>${userName}</span>
              </div>
            </div>

            <p style="margin-top: 20px;">
              <strong>Important:</strong>
              <ul>
                <li>Save this email or download your ticket from the dashboard</li>
                <li>Each QR code can only be used once</li>
                <li>Ensure your QR code is clearly visible when scanning</li>
              </ul>
            </p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
            <p>&copy; ${new Date().getFullYear()} Event Ticketing System. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendOTPEmail = async (to: string, otp: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Your OTP for Admin Login",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .otp-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; border-radius: 10px; margin: 20px 0; }
          .otp-code { font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Admin Login OTP</h2>
          <p>Your One-Time Password (OTP) for admin login is:</p>
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
            <p style="margin: 0; font-size: 14px;">Valid for 10 minutes</p>
          </div>
          <p><strong>Security Notice:</strong> Never share this OTP with anyone. Our team will never ask for your OTP.</p>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};
