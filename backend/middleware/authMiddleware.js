const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  } 
  else if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      res.status(401);
      throw new Error('User not found');
    }
    
    if (user.isBlocked) {
      res.status(403);
      throw new Error('Account blocked. Contact administrator.');
    }
    
    req.user = user;
    next();
  } catch (err) {
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

// Updated role-specific middlewares
exports.studentOnly = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user.role !== 'student') {
    res.status(403);
    throw new Error('Student access only');
  }
  next();
});

exports.teacherOnly = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user.role !== 'teacher') {
    res.status(403);
    throw new Error('Teacher access only');
  }
  next();
});
// Change the adminOnly middleware to allow both admin and teacher
exports.adminOnly = asyncHandler(async (req, res, next) => {
  if (!req.user || !['admin', 'teacher'].includes(req.user.role)) {
    res.status(403);
    throw new Error('Admin/Teacher access only');
  }
  next();
});


// Add this new strictAdminOnly middleware for truly admin-only routes
exports.strictAdminOnly = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Admin access only');
  }
  next();
});

// New middleware for admin panel access (both admin and teacher)
exports.adminPanelAccess = asyncHandler(async (req, res, next) => {
  if (!req.user || !['admin', 'teacher'].includes(req.user.role)) {
    res.status(403);
    throw new Error('Admin panel access denied');
  }
  next();
});