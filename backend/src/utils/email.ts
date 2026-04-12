import nodemailer from 'nodemailer';



export const sendEmailOTP = async (email: string, otp: string) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email credentials not configured in .env. Skipping real email send.');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'CampusRide - Your Security Code',
    text: `Your CampusRide verification code is: ${otp}\n\nPlease enter this code to verify your college email.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1a365d;">Welcome to CampusRide! 🚗</h2>
        <p>Your unique verification code is:</p>
        <h1 style="font-size: 32px; letter-spacing: 5px; color: #0d9488; padding: 10px; background: #f3f4f6; border-radius: 8px; text-align: center;">
          ${otp}
        </h1>
        <p style="color: #666; font-size: 14px;">Please enter this code in the app to complete your registration. This code will expire in 10 minutes.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};
