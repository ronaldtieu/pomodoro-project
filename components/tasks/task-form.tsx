'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { PixelDialog } from '@/components/ui/pixel-dialog';
import { PixelInput } from '@/components/ui/pixel-input';
import { PixelButton } from '@/components/ui/pixel-button';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string }) => Promise<void>;
}

export const TaskForm: React.FC<TaskFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ title: title.trim(), description: description.trim() });
      setTitle('');
      setDescription('');
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PixelDialog isOpen={isOpen} onClose={onClose} title="Create New Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
            Title *
          </label>
          <PixelInput
            id="title"
            type="text"
            placeholder="What do you need to work on?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            placeholder="Add some details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 border-2 border-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900 placeholder-gray-500 shadow-pixel-sm transition-shadow resize-none"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <PixelButton type="button" onClick={onClose} variant="ghost" className="flex-1">
            Cancel
          </PixelButton>
          <PixelButton
            type="submit"
            variant="primary"
            disabled={!title.trim() || isSubmitting}
            className="flex-1"
          >
            <div className="flex items-center justify-center gap-2">
              <Plus size={18} />
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </div>
          </PixelButton>
        </div>
      </form>
    </PixelDialog>
  );
};
