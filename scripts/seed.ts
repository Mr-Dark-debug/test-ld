import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

// Direct MongoDB connection for seeding
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}
import User from '../models/User';
import Amenity from '../models/Amenity';
import Project from '../models/Project';
import Testimonial from '../models/Testimonial';
import bcrypt from 'bcryptjs';

// Hash password function for seeding
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Default admin users
const defaultUsers = [
  {
    email: 'admin@laxmidev.com',
    password: 'admin123456',
    name: 'Super Admin',
    role: 'super_admin'
  },
  {
    email: 'manager@laxmidev.com',
    password: 'manager123456',
    name: 'Manager',
    role: 'admin'
  }
];

// Default amenities
const defaultAmenities = [
  { name: '24/7 Security', icon: 'security', category: 'security', description: 'Round the clock security services' },
  { name: 'Swimming Pool', icon: 'pool', category: 'recreation', description: 'Modern swimming pool facility' },
  { name: 'Fitness Center', icon: 'fitness', category: 'recreation', description: 'Fully equipped gymnasium' },
  { name: 'Garden Area', icon: 'garden', category: 'landscape', description: 'Beautiful landscaped gardens' },
  { name: 'Parking Space', icon: 'parking', category: 'utilities', description: 'Dedicated parking spaces' },
  { name: 'Children\'s Play Area', icon: 'playground', category: 'recreation', description: 'Safe play area for children' },
  { name: 'Club House', icon: 'clubhouse', category: 'recreation', description: 'Community clubhouse facility' },
  { name: 'Elevator', icon: 'elevator', category: 'utilities', description: 'High-speed elevators' },
  { name: 'WiFi', icon: 'wifi', category: 'utilities', description: 'High-speed internet connectivity' },
  { name: 'Power Backup', icon: 'power', category: 'utilities', description: '24/7 power backup' },
  { name: 'Water Supply', icon: 'water', category: 'utilities', description: '24/7 water supply' },
  { name: 'CCTV Surveillance', icon: 'cctv', category: 'security', description: 'Complete CCTV coverage' }
];

// Default testimonials
const defaultTestimonials = [
  {
    name: 'Rajesh Patel',
    designation: 'Business Owner',
    company: 'Patel Enterprises',
    content: 'Excellent quality construction and timely delivery. Very satisfied with our new home at Laxmi Heights.',
    rating: 5,
    isApproved: true,
    isFeatured: true
  },
  {
    name: 'Priya Sharma',
    designation: 'Software Engineer',
    content: 'Great amenities and perfect location. The team was very professional throughout the process.',
    rating: 5,
    isApproved: true,
    isFeatured: true
  },
  {
    name: 'Amit Desai',
    designation: 'Doctor',
    company: 'City Hospital',
    content: 'Outstanding project with modern facilities. Highly recommend Laxmi Developers.',
    rating: 4,
    isApproved: true,
    isFeatured: false
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    await connectDB();

    // Seed Users
    console.log('👤 Seeding users...');
    for (const userData of defaultUsers) {
      const existingUser = await User.findByEmail(userData.email);
      if (!existingUser) {
        const hashedPassword = await hashPassword(userData.password);
        await User.create({
          ...userData,
          password: hashedPassword
        });
        console.log(`✅ Created user: ${userData.email}`);
      } else {
        console.log(`⏭️  User already exists: ${userData.email}`);
      }
    }

    // Seed Amenities
    console.log('🏠 Seeding amenities...');
    for (const amenityData of defaultAmenities) {
      const existingAmenity = await Amenity.findOne({ name: amenityData.name });
      if (!existingAmenity) {
        await Amenity.create(amenityData);
        console.log(`✅ Created amenity: ${amenityData.name}`);
      } else {
        console.log(`⏭️  Amenity already exists: ${amenityData.name}`);
      }
    }

    // Seed Testimonials
    console.log('💬 Seeding testimonials...');
    for (const testimonialData of defaultTestimonials) {
      const existingTestimonial = await Testimonial.findOne({
        name: testimonialData.name,
        content: testimonialData.content
      });
      if (!existingTestimonial) {
        await Testimonial.create(testimonialData);
        console.log(`✅ Created testimonial: ${testimonialData.name}`);
      } else {
        console.log(`⏭️  Testimonial already exists: ${testimonialData.name}`);
      }
    }

    // Get admin user and amenities for sample projects
    const adminUser = await User.findByEmail('admin@laxmidev.com');
    const amenities = await Amenity.find().limit(6);

    // Seed Sample Projects
    console.log('🏗️  Seeding sample projects...');
    const sampleProjects = [
      {
        title: 'Laxmi Heights',
        type: 'residential',
        status: 'ongoing',
        description: 'Premium residential project offering luxury living spaces designed for modern families. Located in the heart of Vesu, Surat.',
        location: {
          address: 'Vesu Main Road, Vesu',
          city: 'Surat',
          state: 'Gujarat',
          coordinates: { lat: 21.1702, lng: 72.8311 }
        },
        specifications: {
          totalUnits: '64',
          unitTypes: '2BHK, 3BHK',
          unitArea: '625 - 1350 sq.ft.',
          possession: 'December 2025',
          structure: 'RCC Framed Structure',
          flooring: 'Vitrified Tiles'
        },
        reraNumber: 'PR/GJ/SURAT/SURAT CITY/LAXMI/CAA00612/130222',
        contactSales: '+91 9978600222',
        amenities: amenities.map(a => a._id),
        featured: true,
        createdBy: adminUser!._id
      },
      {
        title: 'Laxmi Arcade',
        type: 'commercial',
        status: 'completed',
        description: 'State-of-the-art commercial complex offering premium retail and office spaces. Strategically located on Ring Road, Surat.',
        location: {
          address: 'Ring Road, Adajan',
          city: 'Surat',
          state: 'Gujarat',
          coordinates: { lat: 21.1959, lng: 72.8302 }
        },
        specifications: {
          totalUnits: '32',
          unitTypes: 'Shops, Offices',
          unitArea: '200 - 2500 sq.ft.',
          possession: 'Ready to Move',
          structure: 'RCC Framed Structure',
          flooring: 'Granite/Vitrified Tiles'
        },
        reraNumber: 'PR/GJ/SURAT/SURAT CITY/LAXMI/CAA00498/260621',
        contactSales: '+91 9978600222',
        amenities: amenities.slice(0, 4).map(a => a._id),
        featured: true,
        createdBy: adminUser!._id
      }
    ];

    for (const projectData of sampleProjects) {
      const existingProject = await Project.findOne({ title: projectData.title });
      if (!existingProject) {
        await Project.create(projectData);
        console.log(`✅ Created project: ${projectData.title}`);
      } else {
        console.log(`⏭️  Project already exists: ${projectData.title}`);
      }
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Default Login Credentials:');
    console.log('Super Admin: admin@laxmidev.com / admin123456');
    console.log('Admin: manager@laxmidev.com / manager123456');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;
