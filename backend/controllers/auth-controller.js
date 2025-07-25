import UserModel from "../models/user-model.js";
import TokenModel from "../models/token-model.js";
import { sendVerificationEmail } from "../utils/emailService.js";
import { generateAccessToken, generateRefreshToken } from './../utils/authToken.js';

export const registerUser = async (req, res, next) => {
  try {
    const { fullName, email, role, password } = req.body;

    console.log(fullName, email, role, password);

    if (!fullName || !email || !role || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    let existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email!",
      });
    }

    const user = new UserModel({
      fullName,
      email,
      password,
    });

    const verificationCode = user.generateVerificationCode();

    await user.save();

    const emailResult = await sendVerificationEmail(
      email,
      verificationCode,
      fullName
    );

    if (!emailResult.success) {
      await UserModel.findByIdAndDelete(user._id);
      return res.status(500).json({
        success: false,
        message: "Failed to send verification email. Please try again!",
      });
    }

    return res.status(201).json({
      success: true,
      userId: user._id,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Email and verification code are required!",
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User is already verified!",
      });
    }

    if (!user.verifyVerificationCode(verificationCode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code!",
      });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiry = undefined;

    await user.save();

    const token = user.generateJWT();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Email verified successfully!",
      user: {
        _id: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required!",
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified!",
      });
    }

    const verificationCode = user.generateVerificationCode();
    await user.save();

    const emailResult = await sendVerificationEmail(
      email,
      verificationCode,
      user.firstName
    );

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to send verification email. Please try again!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Verification code sent successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    if (user.isLocked()) {
      return res.status(423).json({
        success: false,
        message:
          "Account is temporarily locked due to too many failed login attempts.",
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email before logging in.",
        needsVerification: true,
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    console.log("password validation", isPasswordValid);

    if (!isPasswordValid) {
      user.loginAttempt += 1;
      if (user.loginAttempt > 5) {
        user.lockUntil = new Date(Date.now() + 30 * 60 * 1000);
      }
      await user.save();

      return res.status(400).json({
        success: false,
        message: "Invalid email or password!",
      });
    }

    user.loginAttempt = 0;
    user.lockUntil = undefined;
    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await TokenModel.create({ userId: user._id, token: refreshToken });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      accessToken,
      user: {
        _id: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshAccessTokenController = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No refresh token.",
      });
    }

    const existingToken = await TokenModel.findOne({ token });
    if (!existingToken) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    const payload = JWT.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findById(payload.id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const newAccessToken = JWT.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15d" }
    );

    return res.status(200).json({
      success: true,
      message: "Access token refreshed.",
      token: newAccessToken,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    await TokenModel.findOneAndDelete({ token: refreshToken });

    res.clearCookie("refreshToken", { httpOnly: true });
    res.clearCookie("token", { httpOnly: true }); // optional: clear access token too

    console.log("Logged out successfully!");
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
