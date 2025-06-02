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

// Comprehensive amenities list (50+ options)
const defaultAmenities = [
  // Security & Safety
  { name: '24/7 Security', icon: 'Shield', category: 'security', description: 'Round the clock security services' },
  { name: 'CCTV Surveillance', icon: 'Camera', category: 'security', description: 'Complete CCTV monitoring system' },
  { name: 'Intercom System', icon: 'Phone', category: 'security', description: 'Video door phone system' },
  { name: 'Fire Safety System', icon: 'Flame', category: 'security', description: 'Advanced fire detection and safety' },
  { name: 'Emergency Exit', icon: 'DoorOpen', category: 'security', description: 'Emergency evacuation routes' },
  { name: 'Security Guard', icon: 'UserCheck', category: 'security', description: 'Professional security personnel' },

  // Recreation & Entertainment
  { name: 'Swimming Pool', icon: 'Waves', category: 'recreation', description: 'Modern swimming pool facility' },
  { name: 'Fitness Center', icon: 'Dumbbell', category: 'recreation', description: 'Fully equipped gymnasium' },
  { name: 'Children\'s Play Area', icon: 'Baby', category: 'recreation', description: 'Safe play area for children' },
  { name: 'Club House', icon: 'Home', category: 'recreation', description: 'Community clubhouse facility' },
  { name: 'Indoor Games Room', icon: 'Gamepad2', category: 'recreation', description: 'Indoor gaming and entertainment' },
  { name: 'Outdoor Sports Court', icon: 'Trophy', category: 'recreation', description: 'Basketball/Tennis court' },
  { name: 'Jogging Track', icon: 'Activity', category: 'recreation', description: 'Dedicated jogging and walking track' },
  { name: 'Yoga/Meditation Area', icon: 'Heart', category: 'recreation', description: 'Peaceful yoga and meditation space' },
  { name: 'Party Hall', icon: 'PartyPopper', category: 'recreation', description: 'Community party and event hall' },
  { name: 'Library', icon: 'BookOpen', category: 'recreation', description: 'Community library and reading room' },

  // Landscape & Environment
  { name: 'Garden Area', icon: 'Trees', category: 'landscape', description: 'Beautiful landscaped gardens' },
  { name: 'Terrace Garden', icon: 'Flower', category: 'landscape', description: 'Rooftop terrace garden' },
  { name: 'Water Features', icon: 'Droplets', category: 'landscape', description: 'Decorative water fountains' },
  { name: 'Outdoor Seating', icon: 'Armchair', category: 'landscape', description: 'Garden seating areas' },
  { name: 'Walking Paths', icon: 'Route', category: 'landscape', description: 'Landscaped walking pathways' },

  // Utilities & Infrastructure
  { name: 'Parking Space', icon: 'Car', category: 'utilities', description: 'Dedicated parking spaces' },
  { name: 'Elevator', icon: 'ArrowUpDown', category: 'utilities', description: 'High-speed elevators' },
  { name: 'Power Backup', icon: 'Zap', category: 'utilities', description: '100% power backup facility' },
  { name: 'Water Supply', icon: 'Droplet', category: 'utilities', description: '24/7 water supply system' },
  { name: 'Waste Management', icon: 'Trash2', category: 'utilities', description: 'Modern waste disposal system' },
  { name: 'Rainwater Harvesting', icon: 'CloudRain', category: 'utilities', description: 'Eco-friendly water conservation' },
  { name: 'Solar Panels', icon: 'Sun', category: 'utilities', description: 'Solar energy system' },
  { name: 'Maintenance Service', icon: 'Wrench', category: 'utilities', description: 'Professional maintenance services' },

  // Technology & Connectivity
  { name: 'High-Speed Internet', icon: 'Wifi', category: 'technology', description: 'High-speed WiFi connectivity' },
  { name: 'Smart Home Features', icon: 'Smartphone', category: 'technology', description: 'IoT enabled smart home systems' },
  { name: 'Cable TV Ready', icon: 'Tv', category: 'technology', description: 'Cable TV infrastructure' },
  { name: 'Home Automation', icon: 'Settings', category: 'technology', description: 'Automated lighting and controls' },

  // Convenience & Services
  { name: 'Concierge Service', icon: 'Bell', category: 'convenience', description: 'Professional concierge assistance' },
  { name: 'Housekeeping', icon: 'Sparkles', category: 'convenience', description: 'Professional cleaning services' },
  { name: 'Laundry Service', icon: 'Shirt', category: 'convenience', description: 'On-site laundry facilities' },
  { name: 'ATM/Banking', icon: 'CreditCard', category: 'convenience', description: 'ATM and banking services' },
  { name: 'Shopping Center', icon: 'ShoppingBag', category: 'convenience', description: 'On-site retail shops' },
  { name: 'Medical Center', icon: 'Cross', category: 'convenience', description: 'Medical clinic and pharmacy' },

  // Dining & Food
  { name: 'Restaurant', icon: 'UtensilsCrossed', category: 'dining', description: 'On-site restaurant facility' },
  { name: 'Cafeteria', icon: 'Coffee', category: 'dining', description: 'Community cafeteria' },
  { name: 'Food Court', icon: 'ChefHat', category: 'dining', description: 'Multi-cuisine food court' },
  { name: 'Banquet Hall', icon: 'Utensils', category: 'dining', description: 'Event banquet facilities' },

  // Wellness & Health
  { name: 'Spa & Wellness', icon: 'Sparkle', category: 'wellness', description: 'Spa and wellness center' },
  { name: 'Sauna', icon: 'Thermometer', category: 'wellness', description: 'Sauna and steam room' },
  { name: 'Massage Room', icon: 'Hand', category: 'wellness', description: 'Professional massage services' },
  { name: 'Pharmacy', icon: 'Pill', category: 'wellness', description: 'On-site pharmacy' },

  // Business & Work
  { name: 'Business Center', icon: 'Building', category: 'business', description: 'Professional business facilities' },
  { name: 'Conference Room', icon: 'Users', category: 'business', description: 'Meeting and conference rooms' },
  { name: 'Co-working Space', icon: 'Laptop', category: 'business', description: 'Shared working spaces' },

  // Transportation
  { name: 'Shuttle Service', icon: 'Bus', category: 'transportation', description: 'Complimentary shuttle service' },
  { name: 'Valet Parking', icon: 'KeyRound', category: 'transportation', description: 'Valet parking service' },
  { name: 'EV Charging Station', icon: 'BatteryCharging', category: 'transportation', description: 'Electric vehicle charging' },

  // Additional Amenities
  { name: 'Guest Rooms', icon: 'Bed', category: 'convenience', description: 'Guest accommodation facility' },
  { name: 'Pet Area', icon: 'Dog', category: 'recreation', description: 'Dedicated pet play area' },
  { name: 'Amphitheater', icon: 'Theater', category: 'recreation', description: 'Outdoor amphitheater' },
  { name: 'Mini Theater', icon: 'Film', category: 'recreation', description: 'Private movie screening room' },
  { name: 'Art Gallery', icon: 'Palette', category: 'recreation', description: 'Community art exhibition space' }
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
