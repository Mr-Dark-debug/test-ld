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

// Project Schema (simplified)
const projectSchema = new mongoose.Schema({
  title: String,
  slug: String,
  description: String,
  status: String,
  category: String,
  location: Object,
  pricing: Object,
  images: [String],
  amenities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Amenity' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isFeatured: Boolean
}, {
  timestamps: true
});

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

const checkProjects = async () => {
  try {
    await connectDB();

    // Get all projects
    const projects = await Project.find({}).lean();
    console.log(`Found ${projects.length} projects in database:`);
    
    projects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title} - slug: ${project.slug} - status: ${project.status}`);
    });

    // Check for the specific project mentioned in the error
    const laxmiArcade = await Project.findOne({ slug: 'laxmi-arcade' }).lean();
    if (laxmiArcade) {
      console.log('\nFound Laxmi Arcade project:');
      console.log(JSON.stringify(laxmiArcade, null, 2));
    } else {
      console.log('\nLaxmi Arcade project not found in database');
    }

  } catch (error) {
    console.error('Error checking projects:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the check
checkProjects();
