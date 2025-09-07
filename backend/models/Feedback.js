const mongoose = require('mongoose');

// const feedbackSchema = new mongoose.Schema({
//   student: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   teacher: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   subject: {
//     type: String,
//     required: true,
//   },
//   images: [{
//   type: String,
// }],
//   feedbackText: {
//     type: String,
//     required: true,
//   },
//   rating: {
//     type: Number,
//     min: 1,
//     max: 5,
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: ['Pending', 'In Progress', 'Responded', 'Resolved'],
//     default: 'Pending',
//   },
//   reply: {
//     type: String,
//     default: '',
//   },
//   respondedAt: {
//     type: Date,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   }
// });

// module.exports = mongoose.model('Feedback', feedbackSchema);


const feedbackSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
  }],
  feedbackText: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  status: {
    type: String,
    enum: ['Draft', 'Pending', 'In Progress', 'Responded', 'Resolved'], 
    default: 'Pending',
  },
  reply: {
    type: String,
    default: '',
  },
  respondedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    enum: ['Teaching Style', 'Behavior', 'Course Content', 'Grading', 'Other'],
    default: 'Other',
  },
  isDraft: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model('Feedback', feedbackSchema);