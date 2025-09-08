// models/task.model.js
import mongoose, { Schema, models } from 'mongoose';

const taskSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required."],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  dueDate: {
    type: Date,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const Task = models.Task || mongoose.model('Task', taskSchema);

export default Task;