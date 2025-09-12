/**
 * 编辑文章页面
 *
 * 提供文章编辑功能，包括 Markdown 编辑器
 */

import AdminLayout from "@/components/admin/admin-layout";
import PostEditor from "@/components/admin/post-editor";

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面头部 */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">编辑文章</h1>
          <p className="text-muted-foreground">编辑现有的博客文章</p>
        </div>

        {/* 文章编辑器 */}
        <PostEditor mode="edit" postId={id} />
      </div>
    </AdminLayout>
  );
}
