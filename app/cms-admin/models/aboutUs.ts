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
    tagline: 'Laxmi Developers',
    title: 'Brick by Brick ',
    titleHighlight: 'Building Excellence',
    description: 'With over a decade of excellence in real estate development, we transform visions into reality through innovative design and uncompromising quality.',
    buttonText: 'Our Projects',
    backgroundImage: '/images/hero/hero-1.jpg'
  },
  companySection: {
    tagline: 'Our Story',
    title: 'Pioneering Excellence in Real Estate',
    description1: 'Excellence in Real Estate Development',
    description2: 'Our Foundation',
    image: '/images/homepage/about.jpg'
  },
  missionVisionValues: {
    sectionTagline: 'Mission, Vision & Values',
    sectionTitle: 'The principles that guide everything we do',
    sectionDescription: '',
    items: [
      {
        title: 'Mission',
        description: 'To create exceptional living and working spaces that enhance the quality of life for our customers while contributing to sustainable urban development.'
      },
      {
        title: 'Vision',
        description: 'To be the most trusted and innovative real estate developer, setting new standards for quality, design, and customer experience.'
      },
      {
        title: 'Values',
        description: 'Integrity, Innovation, Quality, Customer Focus, and Sustainability drive every decision we make and every project we undertake.'
      }
    ]
  },
  portfolioSection: {
    tagline: 'Our Work',
    title: 'Featured Projects',
    description: 'Discover some of our most prestigious developments',
    buttonText: 'View All Projects',
    projects: [
      {
        title: 'Millennium Park',
        category: 'Residential',
        image: '/images/projects/Millennium Park.jpg'
      },
      {
        title: 'Business Hub',
        category: 'Commercial',
        image: '/images/projects/Millennium Business Hub.jpg'
      },
      {
        title: 'Laxmi Nova',
        category: 'Residential',
        image: '/images/projects/Laxmi Nova.jpg'
      }
    ]
  },
  ctaSection: {
    title: 'Ready to Start Your Journey?',
    description: 'Let us help you find your perfect space or investment opportunity.',
    primaryButton: {
      text: 'Contact Us',
      href: '/contact'
    },
    secondaryButton: {
      text: 'View Projects',
      href: '/projects'
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