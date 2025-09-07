// models/Note.js
import mongoose, { Schema } from 'mongoose'

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required.'],
      trim: true,
    },
    content: {
      type: String,
      trim: true,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    userId: {
      type: String, // Storing as a string from NextAuth session
      required: true,
    },
  },
  {
    timestamps: true, // Mongoose handles createdAt and updatedAt
  }
)

export default mongoose.models.Note || mongoose.model('Note', noteSchema)