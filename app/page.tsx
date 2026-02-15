import Link from 'next/link';
import { PixelButton } from '@/components/ui/pixel-button';
import { Timer, Target, BarChart3, CheckCircle } from 'lucide-react';
import { PomodoroTimer } from '@/components/timer/pomodoro-timer';

export default function LandingPage() {
  return (
    <div className="min-h-screen pixel-grid">
      <nav className="bg-surface border-b-2 border-gray-900 px-4 sm:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Timer className="text-primary w-6 h-6 sm:w-8 sm:h-8" />
            <span className="text-lg sm:text-2xl font-bold text-gray-900">Pomodoro</span>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <Link href="/login">
              <PixelButton variant="ghost" size="sm" className="sm:px-4 sm:py-2 sm:text-sm">Login</PixelButton>
            </Link>
            <Link href="/signup" className="hidden sm:block">
              <PixelButton variant="primary" size="sm" className="sm:px-4 sm:py-2 sm:text-sm">Sign Up</PixelButton>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Boost Your Productivity with
            <span className="text-primary"> Pomodoro</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Track tasks, manage focus sessions, and analyze your productivity with our
            pixel-cute Pomodoro timer and task manager.
          </p>
          <Link href="/signup">
            <PixelButton size="lg" variant="primary">
              Get Started Free
            </PixelButton>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white border-2 border-gray-900 pixel-rounded shadow-pixel p-6">
            <div className="w-12 h-12 bg-primary/10 border-2 border-primary pixel-rounded flex items-center justify-center mb-4">
              <Timer className="text-primary" size={24} />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">Pomodoro Timer</h3>
            <p className="text-gray-600">
              Customizable work/break intervals with focus tracking
            </p>
          </div>

          <div className="bg-white border-2 border-gray-900 pixel-rounded shadow-pixel p-6">
            <div className="w-12 h-12 bg-secondary/10 border-2 border-secondary pixel-rounded flex items-center justify-center mb-4">
              <Target className="text-secondary" size={24} />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">Task Management</h3>
            <p className="text-gray-600">
              Create and organize tasks with pomodoro tracking
            </p>
          </div>

          <div className="bg-white border-2 border-gray-900 pixel-rounded shadow-pixel p-6">
            <div className="w-12 h-12 bg-accent/10 border-2 border-accent pixel-rounded flex items-center justify-center mb-4">
              <BarChart3 className="text-accent" size={24} />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">Analytics</h3>
            <p className="text-gray-600">
              Track your productivity and break compliance
            </p>
          </div>

          <div className="bg-white border-2 border-gray-900 pixel-rounded shadow-pixel p-6">
            <div className="w-12 h-12 bg-success/10 border-2 border-success pixel-rounded flex items-center justify-center mb-4">
              <CheckCircle className="text-success" size={24} />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">Break Tracking</h3>
            <p className="text-gray-600">
              Monitor and improve your break habits
            </p>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-900 pixel-rounded shadow-pixel-lg p-8">
          <PomodoroTimer />
        </div>
      </main>
    </div>
  );
}
