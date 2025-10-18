'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 w-10 h-10 rounded-lg bg-card-bg border border-border hover:border-primary-accent shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 group"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Moon className="w-5 h-5 text-primary-accent group-hover:rotate-12 transition-transform" />
      ) : (
        <Sun className="w-5 h-5 text-primary-accent group-hover:rotate-12 transition-transform" />
      )}
    </button>
  );
}
