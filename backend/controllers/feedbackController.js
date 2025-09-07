const Feedback = require('../models/Feedback');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// POST: /api/feedback/submit
const submitFeedback = asyncHandler(async (req, res) => {
  console.log('Received feedback data:', req.body);
  console.log('User ID:', req.user._id);
  
  const { subject, teacher, feedbackText, rating, isAnonymous, category } = req.body;

  // Validate required fields
  if (!subject || !teacher || !feedbackText || !rating) {
    console.log('Missing required fields:', { subject, teacher, feedbackText, rating });
    return res.status(400).json({ 
      message: 'Missing required fields',
      required: ['subject', 'teacher', 'feedbackText', 'rating']
    });
  }

  try {
    const newFeedback = new Feedback({
      student: req.user._id,
      subject,
      teacher,
      feedbackText,
      rating,
      isAnonymous: isAnonymous || false,
      category: category || 'Other',
      isDraft: false, // Explicitly set to false for published feedback
      status: 'Pending' // Set status for published feedback
    });

    await newFeedback.save();
    console.log('Feedback saved successfully:', newFeedback);
    res.status(201).json({ message: 'Feedback submitted successfully.' });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ message: 'Error submitting feedback', error: error.message });
  }
});

// GET: /api/feedback/my-feedbacks
// GET: /api/feedback/my-feedbacks
// GET: /api/feedback/my-feedbacks
const getMyFeedbacks = asyncHandler(async (req, res) => {
  // Only get non-draft feedbacks
  const feedbacks = await Feedback.find({ 
    student: req.user._id,
    isDraft: false // Add this filter
  })
  .populate('teacher', 'name')
  .sort({ createdAt: -1 }); // Sort by newest first
  
  res.status(200).json(feedbacks);
});
// DELETE: /api/feedback/delete/:id
// const deleteFeedback = asyncHandler(async (req, res) => {
//   const feedback = await Feedback.findOne({ 
//     _id: req.params.id, 
//     student: req.user._id 
//   });

//   if (!feedback) {
//     return res.status(404).json({ message: 'Feedback not found' });
//   }

