export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  isActive: boolean;
  postedDate: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  message: string;
  resumeUrl: string;
  status: 'new' | 'reviewed' | 'shortlisted' | 'rejected';
  appliedDate: string;
}

// Mock job openings based on the career page
export const mockJobOpenings: JobOpening[] = [
  {
    id: "job-1",
    title: "Senior Architect",
    department: "Design",
    location: "Surat, Gujarat",
    type: "Full-time",
    description:
      "We are seeking an experienced Senior Architect to join our design team. The ideal candidate will have a proven track record of designing innovative residential and commercial spaces.",
    responsibilities: [
      "Develop architectural designs for residential and commercial projects",
      "Coordinate with engineering teams for technical specifications",
      "Ensure all designs meet regulatory standards and client requirements",
      "Supervise junior architects and design staff",
      "Present design concepts to clients and stakeholders",
    ],
    requirements: [
      "Bachelor's or Master's degree in Architecture",
      "Minimum 5 years of experience in real estate development",
      "Proficiency in AutoCAD, Revit, and 3D rendering software",
      "Strong portfolio demonstrating creative design capabilities",
      "Excellent communication and presentation skills",
    ],
    isActive: true,
    postedDate: "2023-03-15T10:00:00",
  },
  {
    id: "job-2",
    title: "Civil Engineer",
    department: "Construction",
    location: "Surat, Gujarat",
    type: "Full-time",
    description:
      "We are looking for a detail-oriented Civil Engineer to oversee construction projects and ensure they are completed to the highest standards of quality and safety.",
    responsibilities: [
      "Review and approve construction plans and specifications",
      "Monitor construction progress and quality control",
      "Coordinate with contractors and suppliers",
      "Ensure compliance with building codes and safety regulations",
      "Prepare project reports and documentation",
    ],
    requirements: [
      "Bachelor's degree in Civil Engineering",
      "3+ years of experience in construction management",
      "Knowledge of construction methods, materials, and industry standards",
      "Familiarity with project management software",
      "Strong analytical and problem-solving skills",
    ],
    isActive: true,
    postedDate: "2023-04-10T09:30:00",
  },
  {
    id: "job-3",
    title: "Marketing Executive",
    department: "Marketing",
    location: "Surat, Gujarat",
    type: "Full-time",
    description:
      "Join our marketing team to help promote our properties and strengthen our brand presence in the real estate market.",
    responsibilities: [
      "Develop and implement marketing strategies for property launches",
      "Create compelling content for digital and traditional marketing channels",
      "Manage social media presence and engagement",
      "Organize property exhibitions and client events",
      "Track marketing metrics and prepare performance reports",
    ],
    requirements: [
      "Bachelor's degree in Marketing, Business, or related field",
      "2+ years of experience in real estate marketing",
      "Strong understanding of digital marketing channels",
      "Excellent written and verbal communication skills",
      "Creative thinking and attention to detail",
    ],
    isActive: false,
    postedDate: "2023-02-20T11:15:00",
  },
];

// Mock job applications
export const mockJobApplications: JobApplication[] = [
  {
    id: "app-1",
    jobId: "job-1",
    jobTitle: "Senior Architect",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 12345",
    experience: "7 years",
    message: "I have been working as an architect for 7 years with a focus on residential projects. I am looking for new challenges in a dynamic company like yours.",
    resumeUrl: "/uploads/resumes/rahul-sharma-resume.pdf",
    status: "shortlisted",
    appliedDate: "2023-05-10T14:20:00",
  },
  {
    id: "app-2",
    jobId: "job-1",
    jobTitle: "Senior Architect",
    name: "Ananya Patel",
    email: "ananya.patel@example.com",
    phone: "+91 87654 23456",
    experience: "5 years",
    message: "I am passionate about creating innovative designs that blend functionality with aesthetics. I believe my experience would be valuable to your team.",
    resumeUrl: "/uploads/resumes/ananya-patel-resume.pdf",
    status: "new",
    appliedDate: "2023-05-12T09:45:00",
  },
  {
    id: "app-3",
    jobId: "job-2",
    jobTitle: "Civil Engineer",
    name: "Vikram Desai",
    email: "vikram.desai@example.com",
    phone: "+91 76543 34567",
    experience: "4 years",
    message: "I have extensive experience in managing construction projects from planning to completion. I am particularly skilled in quality control and cost management.",
    resumeUrl: "/uploads/resumes/vikram-desai-resume.pdf",
    status: "reviewed",
    appliedDate: "2023-05-15T11:30:00",
  },
  {
    id: "app-4",
    jobId: "job-2",
    jobTitle: "Civil Engineer",
    name: "Neha Verma",
    email: "neha.verma@example.com",
    phone: "+91 65432 45678",
    experience: "3 years",
    message: "I am interested in joining your team as a Civil Engineer. I have experience in both residential and commercial projects and am certified in safety management.",
    resumeUrl: "/uploads/resumes/neha-verma-resume.pdf",
    status: "rejected",
    appliedDate: "2023-05-16T15:10:00",
  },
  {
    id: "app-5",
    jobId: "job-3",
    jobTitle: "Marketing Executive",
    name: "Arjun Malhotra",
    email: "arjun.malhotra@example.com",
    phone: "+91 54321 56789",
    experience: "3 years",
    message: "I have been working in real estate marketing for 3 years with a focus on digital campaigns. I am well-versed with SEO, content marketing, and social media strategies.",
    resumeUrl: "/uploads/resumes/arjun-malhotra-resume.pdf",
    status: "new",
    appliedDate: "2023-05-18T10:20:00",
  },
]; 