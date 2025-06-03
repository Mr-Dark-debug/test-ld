// About Us page content model

export interface AboutUsContent {
  heroSection: {
    tagline: string
    title: string
    titleHighlight: string
    description: string
    buttonText: string
    backgroundImage: string
  }
  companySection: {
    tagline: string
    title: string
    description1: string
    description2: string
    image: string
  }
  missionVisionValues: {
    sectionTagline: string
    sectionTitle: string
    sectionDescription: string
    items: {
      title: string
      description: string
    }[]
  }
  achievementsSection: {
    sectionTagline: string
    sectionTitle: string
    sectionDescription: string
    achievements: {
      title: string
      description: string
      image: string
      year: string
    }[]
  }
  portfolioSection: {
    tagline: string
    title: string
    description: string
    buttonText: string
    projects: {
      title: string
      category: string
      image: string
    }[]
  }
  ctaSection: {
    title: string
    description: string
    primaryButton: {
      text: string
      href: string
    }
    secondaryButton: {
      text: string
      href: string
    }
  }
}

// Default content for the About Us page
export const defaultAboutUsContent: AboutUsContent = {
  heroSection: {
    tagline: 'Everything about us at Laxmi Developers 👋',
    title: 'Brick by Brick ',
    titleHighlight: 'Building Excellence',
    description: 'Laxmi Developers - Creating exceptional living and commercial spaces in Surat since 1995.',
    buttonText: 'Explore Careers →',
    backgroundImage: '/images/hero/hero-1.jpg'
  },
  companySection: {
    tagline: 'Our Story',
    title: "We're Building Landmarks That Define Surat's Skyline",
    description1: 'For over 25 years, Laxmi Developers has been crafting exceptional residential and commercial spaces that blend innovative design with superior construction quality.',
    description2: 'We take pride in our attention to detail, commitment to timely delivery, and creating spaces that enhance the quality of life for our customers.',
    image: '/images/homepage/about.jpg'
  },
  missionVisionValues: {
    sectionTagline: 'Our Principles',
    sectionTitle: 'Guided by Strong Principles',
    sectionDescription: 'Our core values that drive everything we do',
    items: [
      {
        title: 'Our Mission',
        description: 'Creating exceptional living spaces that enrich lives while maintaining the highest standards of quality and sustainability.'
      },
      {
        title: 'Our Vision',
        description: "To be recognized as Surat's premier developer, known for innovative design and properties that stand the test of time."
      },
      {
        title: 'Our Values',
        description: 'Integrity, excellence, customer focus, innovation, sustainability, and community engagement form our foundation.'
      }
    ]
  },
  achievementsSection: {
    sectionTagline: 'Our Recognition',
    sectionTitle: 'Awards & Achievements',
    sectionDescription: 'Recognition for our commitment to excellence and innovation in real estate development',
    achievements: [
      {
        title: 'Best Developer Award 2023',
        description: 'Recognized for outstanding contribution to residential development in Surat',
        image: '/images/awards/award-1.jpg',
        year: '2023'
      }
    ]
  },
  portfolioSection: {
    tagline: 'Our Portfolio',
    title: 'Our Landmark Projects',
    description: 'A showcase of our diverse real estate portfolio',
    buttonText: 'View All Projects',
    projects: [
      {
        title: 'Laxmi Villa Township',
        category: 'Residential Project',
        image: '/images/projects/Millennium Park.jpg'
      },
      {
        title: 'Millennium Textile Market',
        category: 'Commercial Project',
        image: '/images/projects/Millennium Textile Market 3.jpg'
      },
      {
        title: 'Laxmi Enclave',
        category: 'Residential Complex',
        image: '/images/projects/Laxmi Nova.jpg'
      }
    ]
  },
  ctaSection: {
    title: 'Ready to Work With Us?',
    description: 'Explore our projects or get in touch to discuss your real estate needs.',
    primaryButton: {
      text: 'Explore Projects',
      href: '/projects'
    },
    secondaryButton: {
      text: 'Contact Us',
      href: '/contact'
    }
  }
}

// In a real application, you would implement functions to save and retrieve the content
// from a database or API. For now, we'll use localStorage in the browser.

export const getAboutUsContent = async (): Promise<AboutUsContent> => {
  if (typeof window === 'undefined') {
    return defaultAboutUsContent
  }
  
  const savedContent = localStorage.getItem('aboutUsContent')
  if (!savedContent) {
    return defaultAboutUsContent
  }
  
  try {
    return JSON.parse(savedContent) as AboutUsContent
  } catch (error) {
    console.error('Error parsing saved content:', error)
    return defaultAboutUsContent
  }
}

export const saveAboutUsContent = async (content: AboutUsContent): Promise<void> => {
  if (typeof window === 'undefined') {
    return
  }
  
  try {
    localStorage.setItem('aboutUsContent', JSON.stringify(content))
  } catch (error) {
    console.error('Error saving content:', error)
    throw new Error('Failed to save content')
  }
}