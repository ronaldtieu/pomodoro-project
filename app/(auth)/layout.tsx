import Link from 'next/link';
import { Timer } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pixel-grid flex flex-col">
      <nav className="bg-surface border-b-2 border-gray-900 px-4 sm:px-8 py-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Timer className="text-primary" size={32} />
            <span className="text-2xl font-bold text-gray-900">Pomodoro</span>
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        {children}
      </main>
    </div>
  );
}
