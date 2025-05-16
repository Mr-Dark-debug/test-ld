import Header from "./Header";
import Footer from "./Footer";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import ScrollFloatProvider from "@/components/reactbits/ScrollFloat/ScrollFloatProvider";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <SmoothCursor />
      <Header />
      <main className="min-h-screen">
        <ScrollFloatProvider>
          {children}
        </ScrollFloatProvider>
      </main>
      <Footer />
    </>
  );
} 