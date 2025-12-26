import { useState } from "react";
import type { AIRecommendation } from "../../ai-assistant";
import { UseFormSetValue } from "react-hook-form";
import type { PublishFormData } from "../types";

export function useAIRecommendations(
  articleContent?: string,
  externalTags?: AIRecommendation,
  externalCategories?: AIRecommendation
) {
  const [localAiTags, setLocalAiTags] = useState<AIRecommendation | null>(null);
  const [localAiCategories, setLocalAiCategories] =
    useState<AIRecommendation | null>(null);
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [isGeneratingCategories, setIsGeneratingCategories] = useState(false);
  const [isGeneratingExcerpt, setIsGeneratingExcerpt] = useState(false);

  const effectiveAiTags = externalTags || localAiTags;
  const effectiveAiCategories = externalCategories || localAiCategories;

  const generateCategories = async () => {
    if (!articleContent?.trim()) return;
    setIsGeneratingCategories(true);
    try {
      const response = await fetch("/api/ai/write/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "category", content: articleContent }),
      });
      if (response.ok) {
        const data = await response.json();
        setLocalAiCategories(data.results);
      }
    } catch (error) {
      console.error("生成分类推荐失败:", error);
    } finally {
      setIsGeneratingCategories(false);
    }
  };

  const generateTags = async () => {
    if (!articleContent?.trim()) return;
    setIsGeneratingTags(true);
    try {
      const response = await fetch("/api/ai/write/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "tags", content: articleContent }),
      });
      if (response.ok) {
        const data = await response.json();
        setLocalAiTags(data.results);
      }
    } catch (error) {
      console.error("生成标签推荐失败:", error);
    } finally {
      setIsGeneratingTags(false);
    }
  };

  const generateExcerpt = async (
    setValue: UseFormSetValue<PublishFormData>
  ) => {
    if (!articleContent?.trim()) return;
    setIsGeneratingExcerpt(true);
    try {
      const response = await fetch("/api/ai/write/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "excerpt", content: articleContent }),
      });
      if (response.ok) {
        const data = await response.json();
        if (typeof data.results === "string") {
          setValue("excerpt", data.results);
        }
      }
    } catch (error) {
      console.error("生成摘要失败:", error);
    } finally {
      setIsGeneratingExcerpt(false);
    }
  };

  return {
    effectiveAiTags,
    effectiveAiCategories,
    isGeneratingTags,
    isGeneratingCategories,
    isGeneratingExcerpt,
    generateCategories,
    generateTags,
    generateExcerpt,
  };
}
