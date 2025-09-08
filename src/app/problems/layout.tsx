import { TooltipProvider } from '@/components/ui/tooltip';
import { HeaderClient } from '@/components/header-client';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

interface ProblemsLayoutProps {
  children: React.ReactNode;
}

export default function ProblemsLayout({ children }: ProblemsLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderClient />
      <TooltipProvider>
        <main className="flex-1">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[80vh]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          }>
            {children}
          </Suspense>
        </main>
      </TooltipProvider>
    </div>
  );
}
