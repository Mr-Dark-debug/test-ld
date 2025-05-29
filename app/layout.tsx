import type { Metadata } from "next";
import { Inter, Playfair_Display as PlayfairDisplay, Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/lib/theme-context";
import GlobalFloatingMenu from "@/components/layout/GlobalFloatingMenu";

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
  title: "Laxmi Developers - Surat | Real Estate & Construction",
  description: "Discover premium residential and commercial properties by Laxmi Developers in Surat. Building excellence with quality, innovation, and customer satisfaction for over 20 years.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} ${montserrat.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <GlobalFloatingMenu />
        </ThemeProvider>
      </body>
    </html>
  );
}
