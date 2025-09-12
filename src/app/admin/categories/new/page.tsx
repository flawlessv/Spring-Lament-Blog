/**
 * 新建分类页面
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/admin-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Folder } from "lucide-react";
import { LoadingButton } from "@/components/ui/loading";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function NewCategoryPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    color: "#3B82F6",
    icon: "📁",
    sortOrder: 0,
  });

  // 自动生成slug
  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: name
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, ""),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "错误",
        description: "分类名称不能为空",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "创建失败");
      }

      toast({
        title: "创建成功",
        description: "分类已成功创建",
        variant: "success",
      });

      router.push("/admin/categories");
    } catch (error) {
      console.error("创建分类失败:", error);
      toast({
        title: "创建失败",
        description: error instanceof Error ? error.message : "请重试",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题和返回按钮 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">新建分类</h1>
            <p className="mt-1 text-sm text-gray-500">创建新的文章分类</p>
          </div>
          <Link href="/admin/categories">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回分类列表
            </Button>
          </Link>
        </div>

        {/* 表单 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Folder className="mr-2 h-5 w-5" />
              分类信息
            </CardTitle>
            <CardDescription>填写分类的基本信息和显示配置</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 分类名称 */}
                <div className="space-y-2">
                  <Label htmlFor="name">分类名称 *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="请输入分类名称"
                    required
                  />
                </div>

                {/* URL别名 */}
                <div className="space-y-2">
                  <Label htmlFor="slug">URL别名</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="自动生成"
                  />
                  <p className="text-xs text-gray-500">
                    用于URL中的分类标识，留空则自动生成
                  </p>
                </div>

                {/* 分类图标 */}
                <div className="space-y-2">
                  <Label htmlFor="icon">分类图标</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, icon: e.target.value }))
                    }
                    placeholder="📁"
                  />
                  <p className="text-xs text-gray-500">
                    可以使用emoji或图标类名
                  </p>
                </div>

                {/* 分类颜色 */}
                <div className="space-y-2">
                  <Label htmlFor="color">分类颜色</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="color"
                      type="color"
                      value={formData.color}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          color: e.target.value,
                        }))
                      }
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={formData.color}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          color: e.target.value,
                        }))
                      }
                      placeholder="#3B82F6"
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* 排序权重 */}
                <div className="space-y-2">
                  <Label htmlFor="sortOrder">排序权重</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        sortOrder: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500">数值越小越靠前</p>
                </div>
              </div>

              {/* 分类描述 */}
              <div className="space-y-2">
                <Label htmlFor="description">分类描述</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="请输入分类描述（可选）"
                  rows={3}
                />
              </div>

              {/* 预览 */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-2">预览</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{formData.icon}</span>
                  <span
                    className="px-2 py-1 text-xs font-medium rounded-full text-white"
                    style={{ backgroundColor: formData.color }}
                  >
                    {formData.name || "分类名称"}
                  </span>
                  {formData.description && (
                    <span className="text-sm text-gray-600">
                      - {formData.description}
                    </span>
                  )}
                </div>
              </div>

              {/* 提交按钮 */}
              <div className="flex justify-end space-x-4">
                <Link href="/admin/categories">
                  <Button variant="outline" type="button">
                    取消
                  </Button>
                </Link>
                <LoadingButton type="submit" isLoading={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  创建分类
                </LoadingButton>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
