import mongoose, { Document, Schema } from 'mongoose';

export interface IAboutUs extends Document {
  _id: string;
  heroSection: {
    tagline: string;
    title: string;
    titleHighlight: string;
    description: string;
    buttonText: string;
    backgroundImage: string;
  };
  companySection: {
    tagline: string;
    title: string;
    description1: string;
    description2: string;
    image: string;
  };
  missionVisionValues: {
    sectionTagline: string;
    sectionTitle: string;
    sectionDescription: string;
    items: {
      title: string;
      description: string;
    }[];
  };
  portfolioSection: {
    tagline: string;
    title: string;
    description: string;
    buttonText: string;
    projects: {
      title: string;
      category: string;
      image: string;
    }[];
  };
  ctaSection: {
    title: string;
    description: string;
    primaryButton: {
      text: string;
      href: string;
    };
    secondaryButton: {
      text: string;
      href: string;
    };
  };
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const AboutUsSchema = new Schema<IAboutUs>({
  heroSection: {
    tagline: {
      type: String,
      required: [true, 'Hero tagline is required'],
      trim: true
    },
    title: {
      type: String,
      required: [true, 'Hero title is required'],
      trim: true
    },
    titleHighlight: {
      type: String,
      required: [true, 'Hero title highlight is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Hero description is required'],
      trim: true
    },
    buttonText: {
      type: String,
      required: [true, 'Hero button text is required'],
      trim: true
    },
    backgroundImage: {
      type: String,
      required: [true, 'Hero background image is required'],
      trim: true
    }
  },
  companySection: {
    tagline: {
      type: String,
      required: [true, 'Company tagline is required'],
      trim: true
    },
    title: {
      type: String,
      required: [true, 'Company title is required'],
      trim: true
    },
    description1: {
      type: String,
      required: [true, 'Company description 1 is required'],
      trim: true
    },
    description2: {
      type: String,
      required: [true, 'Company description 2 is required'],
      trim: true
    },
    image: {
      type: String,
      required: [true, 'Company image is required'],
      trim: true
    }
  },
  missionVisionValues: {
    sectionTagline: {
      type: String,
      required: [true, 'Mission section tagline is required'],
      trim: true
    },
    sectionTitle: {
      type: String,
      required: [true, 'Mission section title is required'],
      trim: true
    },
    sectionDescription: {
      type: String,
      required: [true, 'Mission section description is required'],
      trim: true
    },
    items: [{
      title: {
        type: String,
        required: [true, 'Mission item title is required'],
        trim: true
      },
      description: {
        type: String,
        required: [true, 'Mission item description is required'],
        trim: true
      }
    }]
  },
  portfolioSection: {
    tagline: {
      type: String,
      required: [true, 'Portfolio tagline is required'],
      trim: true
    },
    title: {
      type: String,
      required: [true, 'Portfolio title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Portfolio description is required'],
      trim: true
    },
    buttonText: {
      type: String,
      required: [true, 'Portfolio button text is required'],
      trim: true
    },
    projects: [{
      title: {
        type: String,
        required: [true, 'Portfolio project title is required'],
        trim: true
      },
      category: {
        type: String,
        required: [true, 'Portfolio project category is required'],
        trim: true
      },
      image: {
        type: String,
        required: [true, 'Portfolio project image is required'],
        trim: true
      }
    }]
  },
  ctaSection: {
    title: {
      type: String,
      required: [true, 'CTA title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'CTA description is required'],
      trim: true
    },
    primaryButton: {
      text: {
        type: String,
        required: [true, 'Primary button text is required'],
        trim: true
      },
      href: {
        type: String,
        required: [true, 'Primary button href is required'],
        trim: true
      }
    },
    secondaryButton: {
      text: {
        type: String,
        required: [true, 'Secondary button text is required'],
        trim: true
      },
      href: {
        type: String,
        required: [true, 'Secondary button href is required'],
        trim: true
      }
    }
  },
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
AboutUsSchema.index({ isActive: 1 });
AboutUsSchema.index({ createdAt: -1 });

// Static methods
AboutUsSchema.statics.findActive = function() {
  return this.findOne({ isActive: true }).populate('createdBy updatedBy', 'name email');
};

// Instance methods
AboutUsSchema.methods.toSafeObject = function() {
  const obj = this.toObject();
  return obj;
};

const AboutUs = mongoose.models.AboutUs || mongoose.model<IAboutUs>('AboutUs', AboutUsSchema);

export default AboutUs;
