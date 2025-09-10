const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // assumes you have a User model
    required: true,
  },

  date: {
    type: String, // e.g., '2025-07-07'
    required: true,
    default:Date.now
  },
  inTime: {
    type: Date,
    default:Date.now
    
  },
  outTime: {
    type: Date,
    
  },
  breakStart: {
    type: Date,
  },
  breakEnd: {
    type: Date,
  },
  totalHours: {
    type: String, // stored as string like "7.5", can be converted in frontend
  },
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
