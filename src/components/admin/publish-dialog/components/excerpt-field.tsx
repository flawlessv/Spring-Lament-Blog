import { FileText, Loader2 } from "lucide-react";
import {
  FormField,
  FormItem,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import type { PublishFormData } from "../types";

interface ExcerptFieldProps {
  control: Control<PublishFormData>;
  articleContent?: string;
  isGenerating: boolean;
  onGenerate: () => void;
}

export function ExcerptField({
  control,
  articleContent,
  isGenerating,
  onGenerate,
}: ExcerptFieldProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm font-medium">
          <FileText className="h-4 w-4" />
          <span>文章摘要</span>
        </div>
        {articleContent?.trim() && (
          <button
            type="button"
            onClick={onGenerate}
            disabled={isGenerating}
            className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>生成中...</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>AI 生成</span>
              </>
            )}
          </button>
        )}
      </div>
      <FormField
        control={control}
        name="excerpt"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea
                placeholder="输入文章摘要 (可选)..."
                rows={3}
                {...field}
              />
            </FormControl>
            <FormDescription className="text-xs">
              用于文章列表展示和SEO优化，不超过500字符
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
