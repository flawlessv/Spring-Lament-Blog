"use client";

/**
 * 标签创建/编辑对话框组件
 *
 * 提供标签的创建和编辑功能
 */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { LoadingButton } from "@/components/ui/loading";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

// 表单验证 schema
const tagSchema = z.object({
  name: z
    .string()
    .min(1, "标签名称不能为空")
    .max(30, "标签名称不能超过30个字符"),
  slug: z
    .string()
    .min(1, "URL slug不能为空")
    .max(30, "URL slug不能超过30个字符"),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "请输入有效的颜色代码")
    .optional()
    .or(z.literal("")),
});

type TagFormData = z.infer<typeof tagSchema>;

// 预设颜色选项
const colorOptions = [
  "#3B82F6", // Blue
  "#10B981", // Emerald
  "#8B5CF6", // Violet
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#EC4899", // Pink
  "#6366F1", // Indigo
  "#14B8A6", // Teal
  "#F97316", // Orange
  "#84CC16", // Lime
  "#06B6D4", // Cyan
  "#8B5A2B", // Brown
];

interface TagDialogProps {
  open: boolean;
  onClose: () => void;
  tag?: any;
}

export default function TagDialog({ open, onClose, tag }: TagDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const isEdit = !!tag;

  const form = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: "",
      slug: "",
      color: "",
    },
  });

  const { watch, setValue, reset } = form;
  const name = watch("name");
  const color = watch("color");

  // 自动生成 slug
  useEffect(() => {
    if (!isEdit && name) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      setValue("slug", slug);
    }
  }, [name, isEdit, setValue]);

  // 当对话框打开时，填充编辑数据
  useEffect(() => {
    if (open) {
      if (tag) {
        reset({
          name: tag.name,
          slug: tag.slug,
          color: tag.color || "",
        });
      } else {
        reset({
          name: "",
          slug: "",
          color: "",
        });
      }
    }
  }, [open, tag, reset]);

  const onSubmit = async (data: TagFormData) => {
    try {
      setIsLoading(true);

      const url = isEdit ? `/api/admin/tags/${tag.id}` : "/api/admin/tags";

      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "操作失败");
      }

      // 成功后关闭对话框
      toast({
        title: isEdit ? "更新成功" : "创建成功",
        description: `标签"${data.name}"已${isEdit ? "更新" : "创建"}成功`,
        variant: "success",
      });

      onClose();
      // 刷新页面以显示更新
      window.location.reload();
    } catch (error) {
      console.error("操作失败:", error);
      toast({
        title: "操作失败",
        description:
          error instanceof Error ? error.message : "操作失败，请重试",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "编辑标签" : "新建标签"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* 标签名称 */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>标签名称</FormLabel>
                  <FormControl>
                    <Input placeholder="输入标签名称" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* URL Slug */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="url-slug" {...field} />
                  </FormControl>
                  <FormDescription>
                    用于URL路径，会自动根据标签名称生成
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 颜色选择 */}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>颜色（可选）</FormLabel>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Input
                          placeholder="#3B82F6"
                          {...field}
                          className="w-24 font-mono"
                        />
                      </FormControl>
                      {color && (
                        <div
                          className="w-8 h-8 rounded border border-border"
                          style={{ backgroundColor: color }}
                        />
                      )}
                    </div>
                    <div className="grid grid-cols-6 gap-2">
                      {colorOptions.map((colorOption) => (
                        <button
                          key={colorOption}
                          type="button"
                          className="w-8 h-8 rounded border border-border hover:scale-110 transition-transform"
                          style={{ backgroundColor: colorOption }}
                          onClick={() => setValue("color", colorOption)}
                        />
                      ))}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 按钮 */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                取消
              </Button>
              <LoadingButton type="submit" isLoading={isLoading}>
                {isEdit ? "更新标签" : "创建标签"}
              </LoadingButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
