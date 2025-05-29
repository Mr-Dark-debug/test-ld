'use client'

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GlobalFloatingMenu from "@/components/layout/GlobalFloatingMenu";
import { Toaster } from 'sonner';

export default function ConditionalLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/cms-admin');

  return (
    <>
      {!isAdminRoute && <Header />}
      <main className={`flex-grow ${isAdminRoute ? 'h-screen overflow-y-auto' : ''}`}>{children}</main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <GlobalFloatingMenu />}
      {/* Toaster can remain for all routes, or be conditional too if needed */}
      <Toaster richColors position="top-right" />
    </>
  );
}