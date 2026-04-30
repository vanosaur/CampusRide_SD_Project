import nodemailer from 'nodemailer';



export const sendEmailOTP = async (email: string, otp: string) => {
  // ALWAYS log the OTP to the console so the developer can see it in Render logs
  console.log(`[AUTH] Generating Security Code for ${email}: ${otp}`);

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    const errorMsg = 'CRITICAL: Email credentials (EMAIL_USER/EMAIL_PASS) are missing. OTP was logged to console instead.';
    console.error(errorMsg);
    
    // In production, we should know if we've failed to configure this
    if (process.env.NODE_ENV === 'production') {
      throw new Error(errorMsg);
    }
    return;
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"CampusRide Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `${otp} is your CampusRide verification code`,
    text: `Your CampusRide verification code is: ${otp}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #0d9488; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">CampusRide Verification</h1>
        </div>
        <div style="padding: 30px; text-align: center; color: #1e293b;">
          <p style="font-size: 16px;">Hello! Use the following security code to verify your account:</p>
          <div style="margin: 25px 0; padding: 15px; background-color: #f1f5f9; border-radius: 8px; display: inline-block;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #0d9488;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #64748b;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[AUTH] Verification email sent successfully to ${email}`);
  } catch (error: any) {
    console.error(`[AUTH] Failed to send email to ${email}:`, error.message);
    throw new Error(`Email delivery failed: ${error.message}`);
  }
};
