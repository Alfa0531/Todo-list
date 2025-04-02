const mongoose = require('mongoose');

const SubtaskSchema = new mongoose.Schema({
  title: String,
  completed: { type: Boolean, default: false },
}, { timestamps: true });

const CommentSchema = new mongoose.Schema({
  text: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  subtasks: [SubtaskSchema],
  comments: [CommentSchema],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
