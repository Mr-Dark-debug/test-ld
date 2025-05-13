import type { Metadata } from "next/types";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import Layout from "@/components/layout/Layout";
import { ThemeProvider } from "@/lib/theme-context";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Laxmi Developers | Premium Real Estate Developer in Surat",
  description: "Laxmi Developers is a premium real estate developer in Surat, Gujarat, offering high-quality residential and commercial properties built with excellence and innovation.",
  keywords: "Laxmi Developers, Real Estate, Property, Surat, Gujarat, Residential, Commercial, Premium Properties",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${poppins.variable} antialiased`}
      >
        <ThemeProvider>
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  );
}
