import { useState, useEffect } from "react";
import type { Tag } from "../types";

const DEFAULT_TAGS: Tag[] = [
  { id: "react", name: "React", color: "#61DAFB" },
  { id: "typescript", name: "TypeScript", color: "#3178C6" },
  { id: "nextjs", name: "Next.js", color: "#000000" },
  { id: "javascript", name: "JavaScript", color: "#F7DF1E" },
  { id: "css", name: "CSS", color: "#1572B6" },
  { id: "nodejs", name: "Node.js", color: "#339933" },
];

export function useTags(open: boolean) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const fetchTags = async () => {
    try {
      const response = await fetch("/api/admin/tags");
      if (response.ok) {
        const data = await response.json();
        setTags(data.tags);
      }
    } catch (error) {
      console.error("获取标签失败:", error);
      setTags(DEFAULT_TAGS);
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
