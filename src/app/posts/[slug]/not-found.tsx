import Link from "next/link";
import PublicLayout from "@/components/layout/public-layout";

export default function PostNotFound() {
  return (
    <PublicLayout>
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">文章不存在</h1>
        <p className="text-gray-600 mb-8">
          抱歉，您访问的文章不存在或已被删除。
        </p>
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-700 transition-colors"
        >
          ← 返回首页
        </Link>
      </div>
    </PublicLayout>
  );
}
