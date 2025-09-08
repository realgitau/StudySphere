// models/material.model.js
import mongoose, { Schema, models } from 'mongoose';

const materialSchema = new Schema({
  fileName: {
    type: String,
    required: true,
  },
  url: { // URL from Vercel Blob
    type: String,
    required: true,
  },
  textContent: { // The extracted text from the document
    type: String,
    default: '',
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const Material = models.Material || mongoose.model('Material', materialSchema);
export default Material;