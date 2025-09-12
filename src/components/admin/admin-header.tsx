"use client";

/**
 * 管理员后台顶部导航栏组件
 *
 * 使用 Ant Design Header 组件，显示网站标题、用户信息和登出功能
 */

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  Layout,
  Button,
  Avatar,
  Dropdown,
  Space,
  Typography,
  Badge,
} from "antd";
import {
  LogoutOutlined,
  ExportOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

const { Header } = Layout;
const { Text } = Typography;

export default function AdminHeader() {
  const { data: session } = useSession();

  /**
   * 处理用户登出
   */
  const handleSignOut = async () => {
    await signOut({
      redirect: true,
      callbackUrl: "/", // 登出后重定向到首页
    });
  };

  // 用户下拉菜单配置
  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: (
        <div>
          <div className="font-medium">
            {session?.user?.displayName || session?.user?.username}
          </div>
          <div className="text-xs text-gray-500">
            {session?.user?.role === "ADMIN" ? "管理员" : "用户"}
          </div>
        </div>
      ),
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "退出登录",
      onClick: handleSignOut,
    },
  ];

  return (
    <Header className="bg-white shadow-sm border-b border-gray-200 px-6 flex items-center justify-between h-16">
      {/* 左侧：网站标题和后台标识 */}
      <div className="flex items-center space-x-4">
        <Link
          href={"/admin" as any}
          className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors no-underline"
        >
          SpringLament Blog
        </Link>
        <Badge status="processing" text="管理后台" />
      </div>

      {/* 右侧：用户信息和操作 */}
      <Space size="middle">
        {/* 查看前台按钮 */}
        <Button type="text" icon={<ExportOutlined />} href="/" target="_blank">
          查看前台
        </Button>

        {/* 用户信息 */}
        {session?.user && (
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <Space className="cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
              <Avatar
                size="small"
                icon={<UserOutlined />}
                className="bg-blue-500"
              >
                {session.user.displayName?.[0] ||
                  session.user.username?.[0] ||
                  "A"}
              </Avatar>
              <Text className="hidden sm:inline">
                {session.user.displayName || session.user.username}
              </Text>
            </Space>
          </Dropdown>
        )}
      </Space>
    </Header>
  );
}
