const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Blog Schema
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  slug: {
    type: String,
    required: true,
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
    enum: ['draft', 'published', 'archived'],
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Pre-save middleware to generate slug and calculate reading time
blogSchema.pre('save', function(next) {
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

const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', blogSchema);

const seedBlogs = async () => {
  try {
    await connectDB();

    // Clear existing blogs
    await BlogPost.deleteMany({});
    console.log('Cleared existing blog posts');

    // Default user ID (you should replace this with a real user ID from your database)
    const defaultUserId = new mongoose.Types.ObjectId();

    // Sample blog posts data
    const blogsData = [
      {
        title: "The Future of Sustainable Architecture in Urban Development",
        slug: "the-future-of-sustainable-architecture-in-urban-development",
        excerpt: "Exploring innovative designs and materials that are shaping eco-friendly cityscapes and creating sustainable communities for future generations.",
        content: `# The Future of Sustainable Architecture in Urban Development

As cities continue to expand and populations grow, the need for sustainable architecture has never been more critical. Urban development is at a crossroads where environmental responsibility meets innovative design.

## Green Building Materials

Modern sustainable architecture incorporates:
- Recycled and renewable materials
- Energy-efficient systems
- Water conservation technologies
- Smart building automation

## Benefits for Communities

Sustainable buildings offer numerous advantages:
1. Reduced environmental impact
2. Lower operating costs
3. Improved air quality
4. Enhanced quality of life

The future of urban development lies in creating spaces that not only serve human needs but also protect and preserve our environment for generations to come.`,
        coverImage: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=800&h=600&fit=crop",
        author: {
          name: "Alex Johnson",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
        },
        category: "Architecture",
        status: "published",
        tags: ["sustainable", "architecture", "urban", "eco-friendly", "green building"],
        seoMeta: {
          title: "Sustainable Architecture in Urban Development",
          description: "Explore the future of sustainable architecture in urban development with eco-friendly designs and materials for greener cities.",
          keywords: ["sustainable architecture", "urban development", "green building", "eco-friendly design"]
        },
        createdBy: defaultUserId,
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      {
        title: "Smart Homes: Integrating Technology for Modern Living",
        slug: "smart-homes-integrating-technology-for-modern-living",
        excerpt: "A comprehensive look into how IoT devices, AI, and automation are transforming residential spaces into intelligent, efficient homes.",
        content: `# Smart Homes: Integrating Technology for Modern Living

The integration of IoT devices and artificial intelligence is revolutionizing how we interact with our living spaces. Smart homes are no longer a futuristic concept but a present reality.

## Key Technologies

### Internet of Things (IoT)
- Connected appliances and devices
- Real-time monitoring and control
- Energy optimization systems

### Artificial Intelligence
- Learning user preferences
- Predictive maintenance
- Automated decision making

## Benefits of Smart Home Technology

Smart homes offer numerous advantages for modern families:
- Enhanced security and safety
- Energy efficiency and cost savings
- Convenience and comfort
- Remote monitoring capabilities

The future of residential living is intelligent, connected, and responsive to our needs.`,
        coverImage: "https://images.unsplash.com/photo-1529400971027-cadd71752d99?w=800&h=600&fit=crop",
        author: {
          name: "Priya Sharma",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
        },
        category: "Technology",
        status: "published",
        tags: ["smart home", "technology", "iot", "automation", "ai"],
        seoMeta: {
          title: "Smart Home Technology Integration",
          description: "Discover how IoT devices and automation are transforming modern homes into smart living spaces.",
          keywords: ["smart home", "home automation", "IoT", "smart technology"]
        },
        createdBy: defaultUserId,
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        title: "Luxury Real Estate Trends for 2024",
        slug: "luxury-real-estate-trends-for-2024",
        excerpt: "An in-depth analysis of emerging trends in the luxury real estate market, from design preferences to investment opportunities.",
        content: `# Luxury Real Estate Trends for 2024

The luxury real estate market is constantly evolving, driven by changing lifestyle preferences, technological advances, and global economic factors.

## Emerging Design Trends

### Wellness-Focused Spaces
- Home gyms and spa facilities
- Air purification systems
- Natural lighting optimization

### Sustainable Luxury
- Eco-friendly materials
- Renewable energy systems
- Water conservation features

## Investment Opportunities

The luxury market presents unique opportunities:
1. Prime location properties
2. Smart home integration
3. Sustainable features premium
4. Flexible living spaces

## Market Outlook

Experts predict continued growth in the luxury segment, with emphasis on:
- Technology integration
- Sustainability features
- Health and wellness amenities
- Flexible design solutions

The luxury real estate market continues to adapt to changing consumer preferences while maintaining its focus on quality and exclusivity.`,
        coverImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
        author: {
          name: "Raj Patel",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
        },
        category: "Real Estate",
        status: "draft",
        tags: ["luxury", "real estate", "trends", "2024", "market", "investment"],
        seoMeta: {
          title: "2024 Luxury Real Estate Trends",
          description: "Explore our predictions for luxury real estate market trends in 2024 and beyond.",
          keywords: ["luxury real estate", "2024 trends", "property investment", "luxury homes"]
        },
        createdBy: defaultUserId
      },
      {
        title: "Sustainable Landscaping for Modern Properties",
        slug: "sustainable-landscaping-for-modern-properties",
        excerpt: "How eco-friendly landscaping enhances property value while minimizing environmental impact through innovative design and native plants.",
        content: `# Sustainable Landscaping for Modern Properties

Modern landscaping goes beyond aesthetics to create environmentally responsible outdoor spaces that enhance property value while supporting local ecosystems.

## Principles of Sustainable Landscaping

### Native Plant Selection
- Adapted to local climate
- Reduced water requirements
- Support for local wildlife

### Water Conservation
- Drip irrigation systems
- Rainwater harvesting
- Drought-resistant plants

## Design Elements

Sustainable landscapes incorporate:
- Permeable paving materials
- Composting areas
- Edible gardens
- Wildlife habitats

## Benefits

Property owners enjoy:
1. Reduced maintenance costs
2. Lower water bills
3. Increased property value
4. Environmental stewardship

Sustainable landscaping represents a commitment to environmental responsibility while creating beautiful, functional outdoor spaces.`,
        coverImage: "https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=800&h=600&fit=crop",
        author: {
          name: "Meera Joshi",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
        },
        category: "Architecture",
        status: "published",
        tags: ["landscaping", "sustainable", "eco-friendly", "property value", "native plants"],
        seoMeta: {
          title: "Sustainable Landscaping for Modern Properties",
          description: "Learn how sustainable landscaping can enhance property value while minimizing environmental impact.",
          keywords: ["sustainable landscaping", "eco-friendly gardens", "native plants", "water conservation"]
        },
        createdBy: defaultUserId,
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      }
    ];

    // Insert blog posts
    const createdBlogs = await BlogPost.insertMany(blogsData);
    console.log(`Created ${createdBlogs.length} blog posts successfully`);

    // Display created blogs
    createdBlogs.forEach((blog, index) => {
      console.log(`${index + 1}. ${blog.title} - ${blog.status} - ${blog.category}`);
    });

  } catch (error) {
    console.error('Error seeding blogs:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeding
seedBlogs();
