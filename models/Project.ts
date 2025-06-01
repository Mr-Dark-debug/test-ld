import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  _id: string;
  title: string;
  slug: string;
  type: 'residential' | 'commercial';
  status: 'ongoing' | 'completed' | 'upcoming';
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    coordinates: {
      lat: number;
      lng: number;
    };
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
  reraNumber: string;
  reraQrImage?: string;
  brochureUrl?: string;
  contactSales: string;
  floorPlans: {
    '1bhk': string[];
    '2bhk': string[];
    '3bhk': string[];
    '4bhk': string[];
    '5bhk': string[];
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
  type: {
    type: String,
    enum: ['residential', 'commercial'],
    required: [true, 'Project type is required']
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
      required: [true, 'Address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    coordinates: {
      lat: {
        type: Number,
        required: [true, 'Latitude is required'],
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90']
      },
      lng: {
        type: Number,
        required: [true, 'Longitude is required'],
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180']
      }
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
      required: [true, 'Total units is required']
    },
    unitTypes: {
      type: String,
      required: [true, 'Unit types is required']
    },
    unitArea: {
      type: String,
      required: [true, 'Unit area is required']
    },
    possession: {
      type: String,
      required: [true, 'Possession date is required']
    },
    structure: {
      type: String,
      required: [true, 'Structure type is required']
    },
    flooring: {
      type: String,
      required: [true, 'Flooring type is required']
    }
  },
  amenities: [{
    type: Schema.Types.ObjectId,
    ref: 'Amenity'
  }],
  reraNumber: {
    type: String,
    required: [true, 'RERA number is required'],
    trim: true
  },
  reraQrImage: String,
  brochureUrl: String,
  contactSales: {
    type: String,
    required: [true, 'Contact sales information is required'],
    trim: true
  },
  floorPlans: {
    '1bhk': [String],
    '2bhk': [String],
    '3bhk': [String],
    '4bhk': [String],
    '5bhk': [String]
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
ProjectSchema.index({ type: 1 });
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ featured: 1 });
ProjectSchema.index({ type: 1, status: 1 });
ProjectSchema.index({ 'location.city': 1 });
ProjectSchema.index({ createdAt: -1 });

// Pre-save middleware to generate slug
ProjectSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

// Static methods
ProjectSchema.statics.findByType = function(type: string) {
  return this.find({ type }).sort({ createdAt: -1 });
};

ProjectSchema.statics.findByStatus = function(status: string) {
  return this.find({ status }).sort({ createdAt: -1 });
};

ProjectSchema.statics.findFeatured = function() {
  return this.find({ featured: true }).sort({ createdAt: -1 });
};

ProjectSchema.statics.findByTypeAndStatus = function(type: string, status: string) {
  return this.find({ type, status }).sort({ createdAt: -1 });
};

ProjectSchema.statics.findByCity = function(city: string) {
  return this.find({ 'location.city': new RegExp(city, 'i') }).sort({ createdAt: -1 });
};

// Ensure model is not re-compiled in development
const Project = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
