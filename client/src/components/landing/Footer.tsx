'use client';

import { Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-text-secondary text-sm">
            © 2025 Nzonzing. AI-Powered Storytelling Platform.
          </div>
          <div className="flex items-center gap-2 text-text-secondary text-sm">
            <Sparkles className="w-4 h-4 text-primary-accent" />
            <span>Powered by AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
