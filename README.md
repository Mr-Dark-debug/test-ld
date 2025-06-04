# 🏢 Laxmi Developers - Enterprise Real Estate CMS

A comprehensive, enterprise-grade real estate content management system built with Next.js 15, TypeScript, and MongoDB. This platform provides a complete solution for real estate companies to manage properties, leads, testimonials, blogs, user management, and comprehensive analytics with role-based access control.

## 🌟 Key Features

### 🏢 **Advanced Property Management**
- **Multi-Type Properties**: Residential, commercial, luxury, and affordable housing projects
- **Rich Media Support**: Multiple image galleries, videos, brochures, and virtual tours
- **Comprehensive Details**: Pricing, amenities, specifications, floor plans, and location maps
- **Status Tracking**: Upcoming, ongoing, completed, and sold-out status management
- **Featured Properties**: Highlight premium properties with advanced filtering
- **SEO Optimization**: Meta tags, structured data, and search engine optimization

### 👥 **Intelligent Lead Management**
- **Multi-Channel Lead Capture**: Contact forms, brochure requests, phone inquiries
- **Lead Scoring**: Automatic lead qualification and scoring system
- **Follow-up Tracking**: Comprehensive lead nurturing and follow-up management
- **Real-time Analytics**: Lead conversion rates, source tracking, and performance metrics
- **CRM Integration**: Complete customer relationship management workflow
- **Automated Notifications**: Email and SMS notifications for new leads

### 💬 **Advanced Testimonials System**
- **Multi-Media Reviews**: Text, images, and video testimonials
- **5-Star Rating System**: Detailed rating with category-wise feedback
- **Approval Workflow**: Multi-level approval process with moderation
- **Featured Testimonials**: Showcase best reviews with carousel display
- **YouTube Integration**: Embed YouTube testimonial videos
- **Verification System**: Verified customer badge system

### 📝 **Professional Blog Management**
- **Rich Content Editor**: Advanced WYSIWYG editor with media support
- **SEO Optimization**: Meta tags, descriptions, canonical URLs, and sitemap
- **Category & Tag System**: Hierarchical organization with filtering
- **Publishing Workflow**: Draft → Review → Publish workflow with scheduling
- **Author Management**: Multi-author support with bylines and profiles
- **Social Media Integration**: Auto-sharing to social platforms

### 🔐 **Enterprise User Management & Security**
- **4-Tier Role System**: Super Admin, Admin, Editor, and User roles
- **Granular Permissions**: Feature-level access control and restrictions
- **Role Hierarchy Protection**: Secure role-based modification restrictions
- **JWT Authentication**: Secure token-based authentication system
- **Activity Logging**: Comprehensive audit trail for all user actions
- **Session Management**: Secure session handling with automatic logout

### 📊 **Real-Time Analytics & Reporting**
- **Live Dashboard**: Real-time statistics and key performance indicators
- **Lead Analytics**: Conversion funnels, source analysis, and ROI tracking
- **User Activity**: Detailed user behavior and system usage analytics
- **Performance Metrics**: System performance, API response times, and uptime
- **Custom Reports**: Exportable reports with date range filtering
- **Visual Charts**: Interactive charts and graphs for data visualization

### 🎨 **Modern UI/UX Design**
- **Responsive Design**: Mobile-first approach with cross-device compatibility
- **Professional Interface**: Clean, intuitive admin panel with modern design
- **Accessibility**: WCAG 2.1 AA compliant with screen reader support
- **Performance Optimized**: Fast loading times with optimized assets
- **Progressive Web App**: PWA capabilities for mobile app-like experience

## 🛠️ Technology Stack

### **Frontend Technologies**
- **Next.js 15**: Latest React framework with App Router and Server Components
- **TypeScript**: Full type safety with strict mode enabled
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Modern, customizable icon library
- **React Hook Form**: Performant form handling with validation
- **Framer Motion**: Smooth animations and transitions
- **React Query**: Server state management and caching

### **Backend Technologies**
- **Next.js API Routes**: Serverless API endpoints with middleware support
- **MongoDB Atlas**: Cloud-hosted NoSQL database with clustering
- **Mongoose ODM**: Object Document Mapping with schema validation
- **JWT**: JSON Web Tokens for stateless authentication
- **Bcrypt**: Industry-standard password hashing
- **Multer**: File upload handling with validation
- **Rate Limiting**: API rate limiting and DDoS protection

