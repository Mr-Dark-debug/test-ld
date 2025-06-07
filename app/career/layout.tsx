import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers | Laxmi Developers",
  description: "Join our team at Laxmi Developers. Explore current job openings and apply for opportunities in real estate development.",
};

export default function CareerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
