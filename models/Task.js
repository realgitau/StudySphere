// models/Task.js
import mongoose, { Schema } from 'mongoose'

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required.'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    completed: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: String, // Storing as a string from NextAuth session
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }, // Mongoose handles createdAt/updatedAt
  }
)

// This prevents Mongoose from redefining the model every time the serverless function is invoked
export default mongoose.models.Task || mongoose.model('Task', taskSchema)