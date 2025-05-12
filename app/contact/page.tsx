import { Metadata } from "next";
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
        subtitle="We're here to assist you with all your real estate needs. Reach out to us through any of the channels below."
        address={contactInfo.address}
        phone={contactInfo.phone}
        hours={contactInfo.hours}
        mapEmbedSrc={contactInfo.mapEmbedSrc}
      />
    </main>
  );
} 