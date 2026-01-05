import { Metadata } from "next";
import AdminLayout from "@/components/admin/clean-admin-layout";
import ImageGallery from "@/components/admin/image-gallery";

export const metadata: Metadata = {
  title: "图片管理 - Spring Broken AI Blog",
  description: "管理博客图片",
};

export default function ImagesPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">图片管理</h1>
          <p className="text-muted-foreground">查看和管理博客中的所有图片</p>
        </div>
        <ImageGallery />
      </div>
    </AdminLayout>
  );
}
