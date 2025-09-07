// controllers/adminController.js
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Get all teachers
// @route   GET /api/admin/teachers
// @access  Private/Admin
exports.getTeachers = asyncHandler(async (req, res) => {
  const teachers = await User.find({ role: 'teacher' }).select('-password');
  res.json(teachers);
});

// @desc    Update teacher
// @route   PUT /api/admin/teachers/:id
// @access  Private/Admin
exports.updateTeacher = asyncHandler(async (req, res) => {
  const teacher = await User.findById(req.params.id);

  if (!teacher || teacher.role !== 'teacher') {
    res.status(404);
    throw new Error('Teacher not found');
  }

  teacher.name = req.body.name || teacher.name;
  teacher.email = req.body.email || teacher.email;
  teacher.isBlocked = req.body.isBlocked !== undefined ? req.body.isBlocked : teacher.isBlocked;

  const updatedTeacher = await teacher.save();

  res.json({
    _id: updatedTeacher._id,
    name: updatedTeacher.name,
    email: updatedTeacher.email,
    role: updatedTeacher.role,
    isBlocked: updatedTeacher.isBlocked
  });
});

// Get teachers for teacher view (limited information)
exports.getTeachersForTeacherView = asyncHandler(async (req, res) => {
  const teachers = await User.find({ role: 'teacher' })
    .select('name email isBlocked');
  res.json(teachers);
});

// @desc    Delete teacher
// @route   DELETE /api/admin/teachers/:id
// @access  Private/Admin
exports.deleteTeacher = asyncHandler(async (req, res) => {
  const teacher = await User.findById(req.params.id);

  if (!teacher || teacher.role !== 'teacher') {
    res.status(404);
    throw new Error('Teacher not found');
  }

  await teacher.remove();
  res.json({ message: 'Teacher removed' });
});