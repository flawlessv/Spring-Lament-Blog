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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 左侧：管理员信息 */}
        <aside className="lg:col-span-4">
          <AdminProfileCard />
        </aside>

        {/* 右侧：文章列表 */}
        <main className="lg:col-span-8">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900">最新文章</h2>
          </div>
          <PostList />
        </main>
      </div>
    </PublicLayout>
  );
}
