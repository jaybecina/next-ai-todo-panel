import { DrizzleTest } from '@/components/test/drizzle-test';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Drizzle Database Test</h1>
          <p className="text-muted-foreground mt-2">
            Test your Drizzle database connection and CRUD operations
          </p>
        </div>
        <DrizzleTest />
      </div>
    </div>
  );
} 