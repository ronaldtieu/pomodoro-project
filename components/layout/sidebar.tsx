'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, List, Timer, BarChart3, LogOut, CheckSquare } from 'lucide-react';
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
    { href: '/dashboard/todos', label: 'Todos', icon: CheckSquare },
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
                'flex items-center gap-3 px-4 py-3 pixel-rounded border-2 font-semibold shadow-pixel-sm active:translate-y-0.5 active:shadow-none transition-all',
                isActive
                  ? 'bg-primary border-primary text-white'
                  : 'border-gray-400 text-gray-700 hover:bg-gray-100 hover:border-gray-900'
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
        className="flex items-center gap-3 px-4 py-3 pixel-rounded border-2 border-gray-400 font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-300 shadow-pixel-sm active:translate-y-0.5 active:shadow-none transition-all mt-auto"
      >
        <LogOut size={20} />
        Logout
      </button>
    </div>
  );
};
