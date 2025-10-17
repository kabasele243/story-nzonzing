import { ReactNode } from 'react';

interface MainContentProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export function MainContent({ children, title, description }: MainContentProps) {
  return (
    <main className="ml-64 min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          {description && (
            <p className="text-text-secondary mt-2">{description}</p>
          )}
        </header>
        {children}
      </div>
    </main>
  );
}
