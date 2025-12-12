import { Folder } from "lucide-react";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control } from "react-hook-form";
import type { PublishFormData, Category, AIRecommendation } from "../types";
import { AICategoryRecommendations } from "./ai-category-recommendations";

interface CategorySectionProps {
  control: Control<PublishFormData>;
  categories: Category[];
  effectiveAiCategories?: AIRecommendation | null;
  articleContent?: string;
  isCreating: boolean;
  isGenerating: boolean;
  onSelectCategory: (categoryId: string) => void;
  onCreateCategory: (name: string) => void;
  onGenerateCategories: () => void;
}

export function CategorySection({
  control,
  categories,
  effectiveAiCategories,
  articleContent,
  isCreating,
  isGenerating,
  onSelectCategory,
  onCreateCategory,
  onGenerateCategories,
}: CategorySectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2 text-sm font-medium">
        <Folder className="h-4 w-4" />
        <span>分类</span>
      </div>

      <AICategoryRecommendations
        recommendations={effectiveAiCategories}
        categories={categories}
        articleContent={articleContent}
        isCreating={isCreating}
        isGenerating={isGenerating}
        onSelect={onSelectCategory}
        onCreate={onCreateCategory}
        onGenerate={onGenerateCategories}
      />

      <FormField
        control={control}
        name="categoryId"
        render={({ field }) => (
          <FormItem>
            <Select
              onValueChange={(v) =>
                field.onChange(v === "none" ? undefined : v)
              }
              value={field.value ?? "none"}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="选择分类" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">无分类</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
