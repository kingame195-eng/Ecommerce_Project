import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken as generateJWT, authenticateToken } from "../middleware/auth.js";
import prisma from "../prisma.js";
import { generateToken, getTokenExpiry, isTokenExpired } from "../utils/tokenUtils.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "../services/emailService.js";

const router = express.Router();

// POST /api/auth/register - User registration
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Create verification token
    //const token = generateToken(user.id);
    const verificationToken = generateToken();
    const tokenExpiry = getTokenExpiry(15);

    //   res.status(201).json({
    //     message: "User registered successfully",
    //     token,
    //     user: {
    //       id: user.id,
    //       name: user.name,
    //       email: user.email,
    //     },
    //   });
    // } catch (err) {
    //   console.error(err);
    //   res.status(500).json({ error: err.message });
    // }
    await prisma.verificationToken.create({
      data: {
        userId: user.id,
        email: user.email,
        token: verificationToken,
        type: "email_verification",
        expiresAt: tokenExpiry,
      },
    });

    //Send verification email
    await sendVerificationEmail(email, verificationToken, name);

    // Create temporary JWT token (not main access token)
    const tempToken = generateJWT(user.id);

    res.status(201).json({
      message: "User registered successfully. Please verify your email.",
      tempToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isEmailVerified: false,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/verify-email
router.post("/verify-email", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    //find verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!verificationToken) {
      return res.status(404).json({ message: "Invalid token" });
    }

    //Check expired tokens
    if (isTokenExpired(verificationToken.expiresAt)) {
      return res.status(400).json({ message: "Token has expired" });
    }

    // Check used token
    if (verificationToken.isUsed) {
      return res.status(400).json({ message: "Token already used" });
    }

    //Check the token type
    if (verificationToken.type !== "email_verification") {
      return res.status(400).json({ message: "Invalid token type" });
    }

    //Update user: isEmailVerified = true
    const user = await prisma.user.update({
      where: { id: verificationToken.userId },
      data: { isEmailVerified: true },
    });

    //Mark used tokens
    await prisma.verificationToken.update({
      where: { id: verificationToken.id },
      data: { isUsed: true },
    });

    //Generate JWT access token
    const accessToken = generateJWT(user.id);
    res.json({
      message: "Email verified successfully",
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isEmailVerified: true,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login - User login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Create token
    const token = generateJWT(user.id);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me - Get current user information
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// PUT /api/auth/profile/:id - Update user profile
router.put("/profile/:id", authenticateToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, phone, address } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(address && { address }),
      },
    });

    res.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/forgot-password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists (security)
      return res.json({
        message: "If email exists, password reset link has been sent",
      });
    }

    // Delete old tokens
    await prisma.verificationToken.deleteMany({
      where: {
        userId: user.id,
        type: "password_reset",
        isUsed: false,
      },
    });

    // Create password reset token
    const resetToken = generateToken();
    const tokenExpiry = getTokenExpiry(15);
    await prisma.verificationToken.create({
      data: {
        userId: user.id,
        email: user.email,
        token: resetToken,
        type: "password_reset",
        expiresAt: tokenExpiry,
      },
    });

    // Send email
    await sendPasswordResetEmail(email, resetToken, user.name);
    res.json({
      message: "If email exists, password reset link has been sent",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/reset-password
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and password required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Find reset token
    const resetToken = await prisma.verificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken) {
      return res.status(404).json({ message: "Invalid token" });
    }

    // Check expired token
    if (isTokenExpired(resetToken.expiresAt)) {
      return res.status(400).json({ message: "Token has expired" });
    }

    // Check used token
    if (resetToken.isUsed) {
      return res.status(400).json({ message: "Token already used" });
    }

    // Check token type
    if (resetToken.type !== "password_reset") {
      return res.status(400).json({ message: "Invalid token type" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    const user = await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });

    // Mark token as used
    await prisma.verificationToken.update({
      where: { id: resetToken.id },
      data: { isUsed: true },
    });

    res.json({
      message: "Password reset successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/resend-verification-email
router.post("/resend-verification-email", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email already verified
    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    // Delete old unused tokens
    await prisma.verificationToken.deleteMany({
      where: {
        userId: user.id,
        type: "email_verification",
        isUsed: false,
      },
    });

    // Create new verification token
    const newToken = generateToken();
    const tokenExpiry = getTokenExpiry(15);

    await prisma.verificationToken.create({
      data: {
        userId: user.id,
        email: user.email,
        token: newToken,
        type: "email_verification",
        expiresAt: tokenExpiry,
      },
    });

    // Send verification email
    await sendVerificationEmail(email, newToken, user.name);

    res.json({
      message: "Verification email has been sent",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
