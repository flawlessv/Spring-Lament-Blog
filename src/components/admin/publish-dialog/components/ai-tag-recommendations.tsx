import { Loader2 } from "lucide-react";
import type { Tag, AIRecommendation } from "../types";

interface AITagRecommendationsProps {
  recommendations?: AIRecommendation | null;
  tags: Tag[];
  selectedTags: string[];
  articleContent?: string;
  isCreating: boolean;
  isGenerating: boolean;
  onToggle: (tagId: string) => void;
  onCreate: (name: string) => void;
  onGenerate: () => void;
}

export function AITagRecommendations({
  recommendations,
  tags,
  selectedTags,
  articleContent,
  isCreating,
  isGenerating,
  onToggle,
  onCreate,
  onGenerate,
}: AITagRecommendationsProps) {
  const hasRecommendations =
    recommendations &&
    (recommendations.existing.length > 0 || recommendations.new.length > 0);

  if (hasRecommendations) {
    return (
      <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg space-y-2">
        <div className="flex items-center gap-2 text-xs text-primary font-medium">
          <span>✨ AI 推荐标签</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {recommendations.existing.map((tagName, index) => {
            const existingTag = tags.find(
              (t) => t.name.toLowerCase() === tagName.toLowerCase()
            );
            if (!existingTag) return null;

            const isSelected = selectedTags.includes(existingTag.id);

            return (
              <button
                key={`existing-${index}`}
                type="button"
                onClick={() => onToggle(existingTag.id)}
                className={`px-2 py-1 text-xs rounded-full transition-colors flex items-center gap-1 ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-primary/10 text-primary hover:bg-primary/20"
                }`}
              >
                🏷️ {tagName}
              </button>
            );
          })}

          {recommendations.new.map((tagName, index) => (
            <button
              key={`new-${index}`}
              type="button"
              disabled={isCreating}
              onClick={() => onCreate(tagName)}
              className="px-2 py-1 text-xs rounded-full transition-colors flex items-center gap-1 bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-800 dark:text-green-200 disabled:opacity-50"
            >
              ➕ {tagName}
              <span className="opacity-70">(新建)</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          🏷️ 点击选择已有标签 · ➕ 点击创建新标签
        </p>
      </div>
    );
  }

  if (articleContent?.trim()) {
    return (
      <button
        type="button"
        onClick={onGenerate}
        disabled={isGenerating}
        className="w-full p-2 text-xs border border-dashed border-primary/30 rounded-lg text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>AI 分析中...</span>
          </>
        ) : (
          <>
            <span>✨</span>
            <span>AI 智能推荐标签</span>
          </>
        )}
      </button>
    );
  }

  return null;
}
