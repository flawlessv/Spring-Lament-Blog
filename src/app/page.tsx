import { Metadata } from "next";
import PublicLayout from "@/components/layout/public-layout";
import AdminProfileCard from "@/components/profile/admin-profile-card";
import PostList from "@/components/posts/post-list";

export const metadata: Metadata = {
  title: "SpringLament Blog - 个人博客",
  description: "专注于高效创作和优雅展示的现代化博客系统",
};

export default function Home() {
  return (
    <PublicLayout>
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6">
        {/* 移动端/平板端：个人信息在顶部 */}
        <aside className="lg:col-span-3 order-1 lg:order-none">
          <AdminProfileCard />
        </aside>

        {/* 移动端/平板端：文章列表在底部 */}
        <main className="lg:col-span-9 order-2 lg:order-none">
          <PostList />
        </main>
      </div>
    </PublicLayout>
  );
}
