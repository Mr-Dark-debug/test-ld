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

// Lead Schema
const leadSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['contact', 'brochure'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  projectInterest: String,
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  message: String,
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'negotiation', 'closed'],
    default: 'new'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: String,
  followUpDate: Date
}, {
  timestamps: true
});

const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);

// Project Schema (for reference)
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  type: { type: String, enum: ['residential', 'commercial'], required: true },
  status: { type: String, enum: ['ongoing', 'completed', 'upcoming'], required: true }
});

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

const seedLeads = async () => {
  try {
    await connectDB();

    // Get existing projects
    const projects = await Project.find().limit(3);
    
    if (projects.length === 0) {
      console.log('No projects found. Please seed projects first.');
      return;
    }

    console.log(`Found ${projects.length} projects:`, projects.map(p => p.title));

    // Clear existing leads
    await Lead.deleteMany({});
    console.log('Cleared existing leads');

    // Sample leads data
    const leadsData = [
      // Contact form leads
      {
        type: 'contact',
        name: 'Ravi Patel',
        email: 'ravi.patel@example.com',
        phone: '+91 98765 43210',
        message: 'I am interested in investing in property in Surat. Please share more details about your current projects.',
        status: 'new',
        projectInterest: 'Residential Properties'
      },
      {
        type: 'contact',
        name: 'Ananya Sharma',
        email: 'ananya.s@example.com',
        phone: '+91 98765 12345',
        message: 'Looking for a 3BHK apartment in the western part of Surat. Please call me to discuss options.',
        status: 'contacted',
        projectId: projects[0]?._id,
        projectInterest: projects[0]?.title
      },
      {
        type: 'contact',
        name: 'Vikram Desai',
        email: 'vikram.d@example.com',
        phone: '+91 87654 32109',
        message: 'I need information about your upcoming projects in Vesu area.',
        status: 'qualified',
        projectInterest: 'Upcoming Projects'
      },
      
      // Brochure download leads
      {
        type: 'brochure',
        name: 'Karan Mehra',
        email: 'karan.m@example.com',
        phone: '+91 98765 87654',
        projectId: projects[0]?._id,
        projectInterest: projects[0]?.title,
        status: 'new',
        notes: 'Downloaded brochure for ' + projects[0]?.title
      },
      {
        type: 'brochure',
        name: 'Neha Desai',
        email: 'neha.d@example.com',
        phone: '+91 87654 76543',
        projectId: projects[1]?._id,
        projectInterest: projects[1]?.title,
        status: 'contacted',
        notes: 'Interested in payment plans for ' + projects[1]?.title
      },
      {
        type: 'brochure',
        name: 'Rahul Joshi',
        email: 'rahul.j@example.com',
        phone: '+91 76543 65432',
        projectId: projects[0]?._id,
        projectInterest: projects[0]?.title,
        status: 'qualified',
        notes: 'Asked about possession date for ' + projects[0]?.title
      },
      {
        type: 'brochure',
        name: 'Deepa Shah',
        email: 'deepa.s@example.com',
        phone: '+91 65432 54321',
        projectId: projects[2]?._id,
        projectInterest: projects[2]?.title,
        status: 'negotiation',
        notes: 'Looking for office space in ' + projects[2]?.title
      },
      {
        type: 'contact',
        name: 'Priya Mehta',
        email: 'priya.m@example.com',
        phone: '+91 76543 21098',
        message: 'Please provide details about commercial properties in Adajan area.',
        status: 'new',
        projectInterest: 'Commercial Properties'
      }
    ];

    // Insert leads
    const createdLeads = await Lead.insertMany(leadsData);
    console.log(`Created ${createdLeads.length} leads successfully`);

    // Display created leads
    createdLeads.forEach((lead, index) => {
      console.log(`${index + 1}. ${lead.name} - ${lead.type} - ${lead.projectInterest || 'General'}`);
    });

  } catch (error) {
    console.error('Error seeding leads:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeding
seedLeads();