### **Development & Deployment**
- **ESLint**: Code linting with custom rules
- **Prettier**: Consistent code formatting
- **Husky**: Git hooks for pre-commit validation
- **TypeScript**: Static type checking and IntelliSense
- **Vercel**: Optimized deployment platform
- **GitHub Actions**: CI/CD pipeline automation

## 🔐 Role-Based Access Control

### **Super Admin** (`super_admin`)
- ✅ **Full System Access**: Complete control over all features and settings
- ✅ **User Management**: Create, edit, delete any user including other admins
- ✅ **Role Assignment**: Can assign any role including super admin
- ✅ **System Configuration**: Access to all system settings and configurations
- ✅ **Data Management**: Full CRUD access to all data types
- 🛡️ **Protection**: Cannot be deleted or modified by other roles

### **Admin** (`admin`)
- ✅ **User Management**: Create, edit users (except super admin)
- ✅ **Content Management**: Full access to projects, blogs, testimonials
- ✅ **Lead Management**: Complete lead management and analytics
- ✅ **Role Assignment**: Can assign user, editor, admin roles (not super admin)
- ❌ **Restrictions**: Cannot modify super admin users or system-critical settings

### **Editor** (`editor`)
- ✅ **Content Management**: Create, edit, delete projects, blogs, testimonials
- ✅ **Page Management**: Manage about, contact, careers, awards pages
- ✅ **Activity Viewing**: View activity logs and system activities
- ❌ **Restrictions**: No user management or lead access

### **User** (`user`)
- ✅ **Personal Dashboard**: Access to personal dashboard and profile
- ✅ **Basic Settings**: Manage personal account settings
- ❌ **Restrictions**: No access to admin features, content management, or user management

## 📦 Installation & Setup

### **Prerequisites**
- Node.js 18+ (LTS recommended)
- MongoDB Atlas account or local MongoDB installation
- Git for version control
- npm or yarn package manager

### **1. Clone Repository**
```bash
git clone https://github.com/your-username/laxmidev.git
cd laxmidev
```

### **2. Install Dependencies**
```bash
npm install
# or
yarn install
```

### **3. Environment Configuration**
Copy the example environment file and configure:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# MongoDB Configuration
MONGODB_USERNAME="your_mongodb_username"
MONGODB_PASSWORD="your_mongodb_password"
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/realestate_cms?retryWrites=true&w=majority"

# JWT Configuration
JWT_SECRET="your_super_secret_jwt_key_here_minimum_32_characters"
JWT_EXPIRES_IN="24h"

# Server Configuration
NODE_ENV="development"
PORT=3000

# File Upload Configuration
MAX_FILE_SIZE=50000000
UPLOAD_PATH="public/uploads"

# Frontend API Configuration
NEXT_PUBLIC_API_URL="/api"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Production Configuration (Update for production)
# NEXT_PUBLIC_BASE_URL="https://your-domain.com"
# NODE_ENV="production"
```

### **4. Database Setup**
The application will automatically create the necessary collections and indexes on first run.

### **5. Run Development Server**
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to see the application.

### **6. Access Admin Panel**
Navigate to `http://localhost:3000/cms-admin` and login with default credentials:

**Default Login Credentials:**
- **Super Admin**: `admin@laxmidev.com` / `admin123456`
- **Admin**: `manager@laxmidev.com` / `manager123456`

⚠️ **Important**: Change these credentials immediately in production!

## 🚀 Production Deployment Checklist

### **Pre-Deployment Checklist**
- [ ] **Environment Variables**: All production environment variables configured
- [ ] **Database**: MongoDB Atlas cluster set up with proper authentication
- [ ] **Security**: Strong JWT secret generated (minimum 32 characters)
- [ ] **Domain**: Custom domain configured and DNS records set
- [ ] **SSL**: HTTPS certificate configured
- [ ] **Admin Credentials**: Default admin passwords changed
- [ ] **File Uploads**: Upload directory and permissions configured
- [ ] **Error Handling**: Error tracking service integrated (optional)

### **Post-Deployment Checklist**
- [ ] **Functionality**: All major features tested in production
- [ ] **Authentication**: Login/logout working correctly
- [ ] **API Endpoints**: All API routes responding correctly
- [ ] **File Uploads**: Image and document uploads working
- [ ] **Database**: Data persistence and retrieval working
- [ ] **Performance**: Page load times acceptable
- [ ] **Mobile**: Responsive design working on mobile devices
- [ ] **SEO**: Meta tags and sitemap configured
- [ ] **Analytics**: Tracking and monitoring set up
- [ ] **Backup**: Database backup strategy implemented

