'use client';

import React from 'react';
import { Coffee, Forward, X } from 'lucide-react';
import { PixelButton } from '@/components/ui/pixel-button';
import { PixelCard } from '@/components/ui/pixel-card';

interface BreakPromptProps {
  onTakeBreak: () => void;
  onSkipBreak: () => void;
  onAbandonSession: () => void;
  sessionType: 'short_break' | 'long_break';
}

export const BreakPrompt: React.FC<BreakPromptProps> = ({
  onTakeBreak,
  onSkipBreak,
  onAbandonSession,
  sessionType,
}) => {
  const isLongBreak = sessionType === 'long_break';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <PixelCard className="w-full max-w-md mx-4">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-accent rounded-full border-2 border-gray-900">
              <Coffee size={48} className="text-gray-900" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isLongBreak ? 'Time for a Long Break!' : 'Time for a Short Break!'}
            </h2>
            <p className="text-gray-600">
              {isLongBreak
                ? 'Great work! Take a 15-minute break to recharge.'
                : 'Nice work! Take a 5-minute break to stretch.'}
            </p>
          </div>

          <div className="space-y-3">
            <PixelButton
              onClick={onTakeBreak}
              variant="primary"
              className="w-full text-lg py-3"
            >
              <div className="flex items-center justify-center gap-2">
                <Coffee size={20} />
                Take {isLongBreak ? 'Long' : 'Short'} Break
              </div>
            </PixelButton>

            <PixelButton
              onClick={onSkipBreak}
              variant="accent"
              className="w-full text-lg py-3"
            >
              <div className="flex items-center justify-center gap-2">
                <Forward size={20} />
                Skip Break
              </div>
            </PixelButton>

            <button
              onClick={onAbandonSession}
              className="w-full text-gray-600 hover:text-gray-900 transition-colors font-semibold"
            >
              <div className="flex items-center justify-center gap-2">
                <X size={18} />
                Abandon Session
              </div>
            </button>
          </div>
        </div>
      </PixelCard>
    </div>
  );
};
