/**
 * 新建标签页面
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
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Tag } from "lucide-react";
import { LoadingButton } from "@/components/ui/loading";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function NewTagPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    color: "#6B7280",
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
        description: "标签名称不能为空",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/admin/tags", {
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
        description: "标签已成功创建",
        variant: "success",
      });

      router.push("/admin/tags");
    } catch (error) {
      console.error("创建标签失败:", error);
      toast({
        title: "创建失败",
        description: error instanceof Error ? error.message : "请重试",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 预设颜色选项
  const colorOptions = [
    "#6B7280",
    "#EF4444",
    "#F59E0B",
    "#10B981",
    "#3B82F6",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题和返回按钮 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">新建标签</h1>
            <p className="mt-1 text-sm text-gray-500">创建新的文章标签</p>
          </div>
          <Link href="/admin/tags">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回标签列表
            </Button>
          </Link>
        </div>

        {/* 表单 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Tag className="mr-2 h-5 w-5" />
              标签信息
            </CardTitle>
            <CardDescription>填写标签的基本信息和显示配置</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 标签名称 */}
                <div className="space-y-2">
                  <Label htmlFor="name">标签名称 *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="请输入标签名称"
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
                    用于URL中的标签标识，留空则自动生成
                  </p>
                </div>
              </div>

              {/* 标签颜色 */}
              <div className="space-y-2">
                <Label>标签颜色</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, color }))
                      }
                      className={`w-8 h-8 rounded-full border-2 ${
                        formData.color === color
                          ? "border-gray-900"
                          : "border-gray-200"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
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
                    placeholder="#6B7280"
                    className="flex-1"
                  />
                </div>
              </div>

              {/* 预览 */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-2">预览</h3>
                <div className="flex items-center space-x-2">
                  <span
                    className="px-2 py-1 text-xs font-medium rounded-full text-white"
                    style={{ backgroundColor: formData.color }}
                  >
                    {formData.name || "标签名称"}
                  </span>
                </div>
              </div>

              {/* 提交按钮 */}
              <div className="flex justify-end space-x-4">
                <Link href="/admin/tags">
                  <Button variant="outline" type="button">
                    取消
                  </Button>
                </Link>
                <LoadingButton type="submit" isLoading={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  创建标签
                </LoadingButton>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
