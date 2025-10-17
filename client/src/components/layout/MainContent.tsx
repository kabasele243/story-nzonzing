import { ReactNode } from 'react';

interface MainContentProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export function MainContent({ children, title, description }: MainContentProps) {
  return (
    <main className="min-h-screen bg-background lg:pl-5 pl-18 pt-4 relative">
      {/* Dotted grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      <div className="mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
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
