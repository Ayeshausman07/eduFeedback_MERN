const express = require('express');
const router = express.Router();
const { protect, adminPanelAccess, adminOnly } = require('../middleware/authMiddleware');
const {
  getTeachers,
  updateTeacher,
  deleteTeacher,
  getTeachersForTeacherView // Add this new controller
} = require('../controllers/adminController');

// Accessible by both admin and teacher
router.get('/teachers', protect, adminPanelAccess, (req, res, next) => {
  if (req.user.role === 'teacher') {
    return getTeachersForTeacherView(req, res, next);
  }
  return getTeachers(req, res, next);
});

router.route('/teachers')
  .get(protect, adminOnly, getTeachers);

// Strict admin-only routes
router.route('/teachers/:id')
  .put(protect, adminOnly, updateTeacher)
  .delete(protect, adminOnly, deleteTeacher);

module.exports = router;