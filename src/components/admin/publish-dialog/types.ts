import { z } from "zod";
import { PublishData } from "../fullscreen-editor";
import type { AIRecommendation } from "../ai-assistant";

export type { AIRecommendation };

export const publishSchema = z.object({
  categoryId: z.string().optional(),
  coverImage: z
    .string()
    .url("请输入有效的图片URL")
    .optional()
    .or(z.literal("")),
  excerpt: z.string().max(500, "摘要不能超过500个字符").optional(),
  published: z.boolean(),
  featured: z.boolean(),
});

export type PublishFormData = z.infer<typeof publishSchema>;

export interface Category {
  id: string;
  name: string;
  color?: string;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface PublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPublish: (data: PublishData) => void;
  mode?: "create" | "edit";
  initialData?: Partial<PublishData>;
  aiSuggestedTags?: AIRecommendation;
  aiSuggestedCategories?: AIRecommendation;
  articleContent?: string;
}
