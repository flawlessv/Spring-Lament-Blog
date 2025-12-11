import { useState, useEffect } from "react";
import type { Category } from "../types";

const DEFAULT_CATEGORIES: Category[] = [
  { id: "tech", name: "技术", color: "#3B82F6" },
  { id: "life", name: "生活", color: "#10B981" },
  { id: "thoughts", name: "随想", color: "#8B5CF6" },
];

export function useCategories(open: boolean) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("获取分类失败:", error);
      setCategories(DEFAULT_CATEGORIES);
    }
  };

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  const createCategory = async (name: string, slug: string) => {
    setIsCreating(true);
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug }),
      });
      if (response.ok) {
        const newCategory = await response.json();
        setCategories((prev) => [...prev, newCategory]);
        return newCategory;
      } else {
        const error = await response.json();
        console.error("创建分类失败:", error);
        return null;
      }
    } catch (error) {
      console.error("创建分类失败:", error);
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    categories,
    isCreating,
    createCategory,
  };
}
