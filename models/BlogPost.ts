import mongoose, { Document, Schema } from 'mongoose';

export interface IBlogPost extends Document {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: {
    name: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived' | 'scheduled';
  readingTime?: number;
  seoMeta?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: mongoose.Types.ObjectId;
}

const BlogPostSchema = new Schema<IBlogPost>({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  excerpt: {
    type: String,
    required: [true, 'Blog excerpt is required'],
    trim: true,
    minlength: [10, 'Excerpt must be at least 10 characters long'],
    maxlength: [200, 'Excerpt cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Blog content is required'],
    minlength: [50, 'Content must be at least 50 characters long']
  },
  coverImage: {
    type: String,
    trim: true
  },
  author: {
    name: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true
    },
    avatar: {
      type: String,
      trim: true
    }
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived', 'scheduled'],
    default: 'draft'
  },
  readingTime: {
    type: Number,
    min: [1, 'Reading time must be at least 1 minute']
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
  publishedAt: {
    type: Date
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
BlogPostSchema.index({ status: 1 });
BlogPostSchema.index({ category: 1 });
BlogPostSchema.index({ tags: 1 });
BlogPostSchema.index({ publishedAt: -1 });
BlogPostSchema.index({ status: 1, publishedAt: -1 });
BlogPostSchema.index({ category: 1, status: 1 });

// Pre-save middleware to generate slug and calculate reading time
BlogPostSchema.pre('save', function(next) {
  // Generate slug from title
  if (this.isModified('title') || this.isNew) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  // Calculate reading time (average 200 words per minute)
  if (this.isModified('content') || this.isNew) {
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / 200);
  }

  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

// Static methods
BlogPostSchema.statics.findPublished = function() {
  return this.find({ status: 'published' }).sort({ publishedAt: -1 });
};

BlogPostSchema.statics.findByCategory = function(category: string) {
  return this.find({ category, status: 'published' }).sort({ publishedAt: -1 });
};

BlogPostSchema.statics.findByTag = function(tag: string) {
  return this.find({ tags: tag, status: 'published' }).sort({ publishedAt: -1 });
};

BlogPostSchema.statics.findDrafts = function() {
  return this.find({ status: 'draft' }).sort({ updatedAt: -1 });
};

BlogPostSchema.statics.search = function(query: string) {
  return this.find({
    status: 'published',
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { excerpt: { $regex: query, $options: 'i' } },
      { content: { $regex: query, $options: 'i' } },
      { tags: { $regex: query, $options: 'i' } }
    ]
  }).sort({ publishedAt: -1 });
};

BlogPostSchema.statics.getCategories = function() {
  return this.distinct('category', { status: 'published' });
};

BlogPostSchema.statics.getTags = function() {
  return this.distinct('tags', { status: 'published' });
};

// Virtual for formatted reading time
BlogPostSchema.virtual('formattedReadingTime').get(function() {
  if (!this.readingTime) return '1 min read';
  return this.readingTime === 1 ? '1 min read' : `${this.readingTime} min read`;
});

// Ensure virtual fields are serialized
BlogPostSchema.set('toJSON', { virtuals: true });

// Ensure model is not re-compiled in development
const BlogPost = mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);

export default BlogPost;
