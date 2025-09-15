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
      <div className="space-y-6">
        {/* 页面头部 */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">个人信息</h1>
          <p className="text-muted-foreground">管理您的个人资料和联系信息</p>
        </div>

        {/* 个人信息表单 */}
        <ProfileForm />
      </div>
    </CleanAdminLayout>
  );
}
