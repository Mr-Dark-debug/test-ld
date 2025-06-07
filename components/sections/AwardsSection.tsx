'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import AnimatedTitle from '@/components/ui/AnimatedTitle';
import { Award, Star } from 'lucide-react';

interface Award {
  _id: string;
  title: string;
  description: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AwardsSection() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const response = await fetch('/api/awards');
        const data = await response.json();

        if (data.success && data.data) {
          // Filter only active awards
          const activeAwards = data.data.filter((award: Award) => award.isActive);
          setAwards(activeAwards);
        } else {
          // Fallback to default award if API fails
          setAwards([
            {
              _id: '1',
              title: 'Best Real Estate Developer 2023',
              description: 'Awarded for excellence in residential and commercial development in Surat region.',
              image: '/images/awards/best-developer-2023.jpg',
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching awards:', error);
        // Fallback to default award
        setAwards([
          {
            _id: '1',
            title: 'Best Real Estate Developer 2023',
            description: 'Awarded for excellence in residential and commercial development in Surat region.',
            image: '/images/awards/best-developer-2023.jpg',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAwards();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (awards.length === 0) {
    return null; // Don't render section if no awards
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <AnimatedTitle as="h2" className="mb-4">
            Awards & Recognition
          </AnimatedTitle>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Our commitment to excellence has been recognized by industry leaders and organizations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {awards.map((award, index) => (
            <div 
              key={award._id}
              className="bg-card rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              {/* Award Image */}
              <div className="relative h-48 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
                {award.image ? (
                  <Image
                    src={award.image}
                    alt={award.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback to default award icon if image fails to load
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Award className="w-16 h-16 text-yellow-500" />
                  </div>
                )}
                
                {/* Award Badge */}
                <div className="absolute top-4 right-4 bg-yellow-500 text-white p-2 rounded-full shadow-lg">
                  <Star className="w-5 h-5 fill-current" />
                </div>
              </div>

              {/* Award Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                  {award.title}
                </h3>
                <p className="text-foreground/70 text-sm leading-relaxed">
                  {award.description}
                </p>
                
                {/* Award Year */}
                <div className="mt-4 pt-4 border-t border-border">
                  <span className="text-xs text-foreground/50 font-medium">
                    Received: {new Date(award.createdAt).getFullYear()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
