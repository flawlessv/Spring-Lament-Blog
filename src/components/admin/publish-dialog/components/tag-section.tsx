import { Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { Tag as TagType, AIRecommendation } from "../types";
import { AITagRecommendations } from "./ai-tag-recommendations";

interface TagSectionProps {
  tags: TagType[];
  selectedTags: string[];
  effectiveAiTags?: AIRecommendation | null;
  articleContent?: string;
  isCreating: boolean;
  isGenerating: boolean;
  onToggle: (tagId: string) => void;
  onCreate: (name: string) => void;
  onGenerate: () => void;
}

export function TagSection({
  tags,
  selectedTags,
  effectiveAiTags,
  articleContent,
  isCreating,
  isGenerating,
  onToggle,
  onCreate,
  onGenerate,
}: TagSectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2 text-sm font-medium">
        <Tag className="h-4 w-4" />
        <span>标签</span>
      </div>

      <AITagRecommendations
        recommendations={effectiveAiTags}
        tags={tags}
        selectedTags={selectedTags}
        articleContent={articleContent}
        isCreating={isCreating}
        isGenerating={isGenerating}
        onToggle={onToggle}
        onCreate={onCreate}
        onGenerate={onGenerate}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border rounded-md p-3">
        {tags.map((tag) => (
          <div key={tag.id} className="flex items-center space-x-2">
            <Checkbox
              id={`tag-${tag.id}`}
              checked={selectedTags.includes(tag.id)}
              onCheckedChange={() => onToggle(tag.id)}
            />
            <label htmlFor={`tag-${tag.id}`} className="text-sm cursor-pointer">
              {tag.name}
            </label>
          </div>
        ))}
      </div>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedTags.map((tagId) => {
            const tag = tags.find((t) => t.id === tagId);
            if (!tag) return null;
            return (
              <Badge key={tagId} variant="secondary" className="text-xs">
                {tag.name}
                <button
                  type="button"
                  className="ml-1 hover:text-red-500"
                  onClick={() => onToggle(tagId)}
                >
                  ×
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
