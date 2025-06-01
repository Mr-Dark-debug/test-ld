# 🏗️ Laxmi Developers - Real Estate CMS

A comprehensive real estate content management system built with Next.js 15, MongoDB, and TypeScript. This project provides a complete solution for managing real estate projects, testimonials, blogs, and leads with a modern admin dashboard.

## 🌟 Features

### 🏠 **Project Management**
- Complete CRUD operations for residential and commercial projects
- Image gallery management with multiple categories
- Floor plan uploads and management
- RERA compliance with QR code integration
- Location mapping with coordinates
- Amenities association and management

### 👥 **User Management**
- Role-based authentication (Super Admin, Admin, Editor)
- JWT-based secure authentication
- User profile management
- Activity tracking

### 💬 **Testimonials System**
- Customer testimonial collection
- Approval workflow for testimonials
- Featured testimonials highlighting
- Rating system integration

### 📝 **Blog Management**
- Rich content blog posts
- Draft, scheduled, and published states
- SEO optimization features
- Category and tag management

### 📊 **Lead Management**
- Contact form submissions tracking
- Brochure download requests
- Lead status management
- Analytics and reporting

### 🎨 **Modern UI/UX**
- Responsive design for all devices
- Dark/Light mode support
- Animated components and transitions
- Professional admin dashboard

## 🚀 Tech Stack

### **Frontend**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Hook Form** - Form management
- **Sonner** - Toast notifications

### **Backend**
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing

### **Development Tools**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB Atlas account or local MongoDB installation
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/laxmidev.git
cd laxmidev
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:

```env
# MongoDB Configuration
MONGODB_USERNAME="your_username"
MONGODB_PASSWORD="your_password"
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/realestate_cms?retryWrites=true&w=majority"

# JWT Configuration
JWT_SECRET="your_super_secret_jwt_key_here"
JWT_EXPIRES_IN="24h"

# Server Configuration
NODE_ENV="development"
PORT=3000

# File Upload Configuration
MAX_FILE_SIZE=50000000
UPLOAD_PATH="public/uploads"

# Frontend API Configuration
NEXT_PUBLIC_API_URL="/api"
```

### 4. Database Setup
```bash
# Seed the database with initial data
npm run seed
```

### 5. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🔐 Default Login Credentials

After seeding the database, use these credentials to access the admin panel:

**Super Admin:**
- Email: `admin@laxmidev.com`
- Password: `admin123456`

**Admin:**
- Email: `manager@laxmidev.com`
- Password: `manager123456`

## 📁 Project Structure

```
laxmidev/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── cms-admin/         # Admin dashboard pages
│   ├── projects/          # Project pages
│   ├── blogs/             # Blog pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── sections/          # Page sections
│   ├── ui/               # UI components
│   └── forms/            # Form components
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── middleware/           # API middleware
├── models/               # Mongoose models
├── public/               # Static assets
├── scripts/              # Database scripts
└── types/                # TypeScript definitions
```

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run seed         # Seed database with initial data

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Get project by ID
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Testimonials
- `GET /api/testimonials` - Get all testimonials
- `POST /api/testimonials` - Create testimonial
- `PATCH /api/testimonials/[id]` - Approve/Feature testimonial

### Blogs
- `GET /api/blogs` - Get all blog posts
- `POST /api/blogs` - Create blog post
- `GET /api/blogs/[slug]` - Get blog by slug
- `PUT /api/blogs/[slug]` - Update blog post

### File Upload
- `POST /api/upload` - Upload files
- `DELETE /api/upload` - Delete files

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Manual Deployment
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: support@laxmidev.com

---

**Built with ❤️ by the Laxmi Developers team**
