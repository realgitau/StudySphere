// models/course.model.js
import mongoose, { Schema, models } from 'mongoose';

const courseSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const Course = models.Course || mongoose.model('Course', courseSchema);
export default Course;