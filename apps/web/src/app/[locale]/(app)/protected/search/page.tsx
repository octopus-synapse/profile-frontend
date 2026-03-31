/**
 * Search Page
 * Discover resumes and professionals
 */

import type { Metadata } from 'next';
import { SearchPage } from '@/components/search/search-page';

export const metadata: Metadata = {
  title: 'Search | PATCH',
  description: 'Search resumes and discover professionals',
};

export default function SearchRoute() {
  return <SearchPage />;
}
