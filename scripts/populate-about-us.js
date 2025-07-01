// Script to populate the About Us content in the database
const https = require('https');
const http = require('http');

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;

    const req = client.request(url, {
      method: options.method || 'GET',
      headers: options.headers || {},
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

const aboutUsData = {
  heroSection: {
    tagline: "Laxmi Developers",
    title: "Brick by Brick ",
    titleHighlight: "Building Excellence",
    description: "With over a decade of excellence in real estate development, we transform visions into reality through innovative design and uncompromising quality.",
    buttonText: "Our Projects",
    backgroundImage: "/images/hero/hero-1.jpg"
  },
  companySection: {
    tagline: "Our Story",
    title: "Pioneering Excellence in Real Estate",
    description1: "Excellence in Real Estate Development",
    description2: "Our Foundation",
    image: "/images/homepage/about.jpg"
  },
  missionVisionValues: {
    sectionTagline: "Mission, Vision & Values",
    sectionTitle: "The principles that guide everything we do",
    sectionDescription: "",
    items: [
      {
        title: "Mission",
        description: "To create exceptional living and working spaces that enhance the quality of life for our customers while contributing to sustainable urban development."
      },
      {
        title: "Vision",
        description: "To be the most trusted and innovative real estate developer, setting new standards for quality, design, and customer experience."
      },
      {
        title: "Values",
        description: "Integrity, Innovation, Quality, Customer Focus, and Sustainability drive every decision we make and every project we undertake."
      }
    ]
  },
  portfolioSection: {
    tagline: "Our Work",
    title: "Featured Projects",
    description: "Discover some of our most prestigious developments",
    buttonText: "View All Projects",
    projects: [
      {
        title: "Millennium Park",
        category: "Residential",
        image: "/images/projects/Millennium Park.jpg"
      },
      {
        title: "Business Hub",
        category: "Commercial",
        image: "/images/projects/Millennium Business Hub.jpg"
      },
      {
        title: "Laxmi Nova",
        category: "Residential",
        image: "/images/projects/Laxmi Nova.jpg"
      }
    ]
  },
  ctaSection: {
    title: "Ready to Start Your Journey",
    description: "Let us help you find your perfect space or investment opportunity.",
    primaryButton: {
      text: "Contact Us",
      href: "/contact"
    },
    secondaryButton: {
      text: "View Projects",
      href: "/projects"
    }
  }
};

async function populateAboutUs() {
  try {
    console.log('Updating About Us content with correct data...');

    // First, let's get a token by logging in
    const loginResult = await makeRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@laxmidev.com',
        password: 'admin123456' // You may need to adjust this
      })
    });

    if (!loginResult.success) {
      console.error('❌ Failed to login:', loginResult.error);
      return;
    }

    const token = loginResult.data.token;
    console.log('✅ Logged in successfully');

    const result = await makeRequest('http://localhost:3000/api/about-us', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(aboutUsData)
    });

    if (result.success) {
      console.log('✅ About Us content updated successfully!');
      console.log('Updated data:', JSON.stringify(result.data, null, 2));
    } else {
      console.error('❌ Failed to update content:', result.error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the script
populateAboutUs();
