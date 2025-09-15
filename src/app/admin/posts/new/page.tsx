/**
 * 新建文章页面
 *
 * 提供文章创建功能，包括全屏 Markdown 编辑器
 */

import NewPostEditor from "@/components/admin/new-post-editor";

export default function NewPostPage() {
  return <NewPostEditor mode="create" />;
}
