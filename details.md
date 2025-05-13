# Laxmi Developers Website Documentation

## Website Structure Overview

### Global Components
- **Header**: 
  - Logo + Text ("Laxmi Developers")
  - Navigation Menu (Desktop & Mobile)
  - Theme Toggle (Light/Dark Mode)
  - Mobile Menu Toggle

- **Footer**:
  - Company Logo & Contact Information
  - Quick Links
  - Projects Links (Residential & Commercial)
  - Newsletter Subscription Form
  - Trust Badges (RERA & ISO certifications)
  - Copyright Information

### Navigation Menu Structure
1. **Home** (/)
2. **Residential** (/residential)
   - On-Going Projects (/residential/on-going)
   - Completed Projects (/residential/completed)
3. **Commercial** (/commercial)
   - On-Going Projects (/commercial/on-going)
   - Completed Projects (/commercial/completed)
   - Up-Coming Projects (/commercial/upcoming)
4. **About Us** (/about-us)
5. **Why Laxmi?** (/why-laxmi)
6. **Information** (/information)
   - EMI Calculator (/information/emi-calculator)
   - Why Invest? (/information/why-invest)
7. **Contact** (/contact)
8. **Career** (/career)

## Page-by-Page Details

### 1. Home Page (/)
**Sections:**
- **Hero Section**: 
  - Title & Subtitle
  - CTA Buttons
  - Background Images
  
- **Animated Metrics**:
  - Key company statistics with animations
  
- **Why Choose Laxmi Developers?**:
  - Title & Subtitle
  - Feature Grid showcasing company strengths
  
- **Featured Projects**:
  - Title & Subtitle
  - Project cards showcasing portfolio
  - "View All" button linking to /residential
  
- **Testimonials**:
  - Title & Subtitle
  - Marquee-style testimonial slider
  
- **CTA Banner**:
  - Title & Description
  - Buttons: "Explore Projects" & "Contact Us"

### 2. Residential Projects Page (/residential)
**Sections:**
- **Hero Section**:
  - Title: "Residential Projects"
  - Subtitle describing residential offerings
  
- **Ongoing Residential Projects**:
  - Title & Subtitle
  - List of ongoing residential projects
  - Each project has image, title, location, and details
  
- **Completed Residential Projects**:
  - Title & Subtitle
  - List of completed residential projects
  - Each project has image, title, location, and details
  
- **CTA Banner**:
  - Title: "Find Your Dream Home Today"
  - Description
  - Buttons: "Contact Us" & "View Commercial Projects"

### 3. Residential On-Going Projects (/residential/on-going)
**Sections:**
- List of ongoing residential projects
- Each project card has:
  - Project Image
  - Project Name
  - Location
  - Short Description
  - "View Details" button linking to individual project page

### 4. Residential Completed Projects (/residential/completed)
**Sections:**
- List of completed residential projects
- Each project card has:
  - Project Image
  - Project Name
  - Location
  - Short Description
  - "View Details" button linking to individual project page

### 5. Commercial Projects Page (/commercial)
**Sections:**
- **Hero Section**:
  - Title: "Commercial Projects"
  - Subtitle describing commercial offerings
  
- **Ongoing Commercial Projects**:
  - List of ongoing commercial projects
  
- **Completed Commercial Projects**:
  - List of completed commercial projects
  
- **Upcoming Commercial Projects**:
  - List of upcoming commercial projects
  
- **CTA Banner**:
  - Prompting visitors to contact or explore residential projects

### 6. About Us Page (/about-us)
**Sections:**
- Company history and overview
- Vision and mission statements
- Leadership team with profiles
- Company values and philosophy
- Achievements and milestones

### 7. Why Laxmi Page (/why-laxmi)
**Sections:**
- Key differentiation factors
- Quality assurance processes
- Customer testimonials
- Awards and recognitions
- Company strengths and values

### 8. Information Page (/information)
**Sections:**
- Overview of resources
- Links to information subpages

### 9. EMI Calculator (/information/emi-calculator)
**Sections:**
- Interactive EMI calculator tool
- Input fields for loan amount, tenure, interest rate
- Results display showing monthly payment, total interest, etc.
- Information about home loans

### 10. Why Invest (/information/why-invest)
**Sections:**
- Benefits of real estate investment
- Market analysis and trends
- Investment opportunities
- ROI calculations and examples

### 11. Contact Page (/contact)
**Sections:**
- Contact information:
  - Office address
  - Phone numbers
  - Email addresses
  - Business hours
- Contact form
- Google Maps embed
- Frequently asked questions

### 12. Career Page (/career)
**Sections:**
- Current job openings
- Company culture information
- Benefits of working at Laxmi Developers
- Application process details
- Contact for career inquiries

## Individual Project Page Template
Each project (whether residential or commercial) has its own dedicated page with:

**Sections:**
- **Hero Section**:
  - Project name
  - Location
  
- **Project Details**:
  - Overview
  - Features and specifications
  - Floor plans
  - Gallery
  - Location advantages
  - Amenities and facilities
  
- **Brochure Download Section**:
  - Form to capture user details
  - Download button for project brochure
  
- **CTA Section**:
  - "Contact for site visit" or inquiry form

## Reusable Components
- **AmenitiesFeatures**: Displays property amenities and features
- **BrochureDownloadForm**: Form to capture user information before brochure download
- **ProjectBrochureSection**: Section promoting brochure download
- **FeaturedProjects**: Grid display of featured projects
- **TestimonialMarquee**: Scrolling display of customer testimonials
- **CtaBanner**: Call-to-action section with buttons
- **AnimatedMetrics**: Animated statistics display
- **FeatureGrid**: Grid layout for displaying company features

## Color Scheme & Branding
- **Dark Theme (Default)**:
  - Primary color: Dark themed background (#1f2d3d)
  - Foreground text: Light color (#f5f5f5)
  
- **Light Theme**:
  - Primary color: White background (#ffffff)
  - Foreground text: Dark color (#1f2937)

- **Common Elements**:
  - Highlight/Accent color: #be9e67 (Gold)
  - Font families:
    - Display font for headings (Playfair Display)
    - System font for body text (Poppins)

## Technical Implementation
- Built with Next.js (App Router)
- Tailwind CSS for styling
- Dark/Light theme toggle with persistent state
- Responsive design for mobile and desktop
- Data stored in structured format in the /data directory
- TypeScript for type safety

## Theme System
- **Theme Context**: Provides theme state and toggle functionality
- **Theme Toggle**: Button in header to switch between light and dark modes
- **Local Storage**: Persists user theme preference
- **Animation**: Smooth transitions between themes
- **Consistent Styling**: Both themes maintain professional, clean aesthetics
