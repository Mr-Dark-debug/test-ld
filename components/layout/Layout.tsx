import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {children}
      </main>
      <Footer />
    </>
  );
} 