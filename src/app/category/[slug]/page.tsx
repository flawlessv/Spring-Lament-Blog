"use client";

import { useParams } from "next/navigation";
import PublicLayout from "@/components/layout/public-layout";
import AdminProfileCard from "@/components/profile/admin-profile-card";
import PostList from "@/components/posts/post-list";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <PublicLayout>
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6">
        {/* 个人信息卡片 */}
        <aside className="lg:col-span-3 order-1 lg:order-none lg:pl-8">
          <AdminProfileCard />
        </aside>

        {/* 分类文章列表 */}
        <main className="lg:col-span-9 order-2 lg:order-none">
          <PostList categorySlug={slug} />
        </main>
      </div>
    </PublicLayout>
  );
}
