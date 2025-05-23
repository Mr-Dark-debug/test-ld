import React from 'react';
import Link from 'next/link';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
}

export function FeatureCard({ title, description, icon, href }: FeatureCardProps) {
  const CardContent = () => (
    <div className="flex flex-col md:flex-row items-start gap-6 p-6 bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100 group dark:from-blue-900/20 dark:to-blue-900/10 dark:border-blue-800/30">
      <div className="flex-shrink-0 p-3 bg-blue-100 text-blue-700 rounded-lg group-hover:bg-blue-700 group-hover:text-white transition-colors duration-300 dark:bg-blue-900/30 dark:text-blue-400 dark:group-hover:bg-blue-700/80">
        {icon}
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-medium text-gray-800 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
        {href && (
          <div className="pt-2">
            <span className="text-blue-700 font-medium hover:underline inline-flex items-center dark:text-blue-400">
              Learn more
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
} 