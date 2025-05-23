"use client";

import { useState } from "react";
import { AuroraButton } from "@/components/ui/aurora-button";

interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
}

interface CareerClientProps {
  jobOpenings: JobOpening[];
}

export default function CareerClient({ jobOpenings }: CareerClientProps) {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    message: "",
    resume: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, resume: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulating form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Here you would typically send the data to your server
    console.log("Application submitted:", formData);
    
    setIsSubmitting(false);
    setFormSubmitted(true);
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      position: "",
      experience: "",
      message: "",
      resume: null,
    });
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="relative py-24 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-display text-foreground mb-6">
            Join Our Team
          </h1>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            Build your career with one of Surat's leading real estate developers.
          </p>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-display mb-6">Why Join Laxmi Developers?</h2>
            <p className="text-foreground/80 mb-8">
              At Laxmi Developers, we believe that our success is built on the talent and dedication of our team. We offer a dynamic work environment where creativity is encouraged, excellence is recognized, and professional growth is fostered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-md text-center">
              <div className="w-14 h-14 bg-highlight/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-highlight"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-display mb-3">Growth Opportunities</h3>
              <p className="text-foreground/80 text-sm">
                We provide clear career paths and opportunities for professional advancement through training and mentorship.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-md text-center">
              <div className="w-14 h-14 bg-highlight/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-highlight"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-display mb-3">Collaborative Culture</h3>
              <p className="text-foreground/80 text-sm">
                We foster a supportive team environment where ideas are valued and collaboration is encouraged.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-md text-center">
              <div className="w-14 h-14 bg-highlight/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-highlight"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-display mb-3">Competitive Benefits</h3>
              <p className="text-foreground/80 text-sm">
                We offer attractive compensation packages, health benefits, and performance incentives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Current Openings */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display mb-4">
              Current Openings
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Explore our current job opportunities and find your perfect role
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {jobOpenings.map((job) => (
              <div
                key={job.id}
                className="bg-card rounded-lg shadow-md overflow-hidden mb-6"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-display mb-1">{job.title}</h3>
                      <p className="text-foreground/70 text-sm">
                        {job.department} | {job.location} | {job.type}
                      </p>
                    </div>
                    <AuroraButton
                      onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                      className="font-medium mt-3 md:mt-0"
                      variant="outline"
                    >
                      {selectedJob === job.id ? "Hide Details" : "View Details"}
                    </AuroraButton>
                  </div>
                  <p className="text-foreground/80">{job.description}</p>

                  {selectedJob === job.id && (
                    <div className="mt-6 border-t border-border pt-6">
                      <div className="mb-4">
                        <h4 className="font-display text-lg mb-2">Responsibilities:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-foreground/80">
                          {job.responsibilities.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-display text-lg mb-2">Requirements:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-foreground/80">
                          {job.requirements.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-6">
                        <AuroraButton
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              position: job.title,
                            }));
                            window.scrollTo({
                              top: document.getElementById("application-form")?.offsetTop,
                              behavior: "smooth",
                            });
                          }}
                          className="font-medium"
                          variant="default"
                        >
                          Apply Now
                        </AuroraButton>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="application-form" className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display mb-4">
                Apply Now
              </h2>
              <p className="text-lg text-foreground/70">
                Submit your application to join our team
              </p>
            </div>

            {formSubmitted ? (
              <div className="bg-highlight/10 border border-highlight rounded-lg p-8 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-highlight mb-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-2xl font-display mb-4">Application Submitted!</h3>
                <p className="text-foreground/80 mb-6">
                  Thank you for your interest in joining Laxmi Developers. Our HR team will review your application and contact you if your qualifications match our requirements.
                </p>
                <AuroraButton
                  onClick={() => setFormSubmitted(false)}
                  variant="outline"
                >
                  Submit Another Application
                </AuroraButton>
              </div>
            ) : (
              <div className="bg-card p-8 rounded-lg shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-muted border border-border rounded-md focus:ring-highlight focus:border-highlight"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email Address *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-muted border border-border rounded-md focus:ring-highlight focus:border-highlight"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-2">
                        Phone Number *
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-muted border border-border rounded-md focus:ring-highlight focus:border-highlight"
                      />
                    </div>
                    <div>
                      <label htmlFor="position" className="block text-sm font-medium mb-2">
                        Position Applied For *
                      </label>
                      <select
                        id="position"
                        name="position"
                        required
                        value={formData.position}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-muted border border-border rounded-md focus:ring-highlight focus:border-highlight"
                      >
                        <option value="">Select a position</option>
                        {jobOpenings.map((job) => (
                          <option key={job.id} value={job.title}>
                            {job.title}
                          </option>
                        ))}
                        <option value="Other">Other (Specify in message)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium mb-2">
                      Years of Experience *
                    </label>
                    <select
                      id="experience"
                      name="experience"
                      required
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-muted border border-border rounded-md focus:ring-highlight focus:border-highlight"
                    >
                      <option value="">Select experience</option>
                      <option value="0-1">0-1 years</option>
                      <option value="1-3">1-3 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5-10">5-10 years</option>
                      <option value="10+">10+ years</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Cover Letter / Additional Information
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-muted border border-border rounded-md focus:ring-highlight focus:border-highlight"
                    ></textarea>
                  </div>

                  <div>
                    <label htmlFor="resume" className="block text-sm font-medium mb-2">
                      Upload Resume (PDF, DOC, DOCX) *
                    </label>
                    <input
                      id="resume"
                      name="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      required
                      onChange={handleFileChange}
                      className="w-full px-4 py-2 bg-muted border border-border rounded-md focus:ring-highlight focus:border-highlight"
                    />
                  </div>

                  <div>
                    <AuroraButton
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full"
                      variant="default"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </AuroraButton>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
} 