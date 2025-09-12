import Link from "next/link";
import { ArrowLeft, FileX } from "lucide-react";
import PublicLayout from "@/components/layout/public-layout";

export default function PostNotFound() {
  return (
    <PublicLayout>
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="mb-8">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileX className="h-12 w-12 text-slate-400" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">文章不存在</h1>
          <p className="text-lg text-slate-600 mb-8">
            抱歉，您访问的文章不存在或已被删除。
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>返回首页</span>
          </Link>

          <div className="text-sm text-slate-500">
            <p>或者您可以：</p>
            <ul className="mt-2 space-y-1">
              <li>检查网址是否正确</li>
              <li>浏览其他文章</li>
              <li>联系管理员</li>
            </ul>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
