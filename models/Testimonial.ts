import mongoose, { Document, Schema } from 'mongoose';

export interface ITestimonial extends Document {
  _id: string;
  name: string;
  designation?: string;
  company?: string;
  content: string;
  rating: number;
  image?: string;
  youtubeUrl?: string;

  isApproved: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  designation: {
    type: String,
    trim: true,
    maxlength: [50, 'Designation cannot exceed 50 characters']
  },
  company: {
    type: String,
    trim: true,
    maxlength: [50, 'Company name cannot exceed 50 characters']
  },
  content: {
    type: String,
    required: [true, 'Testimonial content is required'],
    trim: true,
    minlength: [10, 'Content must be at least 10 characters long'],
    maxlength: [500, 'Content cannot exceed 500 characters']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  image: {
    type: String,
    trim: true
  },
  youtubeUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        if (!v || v === '') return true; // Optional field, allow empty strings
        // Validate YouTube URL format - more flexible to allow query parameters
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[a-zA-Z0-9_-]{11}.*$/;
        return youtubeRegex.test(v);
      },
      message: 'Please provide a valid YouTube URL'
    }
  },

  isApproved: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
TestimonialSchema.index({ isApproved: 1 });
TestimonialSchema.index({ isFeatured: 1 });
TestimonialSchema.index({ rating: -1 });

TestimonialSchema.index({ isApproved: 1, isFeatured: 1 });
TestimonialSchema.index({ createdAt: -1 });

// Static methods
TestimonialSchema.statics.findApproved = function() {
  return this.find({ isApproved: true }).sort({ createdAt: -1 });
};

TestimonialSchema.statics.findFeatured = function() {
  return this.find({ isApproved: true, isFeatured: true }).sort({ rating: -1, createdAt: -1 });
};



TestimonialSchema.statics.findByRating = function(minRating: number = 4) {
  return this.find({ rating: { $gte: minRating }, isApproved: true }).sort({ rating: -1, createdAt: -1 });
};

TestimonialSchema.statics.getPendingApproval = function() {
  return this.find({ isApproved: false }).sort({ createdAt: -1 });
};

// Virtual for display name
TestimonialSchema.virtual('displayName').get(function() {
  if (this.designation && this.company) {
    return `${this.name}, ${this.designation} at ${this.company}`;
  } else if (this.designation) {
    return `${this.name}, ${this.designation}`;
  } else if (this.company) {
    return `${this.name} from ${this.company}`;
  }
  return this.name;
});

// Ensure virtual fields are serialized
TestimonialSchema.set('toJSON', { virtuals: true });

// Ensure model is not re-compiled in development
const Testimonial = mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);

export default Testimonial;
