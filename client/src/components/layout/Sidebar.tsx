'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
  Layers,
  Sparkles,
  Image,
  LayoutDashboard,
  Film,
  Play,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  {
    label: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    label: 'Complete Pipeline',
    href: '/complete-pipeline',
    icon: Layers,
  },
  {
    label: 'Story Expander',
    href: '/story-expander',
    icon: Sparkles,
  },
  {
    label: 'Scene Generator',
    href: '/scene-generator',
    icon: Image,
  },
  {
    label: 'Series Creator',
    href: '/series-creator',
    icon: Film,
  },
  {
    label: 'Episode Writer',
    href: '/episode-writer',
    icon: Play,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved !== null) {
      setIsCollapsed(saved === 'true');
    }
  }, []);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-sidebar-bg border border-border rounded-md shadow-lg"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'h-screen bg-sidebar-bg border-r border-border flex flex-col fixed left-0 top-0 z-40 transition-all duration-300',
          // Mobile styles
          'lg:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop styles
          isCollapsed ? 'lg:w-20' : 'lg:w-64',
          'w-64' // Mobile always full width when open
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className={clsx('overflow-hidden transition-all', isCollapsed && 'lg:w-0 lg:opacity-0')}>
            <h1 className="text-xl font-bold text-foreground whitespace-nowrap">Nzonzing</h1>
            <p className="text-xs text-text-secondary mt-1 whitespace-nowrap">AI-Powered Storytelling</p>
          </div>

          {/* Desktop Collapse Button */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-md hover:bg-hover transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-text-secondary" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-text-secondary" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={clsx(
                      'flex items-center gap-3 px-4 py-3 rounded-md transition-colors duration-200 relative group',
                      isActive
                        ? 'bg-primary-accent text-white'
                        : 'text-text-secondary hover:bg-hover hover:text-foreground'
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span
                      className={clsx(
                        'font-semibold whitespace-nowrap overflow-hidden transition-all',
                        isCollapsed && 'lg:w-0 lg:opacity-0'
                      )}
                    >
                      {item.label}
                    </span>

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="hidden lg:block absolute left-full ml-2 px-3 py-2 bg-sidebar-bg border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                        <span className="text-sm text-foreground font-semibold">{item.label}</span>
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-border">
          <p
            className={clsx(
              'text-xs text-text-secondary transition-all overflow-hidden',
              isCollapsed && 'lg:w-0 lg:opacity-0'
            )}
          >
            Powered by AI
          </p>
        </div>
      </aside>
    </>
  );
}
