"use client";

import { useState } from "react";
import { AuroraButton } from "@/components/ui/aurora-button";

interface JobOpening {
  _id: string;
  id?: string; // For backward compatibility
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

interface CareerClientProps {
  jobOpenings: JobOpening[];
}

export default function CareerClient({ jobOpenings }: CareerClientProps) {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    message: "",
    resumeUrl: "",
    linkedinUrl: "",
    portfolioUrl: "",
    expectedSalary: "",
    availableFrom: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.experience || !formData.resumeUrl) {
        alert('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      // Find the selected job
      const selectedJobData = jobOpenings.find(job => job.title === formData.position);
      if (!selectedJobData) {
        alert('Please select a valid position');
        setIsSubmitting(false);
        return;
      }

      // Prepare application data
      const applicationData = {
        jobId: selectedJobData._id || selectedJobData.id, // Use proper ObjectId
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        experience: formData.experience,
        resumeUrl: formData.resumeUrl,
        coverLetter: formData.message,
        linkedinUrl: formData.linkedinUrl,
        portfolioUrl: formData.portfolioUrl,
        expectedSalary: formData.expectedSalary ? parseInt(formData.expectedSalary) : null,
        availableFrom: formData.availableFrom || null
      };

      // Submit to API
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });

      const result = await response.json();

      if (result.success) {
        setFormSubmitted(true);

        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          position: "",
          experience: "",
          message: "",
          resumeUrl: "",
          linkedinUrl: "",
          portfolioUrl: "",
          expectedSalary: "",
          availableFrom: "",
        });
      } else {
        alert(result.error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
            {jobOpenings.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0V6a2 2 0 00-2 2v6" />
                  </svg>
                </div>
                <h3 className="text-xl font-display mb-2">No Job Openings Available</h3>
                <p className="text-foreground/70">
                  We don't have any active job openings at the moment. Please check back later for new opportunities.
                </p>
              </div>
            ) : (
              jobOpenings.map((job) => {
                const jobId = job._id || job.id;
                return (
                  <div
                    key={jobId}
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
                          onClick={() => setSelectedJob(selectedJob === jobId ? null : jobId)}
                          className="font-medium mt-3 md:mt-0"
                          variant="outline"
                        >
                          {selectedJob === jobId ? "Hide Details" : "View Details"}
                        </AuroraButton>
                      </div>
                      <p className="text-foreground/80">{job.description}</p>

                      {selectedJob === jobId && (
                        <div className="mt-6 pt-6 border-t border-border">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-display text-lg mb-3">Responsibilities</h4>
                              <ul className="space-y-2">
                                {job.responsibilities.map((responsibility, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="w-2 h-2 bg-highlight rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    <span className="text-foreground/80 text-sm">{responsibility}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-display text-lg mb-3">Requirements</h4>
                              <ul className="space-y-2">
                                {job.requirements.map((requirement, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="w-2 h-2 bg-highlight rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    <span className="text-foreground/80 text-sm">{requirement}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
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
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Application Form - Only show if there are job openings */}
      {jobOpenings.length > 0 && (
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
                      <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                        First Name *
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-muted border border-border rounded-md focus:ring-highlight focus:border-highlight"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                        Last Name *
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-muted border border-border rounded-md focus:ring-highlight focus:border-highlight"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          <option key={job._id || job.id} value={job.title}>
                            {job.title}
                          </option>
                        ))}
                        <option value="Other">Other (Specify in message)</option>
                      </select>
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
                  </div>

                  <div>
                    <label htmlFor="resumeUrl" className="block text-sm font-medium mb-2">
                      Resume URL *
                    </label>
                    <input
                      id="resumeUrl"
                      name="resumeUrl"
                      type="url"
                      required
                      value={formData.resumeUrl}
                      onChange={handleChange}
                      placeholder="https://drive.google.com/file/d/your-resume-link"
                      className="w-full px-4 py-2 bg-muted border border-border rounded-md focus:ring-highlight focus:border-highlight"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Upload your resume to Google Drive, Dropbox, or any cloud storage and paste the public link here.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="linkedinUrl" className="block text-sm font-medium mb-2">
                        LinkedIn Profile (Optional)
                      </label>
                      <input
                        id="linkedinUrl"
                        name="linkedinUrl"
                        type="url"
                        value={formData.linkedinUrl}
                        onChange={handleChange}
                        placeholder="https://linkedin.com/in/your-profile"
                        className="w-full px-4 py-2 bg-muted border border-border rounded-md focus:ring-highlight focus:border-highlight"
                      />
                    </div>
                    <div>
                      <label htmlFor="portfolioUrl" className="block text-sm font-medium mb-2">
                        Portfolio/Website (Optional)
                      </label>
                      <input
                        id="portfolioUrl"
                        name="portfolioUrl"
                        type="url"
                        value={formData.portfolioUrl}
                        onChange={handleChange}
                        placeholder="https://your-portfolio.com"
                        className="w-full px-4 py-2 bg-muted border border-border rounded-md focus:ring-highlight focus:border-highlight"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="expectedSalary" className="block text-sm font-medium mb-2">
                        Expected Salary (INR per month)
                      </label>
                      <input
                        id="expectedSalary"
                        name="expectedSalary"
                        type="number"
                        value={formData.expectedSalary}
                        onChange={handleChange}
                        placeholder="50000"
                        className="w-full px-4 py-2 bg-muted border border-border rounded-md focus:ring-highlight focus:border-highlight"
                      />
                    </div>
                    <div>
                      <label htmlFor="availableFrom" className="block text-sm font-medium mb-2">
                        Available From
                      </label>
                      <input
                        id="availableFrom"
                        name="availableFrom"
                        type="date"
                        value={formData.availableFrom}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-muted border border-border rounded-md focus:ring-highlight focus:border-highlight"
                      />
                    </div>
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
                      placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                      className="w-full px-4 py-2 bg-muted border border-border rounded-md focus:ring-highlight focus:border-highlight"
                    ></textarea>
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
      )}
    </main>
  );
}