import Link from 'next/link';
import { PixelButton } from '@/components/ui/pixel-button';
import { Timer, Target, BarChart3, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen pixel-grid">
      <nav className="bg-surface border-b-2 border-gray-900 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Timer className="text-primary" size={32} />
            <span className="text-2xl font-bold text-gray-900">Pomodoro</span>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <PixelButton variant="ghost">Login</PixelButton>
            </Link>
            <Link href="/signup">
              <PixelButton variant="primary">Sign Up</PixelButton>
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
          <div className="bg-white border-2 border-gray-900 rounded-lg shadow-pixel p-6">
            <div className="w-12 h-12 bg-primary/10 border-2 border-primary rounded-lg flex items-center justify-center mb-4">
              <Timer className="text-primary" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Pomodoro Timer</h3>
            <p className="text-gray-600">
              Customizable work/break intervals with focus tracking
            </p>
          </div>

          <div className="bg-white border-2 border-gray-900 rounded-lg shadow-pixel p-6">
            <div className="w-12 h-12 bg-secondary/10 border-2 border-secondary rounded-lg flex items-center justify-center mb-4">
              <Target className="text-secondary" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Task Management</h3>
            <p className="text-gray-600">
              Create and organize tasks with pomodoro tracking
            </p>
          </div>

          <div className="bg-white border-2 border-gray-900 rounded-lg shadow-pixel p-6">
            <div className="w-12 h-12 bg-accent/10 border-2 border-accent rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="text-accent" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Analytics</h3>
            <p className="text-gray-600">
              Track your productivity and break compliance
            </p>
          </div>

          <div className="bg-white border-2 border-gray-900 rounded-lg shadow-pixel p-6">
            <div className="w-12 h-12 bg-success/10 border-2 border-success rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="text-success" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Break Tracking</h3>
            <p className="text-gray-600">
              Monitor and improve your break habits
            </p>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-900 rounded-lg shadow-pixel-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Focus?</h2>
          <p className="text-gray-600 mb-6">
            Join thousands of productive users achieving their goals
          </p>
          <Link href="/signup">
            <PixelButton size="lg" variant="primary">
              Start Your Journey
            </PixelButton>
          </Link>
        </div>
      </main>
    </div>
  );
}
