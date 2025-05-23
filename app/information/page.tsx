import { Metadata } from "next/types";
import { Calculator, BarChart } from "lucide-react";
import { InformationPageContent } from "./information-content";
export const metadata: Metadata = {
  title: "Information | Laxmi Developers",
  description: "Helpful information and resources for real estate investors and buyers.",};

const infoCards = [
  {
    title: "EMI Calculator",
    description: "Calculate your monthly EMI payments for your dream home or investment property.",
    href: "/information/emi-calculator",
    icon: <Calculator className="text-blue-600 dark:text-blue-400" size={28} />,
  },
  {
    title: "Why Invest?",
    description: "Learn about the benefits of investing in real estate in Surat and why Laxmi Developers is your ideal partner.",
    href: "/information/why-invest",
    icon: <BarChart className="text-blue-600 dark:text-blue-400" size={28} />,
  },
];

export default function InformationPage() {
  return <InformationPageContent infoCards={infoCards} />;
} 