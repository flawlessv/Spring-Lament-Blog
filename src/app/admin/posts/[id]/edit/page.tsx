/**
 * 编辑文章页面
 *
 * 提供文章编辑功能，包括全屏 Markdown 编辑器
 */

import NewPostEditor from "@/components/admin/new-post-editor";

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;

  return <NewPostEditor mode="edit" postId={id} />;
}
