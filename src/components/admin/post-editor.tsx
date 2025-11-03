"use client";

/**
 * 文章编辑器组件
 *
 * 提供完整的文章创建和编辑功能
 * 包括 Markdown 编辑、实时预览、分类标签管理等
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Save,
  Eye,
  Send,
  ArrowLeft,
  Loader2,
  Image,
  Link2,
  Bold,
  Italic,
  Code,
  List,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MarkdownRenderer from "@/components/markdown/markdown-renderer";

// 表单验证 schema
const postSchema = z.object({
  title: z.string().min(1, "标题不能为空").max(200, "标题不能超过200个字符"),
  slug: z
    .string()
    .min(1, "URL slug不能为空")
    .max(100, "URL slug不能超过100个字符"),
  excerpt: z.string().max(500, "摘要不能超过500个字符").optional(),
  content: z.string().min(1, "内容不能为空"),
  coverImage: z
    .string()
    .url("请输入有效的图片URL")
    .optional()
    .or(z.literal("")),
  published: z.boolean(),
  featured: z.boolean(),
  categoryId: z.string().optional(),
});

type PostFormData = z.infer<typeof postSchema>;

// 分类和标签数据类型
interface Category {
  id: string;
  name: string;
  color?: string;
}

interface Tag {
  id: string;
  name: string;
  color?: string;
}

interface PostEditorProps {
  mode: "create" | "edit";
  postId?: string;
}

export default function PostEditor({ mode, postId }: PostEditorProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      published: false,
      featured: false,
      categoryId: undefined,
    },
  });

  const { watch, setValue } = form;
  const title = watch("title");
  const content = watch("content");

  // 自动生成 slug
  useEffect(() => {
    if (mode === "create" && title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      setValue("slug", slug);
    }
  }, [title, mode, setValue]);

  // 获取分类数据
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("获取分类失败:", error);
      // 使用默认分类
      setCategories([
        { id: "tech", name: "技术", color: "#3B82F6" },
        { id: "life", name: "生活", color: "#10B981" },
        { id: "thoughts", name: "随想", color: "#8B5CF6" },
      ]);
    }
  };

  // 获取标签数据
  const fetchTags = async () => {
    try {
      const response = await fetch("/api/admin/tags");
      if (response.ok) {
        const data = await response.json();
        setTags(data.tags);
      }
    } catch (error) {
      console.error("获取标签失败:", error);
      // 使用默认标签
      setTags([
        { id: "react", name: "React", color: "#61DAFB" },
        { id: "typescript", name: "TypeScript", color: "#3178C6" },
        { id: "nextjs", name: "Next.js", color: "#000000" },
      ]);
    }
  };

  // 初始化分类和标签数据
  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

  // 加载现有文章数据（编辑模式）
  useEffect(() => {
    if (mode === "edit" && postId) {
      loadPost();
    }
  }, [mode, postId]);

  const loadPost = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/posts/${postId}`);

      if (!response.ok) {
        throw new Error("加载文章失败");
      }

      const post = await response.json();

      // 填充表单数据
      form.reset({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || "",
        content: post.content,
        coverImage: post.coverImage || "",
        published: post.published,
        featured: post.featured,
        categoryId: post.categoryId ?? undefined,
      });

      // 设置选中的标签
      if (post.tags) {
        setSelectedTags(post.tags.map((tag: any) => tag.id));
      }
    } catch (error) {
      console.error("加载文章失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: PostFormData) => {
    try {
      setIsSaving(true);

      const url =
        mode === "create" ? "/api/admin/posts" : `/api/admin/posts/${postId}`;

      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          tags: selectedTags, // 包含选中的标签
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "保存文章失败");
      }

      // 成功后重定向到文章列表
      router.push("/admin/posts");
    } catch (error) {
      console.error("保存文章失败:", error);
      alert(error instanceof Error ? error.message : "保存失败，请重试");
    } finally {
      setIsSaving(false);
    }
  };

  // 保存草稿
  const saveDraft = async () => {
    const data = form.getValues();
    data.published = false;
    await onSubmit(data);
  };

  // 发布文章
  const publishPost = async () => {
    const data = form.getValues();
    data.published = true;
    await onSubmit(data);
  };

  // Markdown 工具栏按钮
  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = document.querySelector(
      'textarea[name="content"]'
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end);

    setValue("content", newText);

    // 恢复光标位置
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 主要内容区域 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 标题 */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>文章标题</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="输入文章标题..."
                      className="text-lg"
                      {...field}
                    />
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
                    文章的 URL 路径，会自动根据标题生成
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 摘要 */}
            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>文章摘要（可选）</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="输入文章摘要..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    用于文章列表展示和SEO，不超过500字符
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 内容编辑器 */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>文章内容</FormLabel>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPreview(!showPreview)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {showPreview ? "编辑" : "预览"}
                      </Button>
                    </div>
                  </div>

                  {!showPreview && (
                    <>
                      {/* Markdown 工具栏 */}
                      <div className="flex items-center space-x-1 p-2 border border-border rounded-t-md bg-muted/50">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => insertMarkdown("**", "**")}
                        >
                          <Bold className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => insertMarkdown("*", "*")}
                        >
                          <Italic className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => insertMarkdown("`", "`")}
                        >
                          <Code className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => insertMarkdown("- ")}
                        >
                          <List className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => insertMarkdown("> ")}
                        >
                          <Quote className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => insertMarkdown("[链接文字](", ")")}
                        >
                          <Link2 className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => insertMarkdown("![图片描述](", ")")}
                        >
                          <Image className="h-4 w-4" />
                        </Button>
                      </div>

                      <FormControl>
                        <Textarea
                          placeholder="使用 Markdown 语法编写文章内容..."
                          rows={20}
                          className="rounded-t-none font-mono"
                          {...field}
                        />
                      </FormControl>
                    </>
                  )}

                  {showPreview && (
                    <div className="border border-border rounded-md p-4 min-h-[400px] bg-background">
                      <MarkdownRenderer content={content} showToc={false} />
                    </div>
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 操作按钮 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">发布</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <FormField
                    control={form.control}
                    name="published"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          发布文章
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          设为精选
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <Button
                    type="button"
                    onClick={saveDraft}
                    variant="outline"
                    disabled={isSaving}
                    className="w-full"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    保存草稿
                  </Button>

                  <Button
                    type="button"
                    onClick={publishPost}
                    disabled={isSaving}
                    className="w-full"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    {mode === "create" ? "发布文章" : "更新文章"}
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.back()}
                  className="w-full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  返回1
                </Button>
              </CardContent>
            </Card>

            {/* 分类设置 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">分类</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={(v) =>
                          field.onChange(v === "none" ? undefined : v)
                        }
                        value={field.value ?? undefined}
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
                              <div className="flex items-center space-x-2">
                                {category.color && (
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: category.color }}
                                  />
                                )}
                                <span>{category.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* 标签设置 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">标签</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* 标签选择 */}
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    选择标签（可多选）
                  </div>
                  <div className="max-h-40 overflow-y-auto border border-border rounded-md p-2">
                    {tags.map((tag) => (
                      <div
                        key={tag.id}
                        className="flex items-center space-x-2 py-1"
                      >
                        <Checkbox
                          id={`tag-${tag.id}`}
                          checked={selectedTags.includes(tag.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTags([...selectedTags, tag.id]);
                            } else {
                              setSelectedTags(
                                selectedTags.filter((id) => id !== tag.id)
                              );
                            }
                          }}
                        />
                        <label
                          htmlFor={`tag-${tag.id}`}
                          className="flex items-center space-x-2 text-sm cursor-pointer"
                        >
                          {tag.color && (
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: tag.color }}
                            />
                          )}
                          <span>{tag.name}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 已选标签显示 */}
                {selectedTags.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      已选标签 ({selectedTags.length})
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {selectedTags.map((tagId) => {
                        const tag = tags.find((t) => t.id === tagId);
                        if (!tag) return null;
                        return (
                          <Badge
                            key={tagId}
                            variant="secondary"
                            className="text-xs"
                            style={
                              tag.color
                                ? {
                                    backgroundColor: tag.color + "20",
                                    borderColor: tag.color,
                                  }
                                : {}
                            }
                          >
                            {tag.name}
                            <button
                              type="button"
                              className="ml-1 hover:text-red-500"
                              onClick={() =>
                                setSelectedTags(
                                  selectedTags.filter((id) => id !== tagId)
                                )
                              }
                            >
                              ×
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 封面图片 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">封面图片</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="coverImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="图片 URL" {...field} />
                      </FormControl>
                      <FormDescription className="text-xs">
                        输入封面图片的 URL 地址
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
