'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CommercialPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to projects page with commercial filter
    router.replace('/projects?type=commercial');
  }, [router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to commercial projects...</p>
      </div>
    </div>
  );
}
