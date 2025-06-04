"use client";

import React, { useState } from "react";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import useAnalytics from "@/hooks/useAnalytics";
import { getApiUrl } from "@/lib/config";
import PhoneInput from "@/components/ui/phone-input";

interface ContactInfoProps {
  title?: string;
  subtitle?: string;
  address: string;
  phone: string;
  hours: { days: string; time: string }[];
  mapEmbedSrc: string; // Google Maps embed URL
}

export default function ContactInfo({
  title = "Contact Us",
  subtitle,
  address,
  phone,
  hours,
  mapEmbedSrc,
}: ContactInfoProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectInterest: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { trackContactForm, trackButtonClick } = useAnalytics();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value: string) => {
    setFormData((prev) => ({ ...prev, phone: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Validate phone number
      if (!formData.phone || formData.phone.trim().length < 8) {
        setSubmitError('Please enter a valid phone number');
        return;
      }

      // Track form submission attempt
      trackContactForm('contact_page');

      // Send data to API
      const apiUrl = getApiUrl('leads/contact');
      console.log('Submitting to:', apiUrl);
      console.log('Form data:', formData);

      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 30000) // 30 second timeout
      );

      // Race between fetch and timeout
      const response = await Promise.race([
        fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }),
        timeoutPromise
      ]) as Response;

      const result = await response.json();
      console.log('API Response:', result);

      if (response.ok && result.success) {
        setFormSubmitted(true);
        setSubmitError(null);
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          projectInterest: "",
          message: "",
        });
      } else {
        const errorMessage = result.error || `Server error: ${response.status}`;
        console.error('Form submission failed:', errorMessage);
        setSubmitError(errorMessage);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        {(title || subtitle) && (
          <div className="text-center mb-16">
            {title && <h2 className="text-3xl md:text-4xl font-display mb-4">{title}</h2>}
            {subtitle && (
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <div className="bg-card p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-display mb-6">Send us a Message</h3>
            
            {formSubmitted ? (
              <div className="bg-highlight/10 border border-highlight rounded-md p-6 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-highlight mb-4"
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
                <h4 className="text-xl font-display mb-2">Thank You!</h4>
                <p className="text-foreground/80">
                  Your message has been sent successfully. We will get back to you shortly.
                </p>
                <button
                  type="button"
                  className="mt-6 text-highlight underline"
                  onClick={() => {
                    trackButtonClick('send_another_message', 'contact_form');
                    setFormSubmitted(false);
                  }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {submitError && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                      <svg
                        className="h-5 w-5 text-red-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="ml-3">
                        <p className="text-sm text-red-800">{submitError}</p>
                      </div>
                    </div>
                  </div>
                )}
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
                      Mobile Number *
                    </label>
                    <PhoneInput
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      placeholder="Enter number"
                      required
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="projectInterest" className="block text-sm font-medium mb-2">
                    Project of Interest
                  </label>
                  <select
                    id="projectInterest"
                    name="projectInterest"
                    value={formData.projectInterest}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-muted border border-border rounded-md focus:ring-highlight focus:border-highlight"
                  >
                    <option value="">Select a project</option>
                    <option value="Millennium Park">Millennium Park</option>
                    <option value="Laxmi Aster">Laxmi Aster</option>
                    <option value="Laxmi Homes">Laxmi Homes</option>
                    <option value="Aleta">Aleta</option>
                    <option value="Flora Park">Flora Park</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-muted border border-border rounded-md focus:ring-highlight focus:border-highlight"
                  ></textarea>
                </div>

                <div>
                  <ShimmerButton
                    type="submit"
                    disabled={isSubmitting}
                    shimmerColor="#3b82f6"
                    background="rgba(59, 130, 246, 0.9)"
                    className="font-medium w-full"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </ShimmerButton>
                </div>
              </form>
            )}
          </div>

          {/* Contact Information & Map */}
          <div className="space-y-8">
            {/* Contact Details */}
            <div className="bg-card p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-display mb-6">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-highlight mt-1 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div className="ml-4">
                    <h4 className="text-base font-medium mb-1">Address</h4>
                    <address className="not-italic text-foreground/70">{address}</address>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-highlight mt-1 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <div className="ml-4">
                    <h4 className="text-base font-medium mb-1">Phone</h4>
                    <a
                      href={`tel:${phone.replace(/\s+/g, "")}`}
                      className="text-foreground/70 hover:text-highlight transition-colors"
                    >
                      {phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-highlight mt-1 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="ml-4">
                    <h4 className="text-base font-medium mb-1">Working Hours</h4>
                    <div className="space-y-1 text-foreground/70">
                      {hours.map((hour, index) => (
                        <p key={index}>
                          {hour.days}: {hour.time}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div className="bg-card p-8 rounded-lg shadow-md h-80">
              <iframe
                src={mapEmbedSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map"
                className="rounded-md"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 