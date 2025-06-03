import mongoose, { Document, Schema } from 'mongoose';

export interface IContactUs extends Document {
  _id: string;
  contactInfo: {
    address: string;
    phone: string;
    email: string;
    hours: {
      days: string;
      time: string;
    }[];
    mapEmbedSrc: string;
  };
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  officeLocations: {
    name: string;
    address: string;
    phone: string;
    email: string;
    mapEmbedSrc: string;
    isMain: boolean;
  }[];
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactUsSchema = new Schema<IContactUs>({
  contactInfo: {
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    hours: [{
      days: {
        type: String,
        required: [true, 'Days are required'],
        trim: true
      },
      time: {
        type: String,
        required: [true, 'Time is required'],
        trim: true
      }
    }],
    mapEmbedSrc: {
      type: String,
      required: [true, 'Map embed source is required'],
      trim: true
    }
  },
  socialMedia: {
    facebook: {
      type: String,
      trim: true
    },
    instagram: {
      type: String,
      trim: true
    },
    twitter: {
      type: String,
      trim: true
    },
    linkedin: {
      type: String,
      trim: true
    },
    youtube: {
      type: String,
      trim: true
    }
  },
  officeLocations: [{
    name: {
      type: String,
      required: [true, 'Office name is required'],
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Office address is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Office phone is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Office email is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    mapEmbedSrc: {
      type: String,
      required: [true, 'Office map embed source is required'],
      trim: true
    },
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  isActive: {
    type: Boolean,
    default: true
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

// Create indexes
ContactUsSchema.index({ isActive: 1 });
ContactUsSchema.index({ createdAt: -1 });

// Static methods
ContactUsSchema.statics.findActive = function() {
  return this.findOne({ isActive: true }).populate('createdBy updatedBy', 'name email');
};

// Instance methods
ContactUsSchema.methods.toSafeObject = function() {
  const obj = this.toObject();
  return obj;
};

const ContactUs = mongoose.models.ContactUs || mongoose.model<IContactUs>('ContactUs', ContactUsSchema);

export default ContactUs;
