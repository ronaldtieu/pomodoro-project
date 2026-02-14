'use client';

import React, { useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { PixelButton } from '@/components/ui/pixel-button';
import { PixelInput } from '@/components/ui/pixel-input';
import { Category } from '@/types';

const PRESET_COLORS = [
  '#FF6B6B', '#FF8E53', '#FFE66D', '#95E616',
  '#4ECDC4', '#45B7D1', '#6C5CE7', '#A55EEA',
  '#FD79A8', '#E17055', '#6B7280', '#2D3436',
];

interface CategoryManagerProps {
  categories: Category[];
  onCreateCategory: (data: { name: string; color: string }) => Promise<Category | undefined>;
  onUpdateCategory: (id: string, updates: Partial<Category>) => Promise<Category | undefined>;
  onDeleteCategory: (id: string) => Promise<void>;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');

  const handleCreate = async () => {
    if (!newName.trim()) return;
    await onCreateCategory({ name: newName.trim(), color: newColor });
    setNewName('');
    setNewColor(PRESET_COLORS[0]);
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditColor(category.color);
  };

  const handleUpdate = async () => {
    if (!editingId || !editName.trim()) return;
    await onUpdateCategory(editingId, { name: editName.trim(), color: editColor });
    setEditingId(null);
  };

  return (
    <div className="bg-surface border-2 border-gray-900 pixel-rounded p-4 shadow-pixel-sm space-y-4">
      <h3 className="text-lg font-bold text-gray-900">Manage Categories</h3>

      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center gap-2">
            {editingId === cat.id ? (
              <>
                <PixelInput
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1"
                />
                <div className="flex gap-1">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setEditColor(color)}
                      className={`w-5 h-5 pixel-rounded border-2 transition-all ${
                        editColor === color ? 'border-gray-900 scale-110 shadow-pixel-sm' : 'border-transparent hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <button onClick={handleUpdate} className="p-1.5 pixel-rounded border-2 border-gray-400 text-success hover:border-success shadow-pixel-sm active:translate-y-0.5 active:shadow-none transition-all">
                  <Check size={16} strokeWidth={3} />
                </button>
                <button onClick={() => setEditingId(null)} className="p-1.5 pixel-rounded border-2 border-gray-400 text-gray-400 hover:text-gray-600 hover:border-gray-900 shadow-pixel-sm active:translate-y-0.5 active:shadow-none transition-all">
                  <X size={16} strokeWidth={3} />
                </button>
              </>
            ) : (
              <>
                <span
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="flex-1 font-medium text-gray-900">{cat.name}</span>
                <button onClick={() => startEdit(cat)} className="p-1.5 pixel-rounded border-2 border-gray-400 text-gray-400 hover:text-gray-600 hover:border-gray-900 shadow-pixel-sm active:translate-y-0.5 active:shadow-none transition-all">
                  <Pencil size={14} />
                </button>
                <button onClick={() => onDeleteCategory(cat.id)} className="p-1.5 pixel-rounded border-2 border-gray-400 text-gray-400 hover:text-red-500 hover:border-red-300 shadow-pixel-sm active:translate-y-0.5 active:shadow-none transition-all">
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-3 space-y-2">
        <div className="flex items-center gap-2">
          <PixelInput
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New category name"
            className="flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
          <PixelButton onClick={handleCreate} variant="primary" size="sm" disabled={!newName.trim()}>
            <Plus size={16} />
          </PixelButton>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setNewColor(color)}
              className={`w-6 h-6 pixel-rounded border-2 transition-all ${
                newColor === color ? 'border-gray-900 scale-110 shadow-pixel-sm' : 'border-transparent hover:border-gray-400'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
