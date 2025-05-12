// Types for the [slug] route
import { Metadata } from 'next/types';

// Define the parameters for dynamic routes
export interface SlugPageParams {
  params: {
    slug: string;
  };
  searchParams?: Record<string, string | string[] | undefined>;
}

// Export the metadata function type
export type GenerateMetadataFn = (props: SlugPageParams) => Promise<Metadata>; 