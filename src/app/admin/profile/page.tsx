/**
 * 个人信息管理页面
 *
 * 管理用户个人资料、联系信息和社交链接
 */

import CleanAdminLayout from "@/components/admin/clean-admin-layout";
import ProfileForm from "@/components/admin/profile-form";

export default function ProfilePage() {
  return (
    <CleanAdminLayout>
      <div className="space-y-4">
        {/* 页面标题 */}
        <div className="flex items-center space-x-2">
          <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
          <h1 className="text-xl font-semibold text-gray-900">个人信息</h1>
        </div>

        {/* 个人信息表单 */}
        <ProfileForm />
      </div>
    </CleanAdminLayout>
  );
}
