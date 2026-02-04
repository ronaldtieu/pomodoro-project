'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, List, Timer, BarChart3, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/tasks', label: 'Tasks', icon: List },
    { href: '/dashboard/timer', label: 'Timer', icon: Timer },
    { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="w-64 bg-surface border-r-2 border-gray-900 min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <Timer size={32} />
          Pomodoro
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all',
                isActive
                  ? 'bg-primary text-white shadow-pixel-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all mt-auto"
      >
        <LogOut size={20} />
        Logout
      </button>
    </div>
  );
};
