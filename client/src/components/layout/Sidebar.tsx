'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Layers, Sparkles, Image, LayoutDashboard } from 'lucide-react';

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
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-sidebar-bg border-r border-border flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-foreground">Story Pipeline</h1>
        <p className="text-xs text-text-secondary mt-1">AI-Powered Storytelling</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-md transition-colors duration-200',
                    isActive
                      ? 'bg-primary-accent text-white'
                      : 'text-text-secondary hover:bg-hover hover:text-foreground'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-6 border-t border-border">
        <p className="text-xs text-text-secondary">
          Powered by AI
        </p>
      </div>
    </aside>
  );
}
