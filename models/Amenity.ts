import mongoose, { Document, Schema } from 'mongoose';

export interface IAmenity extends Document {
  _id: string;
  name: string;
  icon: string;
  category: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AmenitySchema = new Schema<IAmenity>({
  name: {
    type: String,
    required: [true, 'Amenity name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  icon: {
    type: String,
    required: [true, 'Icon is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    lowercase: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
AmenitySchema.index({ name: 1 });
AmenitySchema.index({ category: 1 });
AmenitySchema.index({ isActive: 1 });
AmenitySchema.index({ category: 1, isActive: 1 });

// Static methods
AmenitySchema.statics.findActive = function() {
  return this.find({ isActive: true }).sort({ name: 1 });
};

AmenitySchema.statics.findByCategory = function(category: string) {
  return this.find({ category: category.toLowerCase(), isActive: true }).sort({ name: 1 });
};

AmenitySchema.statics.getCategories = function() {
  return this.distinct('category', { isActive: true });
};

// Ensure model is not re-compiled in development
const Amenity = mongoose.models.Amenity || mongoose.model<IAmenity>('Amenity', AmenitySchema);

export default Amenity;
