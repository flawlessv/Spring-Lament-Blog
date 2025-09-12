"use client";

/**
 * 管理员后台侧边栏导航组件
 *
 * 使用 Ant Design Sider 和 Menu 组件提供主要导航功能
 * 包括文章管理、分类管理、标签管理等
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layout, Menu, Divider, Typography } from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  FolderOutlined,
  TagsOutlined,
  SettingOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

const { Sider } = Layout;
const { Text } = Typography;

export default function AdminSidebar() {
  const pathname = usePathname();

  // 主导航菜单配置
  const mainMenuItems: MenuProps["items"] = [
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: <Link href={"/admin" as any}>仪表盘</Link>,
    },
    {
      key: "/admin/posts",
      icon: <FileTextOutlined />,
      label: <Link href={"/admin/posts" as any}>文章管理</Link>,
    },
    {
      key: "/admin/categories",
      icon: <FolderOutlined />,
      label: <Link href={"/admin/categories" as any}>分类管理</Link>,
    },
    {
      key: "/admin/tags",
      icon: <TagsOutlined />,
      label: <Link href={"/admin/tags" as any}>标签管理</Link>,
    },
    {
      key: "/admin/settings",
      icon: <SettingOutlined />,
      label: <Link href={"/admin/settings" as any}>系统设置</Link>,
    },
  ];

  // 快捷操作菜单配置
  const quickMenuItems: MenuProps["items"] = [
    {
      key: "/admin/posts/new",
      icon: <EditOutlined />,
      label: <Link href={"/admin/posts/new" as any}>写新文章</Link>,
    },
    {
      key: "/admin/categories/new",
      icon: <PlusOutlined />,
      label: <Link href={"/admin/categories/new" as any}>新建分类</Link>,
    },
    {
      key: "/admin/tags/new",
      icon: <PlusOutlined />,
      label: <Link href={"/admin/tags/new" as any}>新建标签</Link>,
    },
  ];

  /**
   * 获取当前激活的菜单项
   */
  const getSelectedKeys = () => {
    // 精确匹配仪表盘
    if (pathname === "/admin") {
      return ["/admin"];
    }

    // 其他路由使用前缀匹配
    const allItems = [...(mainMenuItems || []), ...(quickMenuItems || [])];
    const matchedItem = allItems.find(
      (item) =>
        item &&
        typeof item === "object" &&
        "key" in item &&
        pathname.startsWith(item.key as string)
    );

    return matchedItem ? [matchedItem.key as string] : [];
  };

  return (
    <Sider
      width={256}
      className="bg-white shadow-sm border-r border-gray-200"
      theme="light"
    >
      <div className="p-4 h-full flex flex-col">
        {/* 主导航 */}
        <Menu
          mode="inline"
          selectedKeys={getSelectedKeys()}
          items={mainMenuItems}
          className="border-0 mb-4"
        />

        <Divider className="my-4" />

        {/* 快捷操作标题 */}
        <div className="mb-2">
          <Text
            type="secondary"
            className="text-xs font-semibold uppercase tracking-wider px-4"
          >
            快捷操作
          </Text>
        </div>

        {/* 快捷操作菜单 */}
        <Menu
          mode="inline"
          selectedKeys={getSelectedKeys()}
          items={quickMenuItems}
          className="border-0 mb-4"
        />

        {/* 底部统计信息 */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="px-4 py-2">
            <Text type="secondary" className="text-xs block">
              <div className="space-y-1">
                <div>文章: --</div>
                <div>分类: --</div>
                <div>标签: --</div>
              </div>
            </Text>
          </div>
        </div>
      </div>
    </Sider>
  );
}
