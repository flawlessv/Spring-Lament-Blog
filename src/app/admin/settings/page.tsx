/**
 * 系统设置页面
 */

import CleanAdminLayout from "@/components/admin/clean-admin-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, Database, Server, Shield, Palette } from "lucide-react";

export default function SettingsPage() {
  return (
    <CleanAdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">系统设置</h1>
          <p className="mt-1 text-sm text-gray-500">管理博客系统的配置和参数</p>
        </div>

        {/* 设置卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 基础设置 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                基础设置
              </CardTitle>
              <CardDescription>网站基本信息和显示配置</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">网站标题</span>
                <Badge variant="outline">SpringLament Blog</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">网站描述</span>
                <Badge variant="outline">个人博客系统</Badge>
              </div>
              <Button size="sm" className="w-full">
                编辑基础设置
              </Button>
            </CardContent>
          </Card>

          {/* 数据库设置 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                数据库设置
              </CardTitle>
              <CardDescription>数据库连接和备份配置</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">数据库类型</span>
                <Badge variant="outline">SQLite</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">连接状态</span>
                <Badge className="bg-green-100 text-green-800">正常</Badge>
              </div>
              <Button size="sm" className="w-full">
                数据库管理
              </Button>
            </CardContent>
          </Card>

          {/* 服务器设置 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Server className="mr-2 h-5 w-5" />
                服务器设置
              </CardTitle>
              <CardDescription>服务器配置和性能监控</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">运行端口</span>
                <Badge variant="outline">7777</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">环境</span>
                <Badge className="bg-blue-100 text-blue-800">开发环境</Badge>
              </div>
              <Button size="sm" className="w-full">
                服务器监控
              </Button>
            </CardContent>
          </Card>

          {/* 安全设置 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                安全设置
              </CardTitle>
              <CardDescription>认证和权限管理</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">认证方式</span>
                <Badge variant="outline">NextAuth.js</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">会话时长</span>
                <Badge variant="outline">30天</Badge>
              </div>
              <Button size="sm" className="w-full">
                安全管理
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 开发中提示 */}
        <Card className="border-dashed border-2 border-gray-200">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Palette className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              设置功能开发中
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              系统设置功能正在开发中，敬请期待更多配置选项。
              如有特殊需求，请联系开发者。
            </p>
          </CardContent>
        </Card>
      </div>
    </CleanAdminLayout>
  );
}
