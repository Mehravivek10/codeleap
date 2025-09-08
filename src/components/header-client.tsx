'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamically import the Header component with SSR disabled
const Header = dynamic(
  () => import('@/components/header').then((mod) => mod.Header),
  { 
    ssr: false,
    loading: () => (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Skeleton className="h-6 w-24" />
        </div>
      </header>
    )
  }
);

export function HeaderClient() {
  return <Header />;
}
