const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');
const { sendEmail, getPasswordResetEmail } = require('../utils/sendEmail');

// ===========================
// ✅ Register User
// ===========================
exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please fill all fields');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(res, user._id);

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage,
    token,
  });
});

// ===========================
// ✅ Login User
// ===========================
// ✅ Login User (with block check)
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide both email and password");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  // ✅ Block check
  if (user.isBlocked) {
    res.status(403);
    throw new Error("Your account has been blocked by admin");
  }

  const token = generateToken(res, user._id);

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage,
    token,
  });
});


// ===========================
// ✅ Logout User
// ===========================
exports.logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

// ===========================
// ✅ Get All Users (Admin)
// ===========================
// exports.getAllUsers = asyncHandler(async (req, res) => {
//   const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
//   res.json(users);
// });
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password"); // includes admin
  res.json(users);
});

// authController.js
exports.toggleBlockUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.isBlocked = !user.isBlocked;
  await user.save();
  
  res.json({ 
    message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
    isBlocked: user.isBlocked
  });
});

// authController.js
exports.updateUser = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const user = await User.findById(req.params.userId);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = name || user.name;
  user.email = email || user.email;
  
  const updatedUser = await user.save();
  
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    isBlocked: updatedUser.isBlocked
  });
});


// ===========================
// ✅ Forgot Password
// ===========================
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error('No user found with this email');
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const emailHTML = getPasswordResetEmail(resetURL);

  try {
    await sendEmail(user.email, 'Reset Your Password', emailHTML);
    res.json({ message: 'Reset link sent to your email' });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500);
    throw new Error('Failed to send reset email');
  }
});

// ✅ Toggle Block/Unblock User (Admin Only)
exports.toggleBlockUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.isBlocked = !user.isBlocked;
  await user.save();

  res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, isBlocked: user.isBlocked });
});

// Get all users with role 'teacher'
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' }).select('-password');
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching teachers' });
  }
};

// ===========================
// ✅ Reset Password
// ===========================
exports.resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Reset token is invalid or has expired');
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({ message: 'Password updated successfully' });
});


// POST /api/auth/upload-profile
exports.uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage: req.file.path }, // Cloudinary URL
      { new: true }
    ).select('-password'); // Exclude password from returned user

    res.status(200).json({
      message: 'Profile image updated',
      profileImage: updatedUser.profileImage,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error uploading image' });
  }
};