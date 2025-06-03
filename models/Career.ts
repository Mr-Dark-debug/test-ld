import mongoose, { Document, Schema } from 'mongoose';

export interface IJobOpening extends Document {
  _id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  experience: string;
  salary?: {
    min?: number;
    max?: number;
    currency: string;
  };
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits?: string[];
  skills?: string[];
  isActive: boolean;
  isUrgent: boolean;
  applicationDeadline?: Date;
  postedDate: Date;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IJobApplication extends Document {
  _id: string;
  jobId: string;
  applicantInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    linkedinUrl?: string;
    portfolioUrl?: string;
  };
  resume: {
    filename: string;
    url: string;
    uploadedAt: Date;
  };
  coverLetter?: string;
  experience: string;
  expectedSalary?: number;
  availableFrom?: Date;
  status: 'new' | 'reviewed' | 'shortlisted' | 'interviewed' | 'rejected' | 'hired';
  notes?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const JobOpeningSchema = new Schema<IJobOpening>({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [100, 'Job title cannot exceed 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    required: [true, 'Job type is required']
  },
  experience: {
    type: String,
    required: [true, 'Experience requirement is required'],
    trim: true
  },
  salary: {
    min: {
      type: Number,
      min: 0
    },
    max: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      default: 'INR',
      trim: true
    }
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    trim: true
  },
  responsibilities: [{
    type: String,
    required: true,
    trim: true
  }],
  requirements: [{
    type: String,
    required: true,
    trim: true
  }],
  benefits: [{
    type: String,
    trim: true
  }],
  skills: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  applicationDeadline: {
    type: Date
  },
  postedDate: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const JobApplicationSchema = new Schema<IJobApplication>({
  jobId: {
    type: Schema.Types.ObjectId,
    ref: 'JobOpening',
    required: true
  },
  applicantInfo: {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    linkedinUrl: {
      type: String,
      trim: true
    },
    portfolioUrl: {
      type: String,
      trim: true
    }
  },
  resume: {
    filename: {
      type: String,
      required: [true, 'Resume filename is required']
    },
    url: {
      type: String,
      required: [true, 'Resume URL is required']
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  coverLetter: {
    type: String,
    trim: true
  },
  experience: {
    type: String,
    required: [true, 'Experience is required'],
    trim: true
  },
  expectedSalary: {
    type: Number,
    min: 0
  },
  availableFrom: {
    type: Date
  },
  status: {
    type: String,
    enum: ['new', 'reviewed', 'shortlisted', 'interviewed', 'rejected', 'hired'],
    default: 'new'
  },
  notes: {
    type: String,
    trim: true
  },
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Create indexes
JobOpeningSchema.index({ isActive: 1, postedDate: -1 });
JobOpeningSchema.index({ slug: 1 });
JobOpeningSchema.index({ department: 1 });
JobOpeningSchema.index({ type: 1 });

JobApplicationSchema.index({ jobId: 1, status: 1 });
JobApplicationSchema.index({ 'applicantInfo.email': 1 });
JobApplicationSchema.index({ createdAt: -1 });

// Pre-save middleware to generate slug
JobOpeningSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Static methods
JobOpeningSchema.statics.findActive = function() {
  return this.find({ isActive: true }).sort({ postedDate: -1 });
};

JobApplicationSchema.statics.findByJob = function(jobId: string) {
  return this.find({ jobId }).populate('jobId', 'title department').sort({ createdAt: -1 });
};

// Instance methods
JobOpeningSchema.methods.toSafeObject = function() {
  const obj = this.toObject();
  return obj;
};

JobApplicationSchema.methods.toSafeObject = function() {
  const obj = this.toObject();
  return obj;
};

const JobOpening = mongoose.models.JobOpening || mongoose.model<IJobOpening>('JobOpening', JobOpeningSchema);
const JobApplication = mongoose.models.JobApplication || mongoose.model<IJobApplication>('JobApplication', JobApplicationSchema);

export { JobOpening, JobApplication };
export default JobOpening;
