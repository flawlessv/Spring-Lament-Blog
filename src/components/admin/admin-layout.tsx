"use client";

/**
 * 管理员后台布局组件
 *
 * 使用 Ant Design Layout 组件重新设计
 * 包括导航栏、侧边栏、用户信息和登出功能
 */

import { ReactNode } from "react";
import { Layout } from "antd";
import AdminHeader from "./admin-header";
import AdminSidebar from "./admin-sidebar";

const { Content } = Layout;

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <Layout className="min-h-screen">
      {/* 顶部导航栏 */}
      <AdminHeader />

      <Layout>
        {/* 侧边栏 */}
        <AdminSidebar />

        {/* 主内容区域 */}
        <Content className="m-6 p-6 bg-white rounded-lg shadow-sm">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