### **Environment Variables Checklist**
```env
# Required for Production
✅ MONGODB_URI="mongodb+srv://..."
✅ JWT_SECRET="your_32_character_secret"
✅ NEXT_PUBLIC_BASE_URL="https://your-domain.com"
✅ NODE_ENV="production"

# Optional but Recommended
✅ MAX_FILE_SIZE=50000000
✅ UPLOAD_PATH="public/uploads"
✅ JWT_EXPIRES_IN="24h"
✅ PORT=3000
```

## 🚀 Production Deployment

### **Environment Variables for Production**
Update your `.env` file for production:
```env
NODE_ENV="production"
NEXT_PUBLIC_BASE_URL="https://your-domain.com"
MONGODB_URI="your_production_mongodb_uri"
JWT_SECRET="your_production_jwt_secret_minimum_32_characters"
```

### **Deployment Platforms**

#### **Vercel (Recommended)**
1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Environment Variables**: Add all environment variables in Vercel dashboard:
   ```
   MONGODB_URI=your_production_mongodb_uri
   JWT_SECRET=your_production_jwt_secret_minimum_32_characters
   NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
   NODE_ENV=production
   ```
3. **Deploy**: Automatic deployment on push to main branch
4. **Custom Domain**: Configure custom domain in Vercel settings

#### **Netlify**
1. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
2. **Environment Variables**: Add in Netlify dashboard
3. **Functions**: Enable Next.js runtime for API routes

#### **Railway**
1. **Connect Repository**: Link GitHub repository
2. **Environment Variables**: Set in Railway dashboard
3. **Custom Domain**: Configure domain in Railway settings
4. **Database**: Use Railway's MongoDB addon or external MongoDB Atlas

#### **DigitalOcean App Platform**
1. **App Spec Configuration**:
   ```yaml
   name: laxmidev-cms
   services:
   - name: web
     source_dir: /
     github:
       repo: your-username/laxmidev
       branch: main
     run_command: npm start
     build_command: npm run build
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: NODE_ENV
       value: production
     - key: NEXT_PUBLIC_BASE_URL
       value: https://your-app.ondigitalocean.app
   ```

