"use client";

import PublicLayout from "@/components/layout/public-layout";
import AdminProfileCard from "@/components/profile/admin-profile-card";
import PostList from "@/components/posts/post-list";

export default function Home() {
  return (
    <PublicLayout sidebar={<AdminProfileCard />}>
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6">
        {/* 桌面端：个人信息在左侧 */}
        <aside className="hidden lg:block lg:col-span-3 order-1 lg:order-none">
          <AdminProfileCard />
        </aside>

        {/* 文章列表 */}
        <main className="lg:col-span-9 order-2 lg:order-none">
          <PostList />
        </main>
      </div>
    </PublicLayout>
  );
}
