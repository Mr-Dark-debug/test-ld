import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  _id: string;
  title: string;
  slug: string;
  category: 'residential' | 'commercial';
  status: 'ongoing' | 'completed' | 'upcoming';
  description: string;
  location: {
    address?: string;
    lat?: string;
    lng?: string;
    mapEmbedUrl?: string;
  };
  images: {
    coverImage?: string;
    gallery: {
      promotional: string[];
      exterior: string[];
      interior: string[];
      videos: string[];
    };
  };
  specifications: {
    totalUnits: string;
    unitTypes: string;
    unitArea: string;
    possession: string;
    structure: string;
    flooring: string;
  };
  amenities: mongoose.Types.ObjectId[];
  reraNumber?: string;
  reraQrImage?: string;
  brochureUrl?: string;
  brochureFile?: string;
  modelView?: string;
  coverImage?: string;
  contactSales?: string;
  floorPlans: {
    '2bhk': string[];
    '3bhk': string[];
    '4bhk': string[];
  };
  featured: boolean;
  seoMeta?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
  createdBy: mongoose.Types.ObjectId;
}

const ProjectSchema = new Schema<IProject>({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    minlength: [2, 'Title must be at least 2 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['residential', 'commercial'],
    required: [true, 'Project category is required']
  },
  status: {
    type: String,
    enum: ['ongoing', 'completed', 'upcoming'],
    required: [true, 'Project status is required']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long']
  },
  location: {
    address: {
      type: String,
      trim: true
    },
    lat: {
      type: String,
      trim: true
    },
    lng: {
      type: String,
      trim: true
    },
    mapEmbedUrl: {
      type: String,
      trim: true
    }
  },
  images: {
    coverImage: String,
    gallery: {
      promotional: [String],
      exterior: [String],
      interior: [String],
      videos: [String]
    }
  },
  specifications: {
    totalUnits: {
      type: String,
      default: ''
    },
    unitTypes: {
      type: String,
      default: ''
    },
    unitArea: {
      type: String,
      default: ''
    },
    possession: {
      type: String,
      default: ''
    },
    structure: {
      type: String,
      default: ''
    },
    flooring: {
      type: String,
      default: ''
    }
  },
  amenities: [{
    type: Schema.Types.ObjectId,
    ref: 'Amenity'
  }],
  reraNumber: {
    type: String,
    trim: true,
    default: ''
  },
  reraQrImage: String,
  brochureUrl: String,
  brochureFile: String,
  modelView: String,
  coverImage: String,
  contactSales: {
    type: String,
    trim: true,
    default: ''
  },
  floorPlans: {
    '2bhk': [String],
    '3bhk': [String],
    '4bhk': [String]
  },
  featured: {
    type: Boolean,
    default: false
  },
  seoMeta: {
    title: {
      type: String,
      maxlength: [60, 'SEO title cannot exceed 60 characters']
    },
    description: {
      type: String,
      maxlength: [160, 'SEO description cannot exceed 160 characters']
    },
    keywords: [String]
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes (slug index is already created by unique: true)
ProjectSchema.index({ category: 1 });
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ featured: 1 });
ProjectSchema.index({ category: 1, status: 1 });
ProjectSchema.index({ 'location.address': 1 });
ProjectSchema.index({ createdAt: -1 });

// Pre-save middleware to generate slug
ProjectSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isNew) {
    (this as any).slug = (this as any).title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

// Static methods
ProjectSchema.statics.findByCategory = function(category: string) {
  return this.find({ category }).sort({ createdAt: -1 });
};

ProjectSchema.statics.findByStatus = function(status: string) {
  return this.find({ status }).sort({ createdAt: -1 });
};

ProjectSchema.statics.findFeatured = function() {
  return this.find({ featured: true }).sort({ createdAt: -1 });
};

ProjectSchema.statics.findByCategoryAndStatus = function(category: string, status: string) {
  return this.find({ category, status }).sort({ createdAt: -1 });
};

ProjectSchema.statics.findByAddress = function(address: string) {
  return this.find({ 'location.address': new RegExp(address, 'i') }).sort({ createdAt: -1 });
};

// Ensure model is not re-compiled in development
const Project = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
