import { useState, useEffect } from "react";
import type { Tag } from "../types";

export function useTags(open: boolean) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const fetchTags = async () => {
    try {
      const response = await fetch("/api/admin/tags");
      if (response.ok) {
        const data = await response.json();
        setTags(data.tags || []);
      } else {
        setTags([]);
      }
    } catch (error) {
      console.error("获取标签失败:", error);
      setTags([]);
    }
  };

  useEffect(() => {
    if (open) {
      fetchTags();
    }
  }, [open]);

  const createTag = async (name: string, slug: string) => {
    setIsCreating(true);
    try {
      const response = await fetch("/api/admin/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug }),
      });
      if (response.ok) {
        const newTag = await response.json();
        setTags((prev) => [...prev, newTag]);
        return newTag;
      } else {
        const error = await response.json();
        console.error("创建标签失败:", error);
        return null;
      }
    } catch (error) {
      console.error("创建标签失败:", error);
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    tags,
    isCreating,
    createTag,
  };
}
