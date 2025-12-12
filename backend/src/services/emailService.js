import nodemailer from "nodemailer";
import dotenv from "dotenv";
import process from "process";

dotenv.config();

// Check if we're in development mode (no email password = dev mode)
const isDevelopmentMode = !process.env.EMAIL_PASSWORD || process.env.EMAIL_PASSWORD === "dev";

//transporter - only create if we have real credentials
let transporter = null;

if (!isDevelopmentMode) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: process.env.EMAIL_PORT || 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

export const verifyEmailConnection = async () => {
  if (isDevelopmentMode) {
    console.log("📧 Email service running in DEVELOPMENT MODE");
    console.log("   → Emails will be logged to console instead of sent");
    console.log("   → Set EMAIL_PASSWORD in .env to enable real emails");
    return;
  }

  try {
    await transporter.verify();
    console.log("✅ Email service connected successfully");
  } catch (err) {
    console.error("❌ Email service error:", err.message);
    console.log("📧 Falling back to DEVELOPMENT MODE (console logging)");
  }
};

//Send verification email
/**
 * @param {string} email
 * @param {string} token
 * @param {string} userName
 */
export const sendVerificationEmail = async (email, token, userName) => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to MyShop, ${userName}!</h2>
      <p>Thank you for registering. Please verify your email to activate your account.</p>
      
      <a href="${verificationLink}" style="
        display: inline-block;
        padding: 12px 30px;
        background-color: #007bff;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        margin: 20px 0;
      ">Verify Email</a>

      <p>Or copy this link:</p>
      <p>${verificationLink}</p>

      <p style="color: #666; font-size: 12px;">
        This link expires in 15 minutes.
      </p>
    </div>
  `;

  // Development mode - log to console
  if (isDevelopmentMode || !transporter) {
    console.log("\n" + "=".repeat(60));
    console.log("📧 VERIFICATION EMAIL (Dev Mode)");
    console.log("=".repeat(60));
    console.log(`To: ${email}`);
    console.log(`Subject: Verify Your MyShop Account`);
    console.log(`\n🔗 Verification Link:\n${verificationLink}\n`);
    console.log("=".repeat(60) + "\n");
    return true;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your MyShop Account",
      html: htmlContent,
    });
    console.log(`✅ Verification email sent to ${email}`);
    return true;
  } catch (err) {
    console.error("❌ Failed to send verification email:", err);
    return false;
  }
};

//Send password reset email
/**
 * @param {string} email
 * @param {string} token
 * @param {string} userName
 */
export const sendPasswordResetEmail = async (email, token, userName) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Reset Your Password</h2>
      <p>Hi ${userName},</p>
      <p>We received a request to reset your password. Click the button below to proceed.</p>
      
      <a href="${resetLink}" style="
        display: inline-block;
        padding: 12px 30px;
        background-color: #28a745;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        margin: 20px 0;
      ">Reset Password</a>

      <p>Or copy this link:</p>
      <p>${resetLink}</p>

      <p style="color: #666; font-size: 12px;">
        This link expires in 15 minutes. If you didn't request this, ignore this email.
      </p>
    </div>
  `;

  // Development mode - log to console
  if (isDevelopmentMode || !transporter) {
    console.log("\n" + "=".repeat(60));
    console.log("📧 PASSWORD RESET EMAIL (Dev Mode)");
    console.log("=".repeat(60));
    console.log(`To: ${email}`);
    console.log(`Subject: Reset Your MyShop Password`);
    console.log(`\n🔗 Reset Link:\n${resetLink}\n`);
    console.log("=".repeat(60) + "\n");
    return true;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Your MyShop Password",
      html: htmlContent,
    });
    console.log(`✅ Password reset email sent to ${email}`);
    return true;
  } catch (err) {
    console.error("❌ Failed to send password reset email:", err);
    return false;
  }
};
