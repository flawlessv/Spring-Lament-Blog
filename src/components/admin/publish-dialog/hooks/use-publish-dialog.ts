import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  publishSchema,
  type PublishFormData,
  type PublishDialogProps,
} from "../types";
import { useCategories } from "./use-categories";
import { useTags } from "./use-tags";
import { useAIRecommendations } from "./use-ai-recommendations";
import { generateSlug } from "../utils";

export function usePublishDialog({
  open,
  initialData,
  articleContent,
  aiSuggestedTags,
  aiSuggestedCategories,
  onPublish,
}: Pick<
  PublishDialogProps,
  | "open"
  | "initialData"
  | "articleContent"
  | "aiSuggestedTags"
  | "aiSuggestedCategories"
  | "onPublish"
>) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const {
    categories,
    isCreating: isCreatingCategory,
    createCategory,
  } = useCategories(open);
  const { tags, isCreating: isCreatingTag, createTag } = useTags(open);
  const {
    effectiveAiTags,
    effectiveAiCategories,
    isGeneratingTags,
    isGeneratingCategories,
    isGeneratingExcerpt,
    generateCategories,
    generateTags,
    generateExcerpt,
  } = useAIRecommendations(
    articleContent,
    aiSuggestedTags,
    aiSuggestedCategories
  );

  const form = useForm<PublishFormData>({
    resolver: zodResolver(publishSchema),
    defaultValues: {
      categoryId: undefined,
      coverImage: "",
      excerpt: "",
      published: true,
      featured: false,
    },
  });

  // 初始化表单数据
  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          categoryId: initialData.categoryId,
          coverImage: initialData.coverImage || "",
          excerpt: initialData.excerpt || "",
          published: initialData.published ?? true,
          featured: initialData.featured ?? false,
        });
        setSelectedTags(initialData.tags || []);
      } else {
        form.reset({
          categoryId: undefined,
          coverImage: "",
          excerpt: "",
          published: true,
          featured: false,
        });
        setSelectedTags([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialData]);

  const handleSubmit = async (data: PublishFormData) => {
    setIsLoading(true);
    try {
      await onPublish({
        ...data,
        tags: selectedTags,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleCreateTag = async (tagName: string) => {
    if (!tagName.trim()) return;
    const name = tagName.trim();
    const slug = generateSlug(name) || `tag-${Date.now()}`;
    const newTag = await createTag(name, slug);
    if (newTag) {
      setSelectedTags((prev) => [...prev, newTag.id]);
    }
  };

  const handleCreateCategory = async (categoryName: string) => {
    if (!categoryName.trim()) return;
    const name = categoryName.trim();
    const slug = generateSlug(name) || `category-${Date.now()}`;
    const newCategory = await createCategory(name, slug);
    if (newCategory) {
      form.setValue("categoryId", newCategory.id);
    }
  };

  const handleGenerateExcerpt = () => {
    generateExcerpt(form.setValue);
  };

  return {
    form,
    isLoading,
    selectedTags,
    categories,
    tags,
    isCreatingTag,
    isCreatingCategory,
    effectiveAiTags,
    effectiveAiCategories,
    isGeneratingTags,
    isGeneratingCategories,
    isGeneratingExcerpt,
    handleSubmit,
    handleTagToggle,
    handleCreateTag,
    handleCreateCategory,
    generateCategories,
    generateTags,
    handleGenerateExcerpt,
  };
}
