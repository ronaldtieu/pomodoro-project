'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, List, Timer, BarChart3, LogOut, CheckSquare, Menu, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const supabase = createClient();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/todos', label: 'Todos', icon: CheckSquare },
    { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const sidebarContent = (
    <>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <Timer size={32} />
          Pomodoro
        </h1>
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-2 pixel-rounded border-2 border-gray-400 text-gray-600 hover:text-gray-900 hover:border-gray-900 shadow-pixel-sm active:translate-y-0.5 active:shadow-none transition-all"
        >
          <X size={20} />
        </button>
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
    </>
  );

  return (
    <>
      {/* Hamburger button - mobile only */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-surface border-2 border-gray-900 pixel-rounded shadow-pixel-sm active:translate-y-0.5 active:shadow-none transition-all"
      >
        <Menu size={24} />
      </button>

      {/* Desktop sidebar */}
      <div className="hidden md:flex w-64 bg-surface border-r-2 border-gray-900 min-h-screen p-4 flex-col">
        {sidebarContent}
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          {/* Sidebar panel */}
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-surface border-r-2 border-gray-900 p-4 flex flex-col animate-slide-in-left">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
