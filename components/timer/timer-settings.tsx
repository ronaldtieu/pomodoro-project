'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Coffee, RotateCcw } from 'lucide-react';
import { PixelCard } from '@/components/ui/pixel-card';
import { PixelButton } from '@/components/ui/pixel-button';
import { PixelInput } from '@/components/ui/pixel-input';
import { createClient } from '@/lib/supabase/client';

interface TimerSettingsProps {
  onSettingsChange?: () => void;
}

export const TimerSettings: React.FC<TimerSettingsProps> = ({ onSettingsChange }) => {
  const [workDuration, setWorkDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [sessionsUntilLongBreak, setSessionsUntilLongBreak] = useState(4);
  const [isSaving, setIsSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const supabase = createClient();
      const { data: settings } = await supabase
        .from('user_settings')
        .select('*')
        .single();

      if (settings) {
        setWorkDuration(settings.work_duration);
        setShortBreakDuration(settings.short_break_duration);
        setLongBreakDuration(settings.long_break_duration);
        setSessionsUntilLongBreak(settings.sessions_until_long_break);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase
          .from('user_settings')
          .upsert({
            user_id: user.id,
            work_duration: workDuration,
            short_break_duration: shortBreakDuration,
            long_break_duration: longBreakDuration,
            sessions_until_long_break: sessionsUntilLongBreak,
            updated_at: new Date().toISOString(),
          });

        if (error) throw error;

        if (onSettingsChange) {
          onSettingsChange();
        }
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) {
    return (
      <PixelButton
        onClick={() => setIsOpen(true)}
        variant="ghost"
        className="w-full"
      >
        <div className="flex items-center justify-center gap-2">
          <RotateCcw size={20} />
          Timer Settings
        </div>
      </PixelButton>
    );
  }

  return (
    <PixelCard>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900">Timer Settings</h3>
          <PixelButton
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="sm"
          >
            Close
          </PixelButton>
        </div>

        <div className="space-y-6">
          {/* Work Duration */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Clock className="text-primary" size={28} />
            </div>
            <div className="flex-1">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Work Duration (minutes)
              </label>
              <PixelInput
                type="number"
                min="1"
                max="120"
                value={workDuration}
                onChange={(e) => setWorkDuration(parseInt(e.target.value) || 25)}
                className="w-full"
              />
            </div>
          </div>

          {/* Short Break */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary/10 rounded-lg">
              <Coffee className="text-secondary" size={28} />
            </div>
            <div className="flex-1">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Short Break (minutes)
              </label>
              <PixelInput
                type="number"
                min="1"
                max="30"
                value={shortBreakDuration}
                onChange={(e) => setShortBreakDuration(parseInt(e.target.value) || 5)}
                className="w-full"
              />
            </div>
          </div>

          {/* Long Break */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/10 rounded-lg">
              <Coffee className="text-accent" size={28} />
            </div>
            <div className="flex-1">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Long Break (minutes)
              </label>
              <PixelInput
                type="number"
                min="1"
                max="60"
                value={longBreakDuration}
                onChange={(e) => setLongBreakDuration(parseInt(e.target.value) || 15)}
                className="w-full"
              />
            </div>
          </div>

          {/* Sessions Until Long Break */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-lg">
              <RotateCcw className="text-gray-600" size={28} />
            </div>
            <div className="flex-1">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Sessions Until Long Break
              </label>
              <PixelInput
                type="number"
                min="2"
                max="10"
                value={sessionsUntilLongBreak}
                onChange={(e) => setSessionsUntilLongBreak(parseInt(e.target.value) || 4)}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <PixelButton
          onClick={handleSave}
          variant="primary"
          disabled={isSaving}
          className="w-full text-xl py-4"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </PixelButton>
      </div>
    </PixelCard>
  );
};
