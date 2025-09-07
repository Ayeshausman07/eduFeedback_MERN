const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  forgotPassword,
  resetPassword,
  toggleBlockUser,
getAllTeachers,
updateUser,
uploadProfileImage
 
    
} = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);


// Protected route
// authRoutes.js
// router.put('/toggle-block/:userId', protect, adminOnly, toggleBlockUser);
router.put('/users/:userId', protect, adminOnly, updateUser);
router.get('/users', protect, adminOnly, getAllUsers);
router.put('/toggle-block/:userId', protect, adminOnly, toggleBlockUser);
router.get('/teachers', getAllTeachers);


router.post('/upload-profile', protect, upload.single('image'), uploadProfileImage);

module.exports = router;