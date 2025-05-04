
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Frown } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Frown className="h-8 w-8" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold">Page Not Found</CardTitle>
          <CardDescription className="mt-2 text-muted-foreground">
            Oops! The page you are looking for does not exist or may have been moved.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="mt-4">
            <Link href="/">Go back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
