import mongoose from 'mongoose';

const AwardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Award title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Award description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  image: {
    type: String,
    default: '',
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create indexes for better performance
AwardSchema.index({ isActive: 1 });
AwardSchema.index({ createdAt: -1 });

const Award = mongoose.models.Award || mongoose.model('Award', AwardSchema);

export default Award;
