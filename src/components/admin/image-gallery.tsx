"use client";

import { useState, useEffect } from "react";
import {
  Trash2,
  Download,
  Search,
  Image as ImageIcon,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "./image-upload";
import Image from "next/image";

interface Post {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  totalImages: number;
  imageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function ImageGallery() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [updatingPostId, setUpdatingPostId] = useState<string | null>(null);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/posts/list");
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      }
    } catch (error) {
      console.error("加载文章失败:", error);
      toast({
        title: "加载失败",
        description: "无法加载文章列表",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const updateCoverImage = async (postId: string, coverImage: string) => {
    try {
      setUpdatingPostId(postId);
      const response = await fetch(`/api/admin/posts/${postId}/images`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverImage }),
      });

      if (response.ok) {
        toast({
          title: "更新成功",
          description: "封面图已更新",
          variant: "success",
        });
        loadPosts();
      } else {
        throw new Error("更新失败");
      }
    } catch (error) {
      toast({
        title: "更新失败",
        description: "无法更新封面图",
        variant: "destructive",
      });
    } finally {
      setUpdatingPostId(null);
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* 搜索栏 */}
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="搜索文章..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
      </div>

      {/* 统计信息 */}
      <div className="text-sm text-muted-foreground">
        共 {filteredPosts.length} 篇文章
        {search && ` (搜索结果)`}
      </div>

      {/* 文章列表 */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">加载中...</div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>暂无文章</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="border rounded-lg overflow-hidden bg-card"
            >
              {/* 文章标题栏 */}
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() =>
                  setExpandedPostId(expandedPostId === post.id ? null : post.id)
                }
              >
                <div className="flex items-center gap-4 flex-1">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <h3 className="font-medium">{post.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span>{post.imageCount} 张配图</span>
                      <span>•</span>
                      <span>
                        {post.coverImage ? "已设置封面" : "未设置封面"}
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    共 {post.totalImages} 张图片
                  </Badge>
                </div>
                {expandedPostId === post.id ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground ml-4" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground ml-4" />
                )}
              </div>

              {/* 展开的图片管理区域 */}
              {expandedPostId === post.id && (
                <div className="border-t p-4 space-y-4 bg-muted/30">
                  {/* 封面图管理 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <ImageIcon className="h-3.5 w-3.5" />
                        封面图
                      </h4>
                      {post.coverImage && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => updateCoverImage(post.id, "")}
                          disabled={updatingPostId === post.id}
                        >
                          移除封面
                        </Button>
                      )}
                    </div>
                    <div className="border rounded-lg p-3 bg-background">
                      <div className="max-w-md">
                        <ImageUpload
                          value={post.coverImage || ""}
                          onChange={(url) => updateCoverImage(post.id, url)}
                          type="cover"
                          aspectRatio="16:9"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 内容配图提示 */}
                  <div className="border rounded-lg p-3 bg-background">
                    <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                      <ImageIcon className="h-3.5 w-3.5" />
                      内容配图 ({post.imageCount} 张)
                    </h4>
                    {post.imageCount === 0 ? (
                      <div className="text-center py-6 text-muted-foreground border border-dashed rounded bg-muted/20">
                        <ImageIcon className="h-6 w-6 mx-auto mb-1.5 opacity-50" />
                        <p className="text-xs">文章内容中没有图片</p>
                        <p className="text-xs mt-1.5">
                          在编辑器中使用：
                          <code className="ml-1 px-1.5 py-0.5 bg-muted rounded text-[10px]">
                            ![描述](/images/posts/content/图片.jpg)
                          </code>
                        </p>
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>内容配图会自动从文章内容中提取。</p>
                        <p className="text-[10px]">
                          提示：在编辑器中使用 Markdown 语法添加配图
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() =>
                        window.open(`/admin/posts/${post.id}/edit`, "_blank")
                      }
                    >
                      编辑文章
                    </Button>
                    <Button
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => window.open(`/${post.slug}`, "_blank")}
                    >
                      预览文章
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
