'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X, Check, Save } from 'lucide-react';
import { PixelDialog } from '@/components/ui/pixel-dialog';
import { PixelInput } from '@/components/ui/pixel-input';
import { PixelButton } from '@/components/ui/pixel-button';
import { Category, Task } from '@/types';

const PRESET_COLORS = [
  '#FF6B6B', '#FF8E53', '#FFE66D', '#95E616',
  '#4ECDC4', '#45B7D1', '#6C5CE7', '#A55EEA',
  '#FD79A8', '#E17055', '#6B7280', '#2D3436',
];

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; category_id: string | null }) => Promise<void>;
  categories?: Category[];
  onCreateCategory?: (data: { name: string; color: string }) => Promise<Category | undefined>;
  mode?: 'create' | 'edit';
  initialTask?: Task | null;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categories = [],
  onCreateCategory,
  mode = 'create',
  initialTask,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInlineCreate, setShowInlineCreate] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState(PRESET_COLORS[0]);
  const [isCreatingCat, setIsCreatingCat] = useState(false);

  const isEdit = mode === 'edit';

  useEffect(() => {
    if (isOpen && isEdit && initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setCategoryId(initialTask.category_id);
    } else if (isOpen && !isEdit) {
      setTitle('');
      setDescription('');
      setCategoryId(null);
    }
    setShowInlineCreate(false);
  }, [isOpen, isEdit, initialTask]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ title: title.trim(), description: description.trim(), category_id: categoryId });
      setTitle('');
      setDescription('');
      setCategoryId(null);
      setShowInlineCreate(false);
      onClose();
    } catch (error) {
      console.error(`Error ${isEdit ? 'updating' : 'creating'} task:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCatName.trim() || !onCreateCategory) return;
    setIsCreatingCat(true);
    try {
      const created = await onCreateCategory({ name: newCatName.trim(), color: newCatColor });
      if (created) {
        setCategoryId(created.id);
      }
      setNewCatName('');
      setNewCatColor(PRESET_COLORS[0]);
      setShowInlineCreate(false);
    } catch (error) {
      console.error('Error creating category:', error);
    } finally {
      setIsCreatingCat(false);
    }
  };

  return (
    <PixelDialog isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Task' : 'Create New Task'}>
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

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategoryId(null)}
              className={`px-3 py-1.5 pixel-rounded text-sm font-medium border-2 shadow-pixel-sm active:translate-y-0.5 active:shadow-none transition-all ${
                categoryId === null
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-400 bg-white text-gray-700 hover:border-gray-900'
              }`}
            >
              None
            </button>
            {categories.map((cat) => (
              <button
                type="button"
                key={cat.id}
                onClick={() => setCategoryId(categoryId === cat.id ? null : cat.id)}
                className={`px-3 py-1.5 pixel-rounded text-sm font-medium border-2 shadow-pixel-sm active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 ${
                  categoryId === cat.id
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-400 bg-white text-gray-700 hover:border-gray-900'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                {cat.name}
              </button>
            ))}
            {onCreateCategory && (
              <button
                type="button"
                onClick={() => setShowInlineCreate(!showInlineCreate)}
                className={`px-2.5 py-1.5 pixel-rounded text-sm font-medium border-2 border-dashed shadow-pixel-sm active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1 ${
                  showInlineCreate
                    ? 'border-gray-900 bg-gray-100 text-gray-900'
                    : 'border-gray-400 bg-white text-gray-500 hover:border-gray-900 hover:text-gray-700'
                }`}
              >
                <Plus size={14} />
              </button>
            )}
          </div>

          {showInlineCreate && onCreateCategory && (
            <div className="mt-3 p-3 bg-surface border-2 border-gray-900 pixel-rounded shadow-pixel-sm space-y-2">
              <div className="flex items-center gap-2">
                <PixelInput
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Category name"
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleCreateCategory())}
                />
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  disabled={!newCatName.trim() || isCreatingCat}
                  className="p-1.5 pixel-rounded border-2 border-gray-400 text-success hover:border-success shadow-pixel-sm active:translate-y-0.5 active:shadow-none disabled:opacity-50 transition-all"
                >
                  <Check size={18} strokeWidth={3} />
                </button>
                <button
                  type="button"
                  onClick={() => { setShowInlineCreate(false); setNewCatName(''); setNewCatColor(PRESET_COLORS[0]); }}
                  className="p-1.5 pixel-rounded border-2 border-gray-400 text-gray-400 hover:text-primary hover:border-primary shadow-pixel-sm active:translate-y-0.5 active:shadow-none transition-all"
                >
                  <X size={18} strokeWidth={3} />
                </button>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewCatColor(color)}
                    className={`w-6 h-6 pixel-rounded border-2 transition-all ${
                      newCatColor === color ? 'border-gray-900 scale-110 shadow-pixel-sm' : 'border-transparent hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}
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
              {isEdit ? <Save size={18} /> : <Plus size={18} />}
              {isSubmitting
                ? (isEdit ? 'Saving...' : 'Creating...')
                : (isEdit ? 'Save Changes' : 'Create Task')
              }
            </div>
          </PixelButton>
        </div>
      </form>
    </PixelDialog>
  );
};
