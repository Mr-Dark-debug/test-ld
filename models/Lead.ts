import mongoose, { Document, Schema } from 'mongoose';
import { VALIDATION_CONFIG } from '@/lib/config';

export interface ILead extends Document {
  _id: string;
  type: 'contact' | 'brochure' | 'career';
  name: string;
  email: string;
  phone: string;
  projectId?: mongoose.Types.ObjectId;
  projectInterest?: string;
  message?: string;
  jobId?: mongoose.Types.ObjectId;
  experience?: string;
  resumeUrl?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed';
  source: string;
  notes?: string;
  assignedTo?: mongoose.Types.ObjectId;
  followUpDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>({
  type: {
    type: String,
    enum: ['contact', 'brochure', 'career'],
    required: [true, 'Lead type is required']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [VALIDATION_CONFIG.NAME_MIN_LENGTH, `Name must be at least ${VALIDATION_CONFIG.NAME_MIN_LENGTH} characters long`],
    maxlength: [VALIDATION_CONFIG.NAME_MAX_LENGTH, `Name cannot exceed ${VALIDATION_CONFIG.NAME_MAX_LENGTH} characters`]
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [VALIDATION_CONFIG.EMAIL_PATTERN, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [VALIDATION_CONFIG.PHONE_PATTERN, 'Please provide a valid phone number']
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project'
  },
  projectInterest: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    trim: true,
    maxlength: [VALIDATION_CONFIG.MESSAGE_MAX_LENGTH, `Message cannot exceed ${VALIDATION_CONFIG.MESSAGE_MAX_LENGTH} characters`]
  },
  jobId: {
    type: Schema.Types.ObjectId,
    ref: 'JobOpening'
  },
  experience: {
    type: String,
    trim: true
  },
  resumeUrl: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'converted', 'closed'],
    default: 'new'
  },
  source: {
    type: String,
    required: true,
    default: 'website',
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  followUpDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes
LeadSchema.index({ type: 1 });
LeadSchema.index({ status: 1 });
LeadSchema.index({ email: 1 });
LeadSchema.index({ phone: 1 });
LeadSchema.index({ projectId: 1 });
LeadSchema.index({ assignedTo: 1 });
LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ type: 1, status: 1 });
LeadSchema.index({ followUpDate: 1 });

// Static methods
LeadSchema.statics.findByType = function(type: string) {
  return this.find({ type }).sort({ createdAt: -1 });
};

LeadSchema.statics.findByStatus = function(status: string) {
  return this.find({ status }).sort({ createdAt: -1 });
};

LeadSchema.statics.findNew = function() {
  return this.find({ status: 'new' }).sort({ createdAt: -1 });
};

LeadSchema.statics.findByProject = function(projectId: string) {
  return this.find({ projectId }).sort({ createdAt: -1 });
};

LeadSchema.statics.findAssignedTo = function(userId: string) {
  return this.find({ assignedTo: userId }).sort({ createdAt: -1 });
};

LeadSchema.statics.findDueForFollowUp = function() {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return this.find({
    followUpDate: { $lte: today },
    status: { $nin: ['converted', 'closed'] }
  }).sort({ followUpDate: 1 });
};

LeadSchema.statics.getLeadStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

LeadSchema.statics.getLeadsByMonth = function(year: number) {
  return this.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(year, 0, 1),
          $lt: new Date(year + 1, 0, 1)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id': 1 }
    }
  ]);
};

// Virtual for display status
LeadSchema.virtual('displayStatus').get(function() {
  const statusMap = {
    'new': 'New Lead',
    'contacted': 'Contacted',
    'qualified': 'Qualified',
    'converted': 'Converted',
    'closed': 'Closed'
  };
  return statusMap[this.status] || this.status;
});

// Virtual for urgency (based on creation date and follow-up date)
LeadSchema.virtual('urgency').get(function() {
  const now = new Date();
  const daysSinceCreated = Math.floor((now.getTime() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24));
  
  if (this.followUpDate && this.followUpDate < now) {
    return 'overdue';
  } else if (daysSinceCreated > 7 && this.status === 'new') {
    return 'high';
  } else if (daysSinceCreated > 3 && this.status === 'new') {
    return 'medium';
  }
  return 'low';
});

// Ensure virtual fields are serialized
LeadSchema.set('toJSON', { virtuals: true });

// Ensure model is not re-compiled in development
const Lead = mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);

export default Lead;
