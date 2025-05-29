import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "About Us | Laxmi Developers",
  description: "Learn about Laxmi Developers, our mission to build exceptional properties in Surat, and our commitment to excellence in real estate development.",
};

export default function AboutUsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}