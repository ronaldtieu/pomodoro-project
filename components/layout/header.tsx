'use client';

import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export const Header: React.FC = () => {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setEmail(user?.email || null);
    };
    getUser();
  }, []);

  return (
    <header className="bg-surface border-b-2 border-gray-900 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
          {email && <p className="text-sm text-gray-600">{email}</p>}
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-lg border-2 border-gray-300">
          <User size={20} className="text-gray-600" />
          <span className="text-sm font-semibold text-gray-700">User</span>
        </div>
      </div>
    </header>
  );
};
