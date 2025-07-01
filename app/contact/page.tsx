import { Metadata } from "next/types";
import ContactInfo from "@/components/sections/ContactInfo";
import { contactInfo } from "@/data/contact";

export const metadata: Metadata = {
  title: "Contact Us | Laxmi Developers",
  description: "Get in touch with Laxmi Developers. We're here to assist you with all your real estate needs and inquiries.",
};

export default function ContactPage() {
  return (
    <main>
      <ContactInfo
        title="Contact Us"
        subtitle="Your inquiries are important to us. Whether you have questions about our projects, want to discuss investment opportunities, or need support, our team is ready to provide you with the information and assistance you require. Please use the form below, give us a call, or visit our office during working hours."
        address={contactInfo.address}
        phone={contactInfo.phone}
        hours={contactInfo.hours}
        mapEmbedSrc={contactInfo.mapEmbedSrc}
      />
    </main>
  );
} 