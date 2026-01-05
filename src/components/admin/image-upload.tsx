"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  type?: "cover" | "content" | "avatar";
  aspectRatio?: "16:9" | "4:3" | "1:1";
  maxSize?: number; // MB
}

export default function ImageUpload({
  value,
  onChange,
  type = "cover",
  aspectRatio = "16:9",
  maxSize = 5,
}: ImageUploadProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith("image/")) {
      toast({
        title: "文件类型错误",
        description: "请选择图片文件",
        variant: "destructive",
      });
      return;
    }

    // 验证文件大小
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "文件过大",
        description: `图片大小不能超过 ${maxSize}MB`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "上传失败");
      }

      const data = await response.json();
      onChange(data.url);

      toast({
        title: "上传成功",
        description: "图片已保存",
        variant: "success",
      });
    } catch (error) {
      console.error("上传失败:", error);
      toast({
        title: "上传失败",
        description: error instanceof Error ? error.message : "请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // 重置文件输入
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  const aspectRatioClass = {
    "16:9": "aspect-video",
    "4:3": "aspect-[4/3]",
    "1:1": "aspect-square",
  }[aspectRatio];

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {value ? (
        <div className="relative group">
          <div
            className={`${aspectRatioClass} rounded-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-700`}
          >
            <img
              src={value}
              alt="预览"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-lg">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-1" />
              更换
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
            >
              <X className="h-4 w-4 mr-1" />
              删除
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={`${aspectRatioClass} rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-600 transition-colors bg-gray-50 dark:bg-gray-900`}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-12 w-12 text-muted-foreground animate-spin mb-2" />
              <p className="text-sm text-muted-foreground">上传中...</p>
            </>
          ) : (
            <>
              <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-1">点击上传图片</p>
              <p className="text-xs text-muted-foreground">
                支持 JPG、PNG、GIF、WebP
              </p>
              <p className="text-xs text-muted-foreground">最大 {maxSize}MB</p>
            </>
          )}
        </div>
      )}

      {value && (
        <p className="text-xs text-muted-foreground break-all">{value}</p>
      )}
    </div>
  );
}
