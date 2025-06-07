const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/laxmidev';

const sampleProjects = [
  {
    title: "Millennium Park",
    slug: "millennium-park",
    type: "residential",
    status: "ongoing",
    description: "Millennium Park is a premium residential project offering luxury living spaces designed for modern families. Located in the heart of Vesu, Surat, these apartments offer a perfect blend of comfort, convenience, and sophisticated living.",
    location: {
      address: "Vesu, Surat",
      city: "Surat",
      state: "Gujarat",
      coordinates: { lat: 21.1702, lng: 72.8311 }
    },
    images: {
      coverImage: "/images/projects/Millennium Park.jpg",
      gallery: {
        promotional: ["/images/projects/Millennium Park.jpg"],
        exterior: [],
        interior: [],
        videos: []
      }
    },
    specifications: {
      totalUnits: "64",
      unitTypes: "1BHK, 2BHK, 3BHK",
      unitArea: "625 - 1350 sq.ft.",
      possession: "December 2025",
      structure: "RCC Framed Structure",
      flooring: "Vitrified Tiles"
    },
    amenities: [],
    featured: true,
    reraNumber: "PR/GJ/SURAT/SURAT CITY/LAXMI/CAA00612/130222",
    brochureUrl: "/brochures/millennium-park.pdf",
    contactSales: "+91 9978600222",
    seoMeta: {
      title: "Millennium Park - Premium Residential Project in Vesu, Surat",
      description: "Discover luxury living at Millennium Park, a premium residential project in Vesu, Surat. Spacious 1BHK, 2BHK & 3BHK apartments with modern amenities.",
      keywords: ["residential", "surat", "vesu", "apartments", "luxury"]
    },
    createdBy: "system",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Millennium Business Hub",
    slug: "millennium-business-hub",
    type: "commercial",
    status: "completed",
    description: "Millennium Business Hub is a state-of-the-art commercial complex offering premium retail and office spaces. Strategically located on Ring Road, Surat, it features modern amenities and excellent connectivity.",
    location: {
      address: "Ring Road, Surat",
      city: "Surat",
      state: "Gujarat",
      coordinates: { lat: 21.1702, lng: 72.8311 }
    },
    images: {
      coverImage: "/images/projects/Millennium Business Hub.jpg",
      gallery: {
        promotional: ["/images/projects/Millennium Business Hub.jpg", "/images/projects/Millennium Business Hub 2.jpg", "/images/projects/Millennium Business Hub 3.jpg"],
        exterior: [],
        interior: [],
        videos: []
      }
    },
    specifications: {
      totalUnits: "32",
      unitTypes: "Shops, Offices",
      unitArea: "200 - 2500 sq.ft.",
      possession: "Ready to Move",
      structure: "RCC Framed Structure",
      flooring: "Granite/Vitrified Tiles"
    },
    amenities: [],
    featured: true,
    reraNumber: "PR/GJ/SURAT/SURAT CITY/LAXMI/CAA00498/260621",
    brochureUrl: "/brochures/millennium-business-hub.pdf",
    contactSales: "+91 9978600222",
    seoMeta: {
      title: "Millennium Business Hub - Commercial Complex in Ring Road, Surat",
      description: "Premium commercial spaces at Millennium Business Hub on Ring Road, Surat. Ideal for retail shops and offices with modern amenities.",
      keywords: ["commercial", "surat", "ring road", "shops", "offices"]
    },
    createdBy: "system",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Laxmi Nova",
    slug: "laxmi-nova",
    type: "residential",
    status: "ongoing",
    description: "Laxmi Nova represents the pinnacle of modern residential living in Surat. This premium project combines contemporary architecture with thoughtful amenities to create an exceptional living experience.",
    location: {
      address: "Adajan, Surat",
      city: "Surat",
      state: "Gujarat",
      coordinates: { lat: 21.1702, lng: 72.8311 }
    },
    images: {
      coverImage: "/images/projects/Laxmi Nova.jpg",
      gallery: {
        promotional: ["/images/projects/Laxmi Nova.jpg"],
        exterior: [],
        interior: [],
        videos: []
      }
    },
    specifications: {
      totalUnits: "48",
      unitTypes: "2BHK, 3BHK",
      unitArea: "850 - 1450 sq.ft.",
      possession: "March 2026",
      structure: "RCC Framed Structure",
      flooring: "Vitrified Tiles"
    },
    amenities: [],
    featured: true,
    reraNumber: "PR/GJ/SURAT/SURAT CITY/LAXMI/CAA00613/140222",
    brochureUrl: "/brochures/laxmi-nova.pdf",
    contactSales: "+91 9978600222",
    seoMeta: {
      title: "Laxmi Nova - Modern Residential Project in Adajan, Surat",
      description: "Experience modern living at Laxmi Nova in Adajan, Surat. Premium 2BHK & 3BHK apartments with contemporary amenities.",
      keywords: ["residential", "surat", "adajan", "apartments", "modern"]
    },
    createdBy: "system",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Millennium City Central",
    slug: "millennium-city-central",
    type: "commercial",
    status: "upcoming",
    description: "Millennium City Central is an upcoming commercial project that will redefine business spaces in Surat. Located in the prime Citylight area, it promises to be a landmark destination for businesses.",
    location: {
      address: "Citylight, Surat",
      city: "Surat",
      state: "Gujarat",
      coordinates: { lat: 21.1702, lng: 72.8311 }
    },
    images: {
      coverImage: "/images/projects/Millennium City Central.jpg",
      gallery: {
        promotional: ["/images/projects/Millennium City Central.jpg"],
        exterior: [],
        interior: [],
        videos: []
      }
    },
    specifications: {
      totalUnits: "40",
      unitTypes: "Retail, Office",
      unitArea: "300 - 3000 sq.ft.",
      possession: "December 2026",
      structure: "RCC Framed Structure",
      flooring: "Premium Granite"
    },
    amenities: [],
    featured: true,
    reraNumber: "PR/GJ/SURAT/SURAT CITY/LAXMI/CAA00614/150222",
    brochureUrl: "/brochures/millennium-city-central.pdf",
    contactSales: "+91 9978600222",
    seoMeta: {
      title: "Millennium City Central - Upcoming Commercial Project in Citylight, Surat",
      description: "Upcoming commercial spaces at Millennium City Central in Citylight, Surat. Premium retail and office spaces coming soon.",
      keywords: ["commercial", "surat", "citylight", "upcoming", "retail", "office"]
    },
    createdBy: "system",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Alexa",
    slug: "alexa",
    type: "residential",
    status: "completed",
    description: "Alexa is a completed residential project that showcases our commitment to quality construction and timely delivery. Located in Piplod, it offers comfortable living spaces with modern amenities.",
    location: {
      address: "Piplod, Surat",
      city: "Surat",
      state: "Gujarat",
      coordinates: { lat: 21.1702, lng: 72.8311 }
    },
    images: {
      coverImage: "/images/projects/Alexa.jpg",
      gallery: {
        promotional: ["/images/projects/Alexa.jpg"],
        exterior: [],
        interior: [],
        videos: []
      }
    },
    specifications: {
      totalUnits: "36",
      unitTypes: "1BHK, 2BHK",
      unitArea: "550 - 950 sq.ft.",
      possession: "Ready to Move",
      structure: "RCC Framed Structure",
      flooring: "Vitrified Tiles"
    },
    amenities: [],
    featured: true,
    reraNumber: "PR/GJ/SURAT/SURAT CITY/LAXMI/CAA00499/270621",
    brochureUrl: "/brochures/alexa.pdf",
    contactSales: "+91 9978600222",
    seoMeta: {
      title: "Alexa - Completed Residential Project in Piplod, Surat",
      description: "Ready to move apartments at Alexa in Piplod, Surat. Quality 1BHK & 2BHK homes with modern amenities.",
      keywords: ["residential", "surat", "piplod", "completed", "ready to move"]
    },
    createdBy: "system",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Millennium Textile Market",
    slug: "millennium-textile-market",
    type: "commercial",
    status: "ongoing",
    description: "Millennium Textile Market is a specialized commercial project designed for the textile industry. Located in Pal, it offers modern infrastructure tailored for textile businesses and traders.",
    location: {
      address: "Pal, Surat",
      city: "Surat",
      state: "Gujarat",
      coordinates: { lat: 21.1702, lng: 72.8311 }
    },
    images: {
      coverImage: "/images/projects/Millennium Textile Market 3.jpg",
      gallery: {
        promotional: ["/images/projects/Millennium Textile Market 3.jpg"],
        exterior: [],
        interior: [],
        videos: []
      }
    },
    specifications: {
      totalUnits: "60",
      unitTypes: "Shops, Showrooms",
      unitArea: "400 - 2000 sq.ft.",
      possession: "June 2025",
      structure: "RCC Framed Structure",
      flooring: "Industrial Grade Flooring"
    },
    amenities: [],
    featured: true,
    reraNumber: "PR/GJ/SURAT/SURAT CITY/LAXMI/CAA00615/160222",
    brochureUrl: "/brochures/millennium-textile-market.pdf",
    contactSales: "+91 9978600222",
    seoMeta: {
      title: "Millennium Textile Market - Commercial Project in Pal, Surat",
      description: "Specialized commercial spaces for textile business at Millennium Textile Market in Pal, Surat. Modern infrastructure for traders.",
      keywords: ["commercial", "surat", "pal", "textile", "market", "shops"]
    },
    createdBy: "system",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedProjects() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const projectsCollection = db.collection('projects');
    
    // Clear existing projects
    await projectsCollection.deleteMany({});
    console.log('Cleared existing projects');
    
    // Insert sample projects
    const result = await projectsCollection.insertMany(sampleProjects);
    console.log(`Inserted ${result.insertedCount} projects`);
    
    console.log('Projects seeded successfully!');
  } catch (error) {
    console.error('Error seeding projects:', error);
  } finally {
    await client.close();
  }
}

seedProjects();