//   await feedback.remove();
//   res.status(200).json({ message: 'Feedback deleted successfully' });
// });
const deleteFeedback = asyncHandler(async (req, res) => {
  try {
    console.log('Deleting feedback/draft with ID:', req.params.id);
    console.log('User ID:', req.user._id);

    const feedback = await Feedback.findOne({ 
      _id: req.params.id, 
      student: req.user._id 
    });

    if (!feedback) {
      console.log('Feedback not found or user not authorized');
      return res.status(404).json({ 
        success: false,
        message: 'Feedback not found or you are not authorized to delete it' 
      });
    }

    // Optional: Delete associated images from storage
    // You might want to implement this if you're storing images on disk

    await Feedback.findByIdAndDelete(req.params.id);
    
    console.log('Successfully deleted:', req.params.id);
    res.status(200).json({ 
      success: true,
      message: 'Feedback deleted successfully' 
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error deleting feedback',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});
// GET: /api/feedback/drafts
// const getDraftFeedbacks = asyncHandler(async (req, res) => {
//   const drafts = await Feedback.find({ 
//     student: req.user._id,
//     isDraft: true 
//   }).populate('teacher', 'name');
//   res.status(200).json(drafts);
// });
// GET: /api/feedback/drafts
const getDraftFeedbacks = asyncHandler(async (req, res) => {
  try {
    const drafts = await Feedback.find({ 
      student: req.user._id,
      isDraft: true // Only get drafts
    })
    .populate('teacher', 'name email')
    .populate('student', 'name email')
    .sort({ createdAt: -1 });

    res.status(200).json(drafts);
  } catch (error) {
    console.error('Error fetching drafts:', error);
    res.status(500).json({ message: 'Error fetching drafts' });
  }
});

// PUT: /api/feedback/save-draft/:id
const saveFeedbackAsDraft = asyncHandler(async (req, res) => {
  console.log('Saving draft with data:', req.body);
  console.log('Files:', req.files);

  const { subject, teacher, feedbackText, rating, isAnonymous, category } = req.body;

  // Handle image uploads if they exist
  const imagePaths = req.files?.map(file => file.path) || [];

  const draftData = {
    student: req.user._id,
    subject,
    teacher,
    feedbackText,
    rating,
    isAnonymous: isAnonymous || false,
    category: category || 'Other',
    isDraft: true, // Explicitly set to true for drafts
    images: imagePaths,
    status: 'Draft' // This is now valid
  };

  try {
    let feedback;
    
    // Check if we're updating an existing draft or creating a new one
    if (req.params.id && req.params.id !== 'new') {
      feedback = await Feedback.findOneAndUpdate(
        { 
          _id: req.params.id, 
          student: req.user._id
        }, 
        draftData, 
        { new: true, upsert: false }
      ).populate('teacher', 'name');
      
      if (!feedback) {
        return res.status(404).json({ message: 'Draft not found' });
      }
    } else {
      // Create new draft
      feedback = await Feedback.create(draftData);
      feedback = await Feedback.findById(feedback._id)
        .populate('teacher', 'name')
        .populate('student', 'name email');
    }

    res.status(200).json({
      message: 'Feedback saved as draft',
      feedback
    });
  } catch (error) {
    console.error('Error saving draft:', error);
    res.status(500).json({ message: 'Error saving draft', error: error.message });
  }
});


// PUT: /api/feedback/submit-draft/:id

// PUT: /api/feedback/submit-draft/:id
const submitDraftFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findById(req.params.id);
  
  if (!feedback || feedback.student.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error('Draft not found');
  }

  // Convert draft to published feedback
  feedback.isDraft = false;
  feedback.status = 'Pending'; // Change status from Draft to Pending
  await feedback.save();

  res.status(200).json({
    message: 'Draft submitted successfully',
    feedback
  });
});


// GET: /api/feedback/all (Admin/Teacher)
// GET: /api/feedback/all (Admin/Teacher)
const getAllFeedbacks = asyncHandler(async (req, res) => {
  const { subject, studentName, status } = req.query;
  const filter = { isDraft: false }; // Only show non-draft feedbacks

  if (subject) filter.subject = subject;
  if (status && status !== 'Draft') filter.status = status; // Don't allow filtering by Draft status

  const feedbacks = await Feedback.find(filter)
    .populate('student', 'name')
    .populate('teacher', 'name')
    .sort({ createdAt: -1 });

  const filtered = studentName
    ? feedbacks.filter(f => 
        f.student?.name?.toLowerCase().includes(studentName.toLowerCase()))
    : feedbacks;

  res.status(200).json(filtered);
});


// PUT: /api/feedback/respond/:id
const respondToFeedback = asyncHandler(async (req, res) => {
  const { reply } = req.body;

  if (!reply?.trim()) {
    return res.status(400).json({ 
      success: false,
      message: 'Please provide a valid reply message' 
    });
  }

  const feedback = await Feedback.findById(req.params.id);
  if (!feedback) {
    return res.status(404).json({ 
      success: false,
      message: 'Feedback not found' 
    });
  }

  feedback.reply = reply.trim();
  feedback.status = 'Responded';
  feedback.respondedAt = Date.now();
  
  const updatedFeedback = await feedback.save();
  const populated = await Feedback.findById(updatedFeedback._id)
    .populate('student', 'name email')
    .populate('teacher', 'name email');

  res.status(200).json({
    success: true,
    data: populated
  });
});

// GET: /api/feedback/teacher
// GET: /api/feedback/teacher
const getTeacherFeedbacks = asyncHandler(async (req, res) => {
  // Teachers should only see published feedback, not drafts
  const feedbacks = await Feedback.find({ 
    teacher: req.user._id,
    isDraft: false // Add this filter
  })
    .populate('student', 'name')
    .sort({ createdAt: -1 });
  res.status(200).json(feedbacks);
});


// PUT: /api/feedback/status/:id
const updateFeedbackStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const feedback = await Feedback.findById(req.params.id);

  if (!feedback) {
    return res.status(404).json({ message: 'Feedback not found' });
  }

  feedback.status = status;
  await feedback.save();

  res.status(200).json(feedback);
});

const submitFeedbackImage = asyncHandler(async (req, res) => {
  const { subject, teacher, feedbackText, rating } = req.body;

  const imagePaths = req.files?.map(file => file.path) || [];

  const newFeedback = new Feedback({
    student: req.user._id,
    subject,
    teacher,
    feedbackText,
    rating,
    images: imagePaths
  });

  await newFeedback.save();
  res.status(201).json({ message: 'Feedback submitted successfully.' });
});




module.exports = {
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
};