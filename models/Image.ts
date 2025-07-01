import mongoose, { Document, Schema } from 'mongoose';

export interface IImage extends Document {
  _id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  data: string; // base64 encoded image data
  uploadedBy: mongoose.Types.ObjectId;
  uploadedAt: Date;
  metadata?: {
    width?: number;
    height?: number;
    format?: string;
  };
}

const ImageSchema = new Schema<IImage>({
  filename: {
    type: String,
    required: true,
    index: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true,
    max: 2 * 1024 * 1024 // 2MB limit
  },
  data: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  metadata: {
    width: Number,
    height: Number,
    format: String
  }
}, {
  timestamps: true
});

// Index for faster queries (filename already has index: true in schema)
ImageSchema.index({ uploadedBy: 1 });
ImageSchema.index({ uploadedAt: -1 });

const Image = mongoose.models.Image || mongoose.model<IImage>('Image', ImageSchema);

export default Image;
