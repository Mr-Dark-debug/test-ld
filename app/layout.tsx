import type { Metadata } from 'next/dist/lib/metadata/types/metadata-interface';
import { Inter, Playfair_Display as PlayfairDisplay, Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/lib/theme-context";
import GlobalFloatingMenu from "@/components/layout/GlobalFloatingMenu";
import { Toaster } from 'sonner';
import { LoadingProvider } from '@/components/providers/loading-provider';
import { AuthProvider } from "@/contexts/AuthContext";
import Analytics from "@/components/analytics/Analytics";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = PlayfairDisplay({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair",
});
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://www.laxmideveloper.com'),
  title: "Laxmi Developers - Surat | Real Estate & Construction",
  description: "Discover premium residential and commercial properties by Laxmi Developers in Surat. Building excellence with quality, innovation, and customer satisfaction for over 20 years.",
  keywords: ["Laxmi Developers", "Surat Real Estate", "Residential Properties", "Commercial Properties", "Construction Company", "Property Developer", "Gujarat Real Estate"],
  authors: [{ name: "Laxmi Developers" }],
  creator: "Laxmi Developers",
  publisher: "Laxmi Developers",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.laxmideveloper.com',
    siteName: 'Laxmi Developers',
    title: 'Laxmi Developers - Premium Real Estate in Surat',
    description: 'Discover premium residential and commercial properties by Laxmi Developers in Surat. Building excellence with quality, innovation, and customer satisfaction.',
    images: [
      {
        url: '/images/logo/logo.png',
        width: 1200,
        height: 630,
        alt: 'Laxmi Developers Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Laxmi Developers - Premium Real Estate in Surat',
    description: 'Discover premium residential and commercial properties by Laxmi Developers in Surat.',
    images: ['/images/logo/logo.png'],
  },
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification code
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL || 'https://www.laxmideveloper.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} ${montserrat.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <ThemeProvider>
          <AuthProvider>
            <LoadingProvider>
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
              <GlobalFloatingMenu />
              <Toaster richColors position="top-right" />
              <Analytics />
            </LoadingProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
