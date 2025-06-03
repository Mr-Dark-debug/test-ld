// Script to add initial testimonials with YouTube URLs
const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = "mongodb+srv://laxmidev:Ldtest@ldtest.kcc4dlq.mongodb.net/realestate_cms?retryWrites=true&w=majority&appName=Ldtest";

// Testimonial schema (simplified)
const TestimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: String,
  company: String,
  content: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  image: String,
  youtubeUrl: String,
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  isApproved: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

const Testimonial = mongoose.model('Testimonial', TestimonialSchema);

// Initial testimonials data with YouTube URLs
const testimonials = [
  {
    name: "Rajesh Patel",
    designation: "Homeowner",
    company: "Millennium Park",
    content: "Laxmi Developers delivered beyond our expectations. The attention to detail and quality of construction is outstanding. We're extremely happy with our investment.",
    rating: 5,
    youtubeUrl: "https://youtu.be/MUDMUMetgnw",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    isApproved: true,
    isFeatured: true
  },
  {
    name: "Priya Shah",
    designation: "Business Owner",
    company: "Business Hub",
    content: "The team at Laxmi Developers was professional from start to finish. They guided us through the entire process and delivered exactly what was promised.",
    rating: 5,
    youtubeUrl: "https://youtu.be/IrOBu0q6fQI",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    isApproved: true,
    isFeatured: true
  },
  {
    name: "Amit Desai",
    designation: "Investor",
    company: "Laxmi Nova",
    content: "What impressed me most was how Laxmi Developers completed the project on schedule. The construction quality is excellent and the design is modern and functional.",
    rating: 5,
    youtubeUrl: "https://youtu.be/9Bdx26mKPyc?si=_dwZIcW-g4Heqj2n",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    isApproved: true,
    isFeatured: true
  },
  {
    name: "Meera Joshi",
    designation: "Property Investor",
    company: "Laxmi Heights",
    content: "Investing with Laxmi Developers was one of the best decisions I made. The returns have been excellent and the property value has appreciated significantly.",
    rating: 5,
    youtubeUrl: "https://youtu.be/3bmdwCqPiBA?si=0us38hGICW0rQg7y",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    isApproved: true,
    isFeatured: true
  }
];

async function addTestimonials() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing testimonials (optional)
    const existingCount = await Testimonial.countDocuments({});
    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing testimonials, skipping...`);
      return;
    }

    // Add new testimonials
    const result = await Testimonial.insertMany(testimonials);
    console.log(`Added ${result.length} testimonials successfully`);

    // Display added testimonials
    result.forEach((testimonial, index) => {
      console.log(`${index + 1}. ${testimonial.name} - ${testimonial.youtubeUrl}`);
    });

  } catch (error) {
    console.error('Error adding testimonials:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
addTestimonials();
