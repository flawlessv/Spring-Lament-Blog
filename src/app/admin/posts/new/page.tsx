/**
 * 新建文章页面
 *
 * 提供文章创建功能，包括 Markdown 编辑器
 */

import CleanAdminLayout from "@/components/admin/clean-admin-layout";
import PostEditor from "@/components/admin/post-editor";

export default function NewPostPage() {
  return (
    <CleanAdminLayout>
      <div className="space-y-6">
        {/* 页面头部 */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">新建文章</h1>
          <p className="text-muted-foreground">创建一篇新的博客文章</p>
        </div>

        {/* 文章编辑器 */}
        <PostEditor mode="create" />
      </div>
    </CleanAdminLayout>
  );
}