#### **AWS Amplify**
1. **Build Configuration** (`amplify.yml`):
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```
2. **Environment Variables**: Set in Amplify console
3. **Custom Domain**: Configure in Amplify domain management

#### **Self-Hosted (VPS/Dedicated Server)**
1. **Server Setup**:
   ```bash
   # Install Node.js 18+
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2 for process management
   npm install -g pm2

   # Clone and setup project
   git clone https://github.com/your-username/laxmidev.git
   cd laxmidev
   npm install
   npm run build
   ```

2. **PM2 Configuration** (`ecosystem.config.js`):
   ```javascript
   module.exports = {
     apps: [{
       name: 'laxmidev-cms',
       script: 'npm',
       args: 'start',
       env: {
         NODE_ENV: 'production',
         PORT: 3000,
         NEXT_PUBLIC_BASE_URL: 'https://your-domain.com'
       }
     }]
   };
   ```

3. **Start Application**:
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

4. **Nginx Configuration**:
   ```nginx
   server {
     listen 80;
     server_name your-domain.com;

     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

### **Build Commands**
```bash
# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npm run type-check
```

### **Security Considerations for Production**

#### **Environment Variables Security**
- ✅ **Never commit `.env` files** to version control
- ✅ **Use strong JWT secrets** (minimum 32 characters, random)
- ✅ **Rotate secrets regularly** in production
- ✅ **Use different secrets** for different environments

#### **Database Security**
- ✅ **Enable MongoDB authentication** and use strong passwords
- ✅ **Use MongoDB Atlas** with IP whitelisting for cloud deployment
- ✅ **Enable SSL/TLS** for database connections
- ✅ **Regular database backups** and disaster recovery plan

#### **Application Security**
- ✅ **Change default admin credentials** immediately
- ✅ **Implement rate limiting** for API endpoints (already configured)
- ✅ **Use HTTPS** in production (SSL/TLS certificates)
- ✅ **Enable CORS** properly for your domain
- ✅ **Regular security updates** for dependencies

#### **File Upload Security**
- ✅ **File type validation** (already implemented)
- ✅ **File size limits** (configurable via MAX_FILE_SIZE)
- ✅ **Virus scanning** for uploaded files (recommended)
- ✅ **CDN integration** for file serving (recommended)

#### **Monitoring & Logging**
- ✅ **Error tracking** (Sentry, LogRocket, etc.)
- ✅ **Performance monitoring** (New Relic, DataDog, etc.)
- ✅ **Uptime monitoring** (Pingdom, UptimeRobot, etc.)
- ✅ **Activity logs** (already implemented in the system)

## 📊 API Documentation

### **Authentication Endpoints**
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### **Project Management**
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Get project by ID
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### **Lead Management**
- `GET /api/leads` - Get all leads
- `POST /api/leads/contact` - Submit contact form
- `POST /api/leads/brochure` - Request brochure
- `PUT /api/leads/[id]` - Update lead status

### **User Management**
- `GET /api/users/manage` - Get all users (Admin+)
- `POST /api/users/manage` - Create new user (Admin+)
- `PUT /api/users/manage/[id]` - Update user (Admin+)
- `DELETE /api/users/manage/[id]` - Delete user (Super Admin only)

### **Activity Logs**
- `GET /api/activities` - Get activity logs
- `POST /api/activities` - Create activity log

## 🔧 Configuration

### **Environment Variables Reference**
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | Yes | - |
| `JWT_EXPIRES_IN` | JWT token expiration | No | `24h` |
| `NODE_ENV` | Environment mode | No | `development` |
| `PORT` | Server port | No | `3000` |
| `MAX_FILE_SIZE` | Max upload file size in bytes | No | `50000000` |
| `UPLOAD_PATH` | File upload directory | No | `public/uploads` |
| `NEXT_PUBLIC_API_URL` | Frontend API base URL | No | `/api` |
| `NEXT_PUBLIC_BASE_URL` | Frontend base URL | Yes | `http://localhost:3000` |

### **Database Collections**
- `users` - User accounts and authentication
- `projects` - Real estate projects and properties
- `leads` - Customer inquiries and lead data
- `testimonials` - Customer reviews and testimonials
- `blogs` - Blog posts and content
- `activities` - System activity logs
- `pages` - Dynamic page content

## 🧪 Testing

### **Run Tests**
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### **Test Structure**
- Unit tests for utilities and helpers
- Integration tests for API endpoints
- Component tests for React components
- End-to-end tests for critical user flows

## 📁 Detailed Project Structure

```
laxmidev/
├── 📁 app/                          # Next.js 15 App Router
│   ├── 📁 api/                      # RESTful API Endpoints
│   │   ├── 📁 auth/                 # Authentication & Authorization
│   │   │   ├── login/route.ts       # User login endpoint
│   │   │   ├── logout/route.ts      # User logout endpoint
│   │   │   ├── me/route.ts          # Current user profile
│   │   │   └── profile/route.ts     # Profile management
│   │   ├── 📁 projects/             # Property Management APIs
│   │   │   ├── route.ts             # CRUD operations
│   │   │   ├── [id]/route.ts        # Individual project operations
│   │   │   └── featured/route.ts    # Featured projects
│   │   ├── 📁 leads/                # Lead Management System
│   │   │   ├── route.ts             # Lead CRUD operations
│   │   │   ├── contact/route.ts     # Contact form submissions
│   │   │   ├── brochure/route.ts    # Brochure requests
│   │   │   └── [id]/route.ts        # Individual lead management
│   │   ├── 📁 testimonials/         # Testimonial Management
│   │   │   ├── route.ts             # Testimonial CRUD
│   │   │   ├── [id]/route.ts        # Individual testimonial ops
│   │   │   └── featured/route.ts    # Featured testimonials
│   │   ├── 📁 blogs/                # Blog Management System
│   │   │   ├── route.ts             # Blog CRUD operations
│   │   │   ├── [slug]/route.ts      # Blog by slug
│   │   │   └── categories/route.ts  # Category management
│   │   ├── 📁 users/                # User Management APIs
│   │   │   ├── manage/              # Admin user management
│   │   │   │   ├── route.ts         # User CRUD operations
│   │   │   │   └── [id]/route.ts    # Individual user management
│   │   │   └── profile/route.ts     # User profile management
│   │   ├── 📁 activities/           # Activity Logging System
│   │   │   ├── route.ts             # Activity log CRUD
│   │   │   └── [id]/route.ts        # Individual activity details
│   │   ├── 📁 dashboard/            # Analytics & Dashboard APIs
│   │   │   ├── stats/route.ts       # Dashboard statistics
│   │   │   ├── analytics/route.ts   # Advanced analytics
│   │   │   └── reports/route.ts     # Custom reports
│   │   ├── 📁 upload/               # File Upload Management
│   │   │   └── route.ts             # File upload handling
│   │   └── 📁 pages/                # Dynamic Page Management
│   │       ├── about/route.ts       # About page content
│   │       ├── contact/route.ts     # Contact page content
│   │       └── careers/route.ts     # Careers page content
│   ├── 📁 cms-admin/                # Admin Panel Interface
│   │   ├── 📁 components/           # Admin-specific Components
│   │   │   ├── Header.tsx           # Admin header with navigation
│   │   │   ├── Sidebar.tsx          # Role-based sidebar navigation
│   │   │   ├── StatsCard.tsx        # Dashboard statistics cards
│   │   │   ├── RecentActivity.tsx   # Recent activity component
│   │   │   ├── LeadChart.tsx        # Lead analytics charts
│   │   │   └── UserManagement.tsx   # User management interface
│   │   ├── 📁 dashboard/            # Dashboard Pages
│   │   │   ├── page.tsx             # Main dashboard overview
│   │   │   ├── 📁 projects/         # Project Management Interface
│   │   │   │   ├── page.tsx         # Project listing page
│   │   │   │   ├── create/page.tsx  # Create new project
│   │   │   │   └── [id]/page.tsx    # Edit project page
│   │   │   ├── 📁 leads/            # Lead Management Interface
│   │   │   │   ├── page.tsx         # Lead dashboard
│   │   │   │   ├── contact/page.tsx # Contact inquiries
│   │   │   │   ├── brochure/page.tsx# Brochure requests
│   │   │   │   └── [id]/page.tsx    # Individual lead details
│   │   │   ├── 📁 testimonials/     # Testimonial Management
│   │   │   │   ├── page.tsx         # Testimonial listing
│   │   │   │   ├── create/page.tsx  # Add new testimonial
│   │   │   │   └── [id]/page.tsx    # Edit testimonial
│   │   │   ├── 📁 blogs/            # Blog Management Interface
│   │   │   │   ├── page.tsx         # Blog listing
│   │   │   │   ├── create/page.tsx  # Create new blog post
│   │   │   │   └── [id]/page.tsx    # Edit blog post
│   │   │   ├── 📁 users/            # User Management Interface
│   │   │   │   ├── page.tsx         # User listing (Admin+)
│   │   │   │   ├── create/page.tsx  # Create new user (Admin+)
│   │   │   │   └── [id]/page.tsx    # Edit user details
│   │   │   ├── 📁 activity/         # Activity Logs Interface
│   │   │   │   └── page.tsx         # Activity log viewer
│   │   │   ├── 📁 settings/         # System Settings
│   │   │   │   └── page.tsx         # System configuration
│   │   │   └── 📁 pages/            # Page Content Management
│   │   │       ├── about/page.tsx   # About page editor
│   │   │       ├── contact/page.tsx # Contact page editor
│   │   │       ├── careers/page.tsx # Careers page editor
│   │   │       └── awards/page.tsx  # Awards page editor
│   │   └── layout.tsx               # Admin panel layout
│   ├── 📁 projects/                 # Public Project Pages
│   │   ├── page.tsx                 # Project listing page
│   │   └── [slug]/page.tsx          # Individual project details
│   ├── 📁 blogs/                    # Public Blog Pages
│   │   ├── page.tsx                 # Blog listing page
│   │   └── [slug]/page.tsx          # Individual blog post
│   ├── 📁 about/                    # About Page
│   │   └── page.tsx                 # About us page
│   ├── 📁 contact/                  # Contact Page
│   │   └── page.tsx                 # Contact us page
│   ├── 📁 careers/                  # Careers Page
│   │   └── page.tsx                 # Careers and job listings
│   ├── 📁 awards/                   # Awards Page
│   │   └── page.tsx                 # Awards and recognition
│   ├── layout.tsx                   # Root application layout
│   ├── page.tsx                     # Homepage
│   ├── loading.tsx                  # Global loading component
│   ├── error.tsx                    # Global error boundary
│   └── not-found.tsx                # 404 page
├── 📁 components/                   # Reusable UI Components
│   ├── 📁 ui/                       # Base UI Components
│   │   ├── Button.tsx               # Customizable button component
│   │   ├── Input.tsx                # Form input component
│   │   ├── Card.tsx                 # Card container component
│   │   ├── Modal.tsx                # Modal dialog component
│   │   ├── Dropdown.tsx             # Dropdown menu component
│   │   └── Badge.tsx                # Badge/tag component
│   ├── 📁 sections/                 # Page Section Components
│   │   ├── Hero.tsx                 # Homepage hero section
│   │   ├── FeaturedProjects.tsx     # Featured properties section
│   │   ├── Testimonials.tsx         # Customer testimonials
│   │   ├── ContactInfo.tsx          # Contact information section
│   │   └── Footer.tsx               # Website footer
│   ├── 📁 forms/                    # Form Components
│   │   ├── ContactForm.tsx          # Contact inquiry form
│   │   ├── BrochureForm.tsx         # Brochure request form
│   │   ├── TestimonialForm.tsx      # Testimonial submission form
│   │   └── LoginForm.tsx            # User login form
│   └── 📁 layout/                   # Layout Components
│       ├── Header.tsx               # Main website header
│       ├── Navigation.tsx           # Main navigation menu
│       └── Breadcrumb.tsx           # Breadcrumb navigation
├── 📁 lib/                          # Utility Libraries & Configuration
│   ├── api.ts                       # Frontend API client utilities
│   ├── config.ts                    # Environment configuration management
│   ├── db.ts                        # MongoDB connection and utilities
│   ├── auth.ts                      # Authentication utilities and helpers
│   ├── validation.ts                # Input validation schemas and rules
│   ├── utils.ts                     # General utility functions
│   ├── performance.ts               # Performance optimization utilities
│   ├── activity.ts                  # Activity logging utilities
│   └── email.ts                     # Email notification utilities
├── 📁 models/                       # MongoDB Data Models
│   ├── User.ts                      # User account model with roles
│   ├── Project.ts                   # Real estate project model
│   ├── Lead.ts                      # Lead and inquiry model
│   ├── Testimonial.ts               # Customer testimonial model
│   ├── Blog.ts                      # Blog post model
│   ├── Activity.ts                  # System activity log model
│   └── Page.ts                      # Dynamic page content model
├── 📁 middleware/                   # Custom Middleware Functions
│   ├── auth.ts                      # Authentication and authorization
│   ├── cors.ts                      # Cross-origin resource sharing
│   ├── validation.ts                # Request validation middleware
│   ├── rateLimit.ts                 # API rate limiting
│   └── errorHandling.ts             # Global error handling
├── 📁 contexts/                     # React Context Providers
│   ├── AuthContext.tsx              # Authentication state management
│   ├── ThemeContext.tsx             # Theme and UI preferences
│   └── NotificationContext.tsx      # Global notifications
├── 📁 hooks/                        # Custom React Hooks
│   ├── useAuth.ts                   # Authentication hook
│   ├── useApi.ts                    # API request hook
│   ├── useLocalStorage.ts           # Local storage hook
│   ├── useDebounce.ts               # Debouncing hook
│   └── useActivities.ts             # Activity logging hook
├── 📁 types/                        # TypeScript Type Definitions
│   ├── auth.ts                      # Authentication types
│   ├── api.ts                       # API response types
│   ├── models.ts                    # Database model types
│   └── global.ts                    # Global type definitions
├── 📁 public/                       # Static Assets
│   ├── 📁 images/                   # Image assets and icons
│   │   ├── logo.png                 # Company logo
│   │   ├── hero-bg.jpg              # Hero background image
│   │   └── placeholder.jpg          # Placeholder images
│   ├── 📁 uploads/                  # User uploaded files
│   │   ├── projects/                # Project images and documents
│   │   ├── testimonials/            # Testimonial media
│   │   └── blogs/                   # Blog post media
│   ├── favicon.ico                  # Website favicon
│   ├── robots.txt                   # Search engine robots file
│   └── sitemap.xml                  # XML sitemap
├── 📄 .env.example                  # Environment variables template
├── 📄 .env                          # Environment variables (local)
├── 📄 .gitignore                    # Git ignore rules
├── 📄 package.json                  # Dependencies and npm scripts
├── 📄 package-lock.json             # Locked dependency versions
├── 📄 tailwind.config.js            # Tailwind CSS configuration
├── 📄 tsconfig.json                 # TypeScript configuration
├── 📄 next.config.js                # Next.js configuration
├── 📄 middleware.ts                 # Next.js middleware
└── 📄 README.md                     # Project documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**
- Follow TypeScript strict mode
- Use ESLint and Prettier for code formatting
- Write tests for new features
- Update documentation for API changes
- Follow conventional commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- 📧 Email: support@laxmidev.com
- 📞 Phone: +91-XXXXXXXXXX
- 🌐 Website: https://laxmidev.com

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB team for the robust database
- Tailwind CSS for the utility-first CSS framework
- All contributors and the open-source community
