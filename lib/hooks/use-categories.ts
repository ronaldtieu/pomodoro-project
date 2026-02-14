import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { queries } from '@/lib/supabase/queries';
import { Category } from '@/types';

const DEFAULT_CATEGORIES = [
  { name: 'Work', color: '#FF6B6B' },
  { name: 'Study', color: '#4ECDC4' },
  { name: 'Personal', color: '#FFE66D' },
  { name: 'Health', color: '#95E616' },
];

let seedingInProgress = false;

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchCategories = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let userCategories = await queries.getCategories(supabase, user.id);

      // Seed defaults if user has no categories
      if (userCategories.length === 0 && !seedingInProgress) {
        seedingInProgress = true;
        try {
          const seeded: Category[] = [];
          for (const cat of DEFAULT_CATEGORIES) {
            const created = await queries.createCategory(supabase, {
              user_id: user.id,
              name: cat.name,
              color: cat.color,
            });
            seeded.push(created);
          }
          userCategories = seeded;
        } finally {
          seedingInProgress = false;
        }
      }

      // Deduplicate categories with the same name (keep oldest by created_at)
      const nameGroups: Record<string, Category[]> = {};
      for (const cat of userCategories) {
        if (!nameGroups[cat.name]) nameGroups[cat.name] = [];
        nameGroups[cat.name].push(cat);
      }

      const duplicateIds: string[] = [];
      for (const name of Object.keys(nameGroups)) {
        const group = nameGroups[name];
        if (group.length > 1) {
          group.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
          // Keep the first (oldest), delete the rest
          for (let i = 1; i < group.length; i++) {
            duplicateIds.push(group[i].id);
          }
        }
      }

      if (duplicateIds.length > 0) {
        await Promise.all(duplicateIds.map((id) => queries.deleteCategory(supabase, id)));
        userCategories = userCategories.filter((c) => !duplicateIds.includes(c.id));
      }

      setCategories(userCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (data: { name: string; color: string }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newCategory = await queries.createCategory(supabase, {
        user_id: user.id,
        name: data.name,
        color: data.color,
      });
      setCategories([...categories, newCategory]);
      return newCategory;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      const updated = await queries.updateCategory(supabase, id, updates);
      setCategories(categories.map((c) => (c.id === id ? updated : c)));
      return updated;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await queries.deleteCategory(supabase, id);
      setCategories(categories.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories,
  };
};
