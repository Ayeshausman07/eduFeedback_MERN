const express = require('express');
const router = express.Router();
const {
  submitFeedback,
  getMyFeedbacks,
  deleteFeedback,
  getAllFeedbacks,
  respondToFeedback,
  updateFeedbackStatus,
  getTeacherFeedbacks,
  submitFeedbackImage,
  getDraftFeedbacks,
  saveFeedbackAsDraft,
  submitDraftFeedback
} = require('../controllers/feedbackController');
const upload = require('../middleware/uploadMiddleware');
const { protect, studentOnly, adminOnly, teacherOnly } = require('../middleware/authMiddleware');

// Student Routes
router.post('/submit', protect, studentOnly, submitFeedback);
router.get('/my-feedbacks', protect, studentOnly, getMyFeedbacks);
router.delete('/delete/:id', protect, studentOnly, deleteFeedback);

router.post('/submit-image', protect, studentOnly, upload.array('images', 3), submitFeedbackImage);

router.get('/drafts', protect, studentOnly, getDraftFeedbacks);
// router.put('/save-draft/:id', protect, studentOnly, saveFeedbackAsDraft);
// router.put('/submit-draft/:id', protect, studentOnly, submitDraftFeedback);

// To:
router.post('/save-draft', protect, studentOnly, upload.array('images', 3), saveFeedbackAsDraft);
router.put('/save-draft/:id', protect, studentOnly, upload.array('images', 3), saveFeedbackAsDraft);
router.put('/submit-draft/:id', protect, studentOnly, submitDraftFeedback);
// router.put('/save-draft/new', protect, studentOnly, saveFeedbackAsDraft);
// // For creating new drafts - use POST
// router.post('/save-draft', protect, studentOnly, saveFeedbackAsDraft);

// // For updating existing drafts - use PUT
// router.put('/save-draft/:id', protect, studentOnly, saveFeedbackAsDraft);


// Teacher Routes
router.get('/teacher', protect, teacherOnly, getTeacherFeedbacks);
router.put('/respond/:id', protect, teacherOnly, respondToFeedback);
// Change this route to use adminOnly (which now allows teachers)

// Admin Routes
router.get('/all', protect, adminOnly, getAllFeedbacks);
router.put('/status/:id', protect, adminOnly, updateFeedbackStatus);

module.exports = router;