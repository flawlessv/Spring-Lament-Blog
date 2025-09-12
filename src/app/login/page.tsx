"use client";

/**
 * 登录页面组件
 *
 * 管理员登录界面，使用 NextAuth.js 的凭证认证
 * 只允许管理员账户登录后台系统
 */

import { useState, Suspense } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Form, Input, Button, Alert, Card, Typography } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

function LoginForm() {
  // 状态管理
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  /**
   * 处理表单提交
   */
  const handleSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    setIsLoading(true);
    setError("");

    try {
      // 使用 NextAuth.js 登录
      const result = await signIn("credentials", {
        username: values.username,
        password: values.password,
        redirect: false, // 不自动重定向，手动处理
      });

      if (result?.error) {
        // 登录失败
        setError("用户名或密码错误");
      } else if (result?.ok) {
        // 登录成功，验证会话并重定向
        const session = await getSession();
        if (session?.user?.role === "ADMIN") {
          router.push(callbackUrl as any);
          router.refresh();
        } else {
          setError("权限不足，只有管理员可以访问");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("登录过程中发生错误，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          {/* 页面头部 */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-blue-100">
              <LoginOutlined className="text-2xl text-blue-600" />
            </div>
            <Title level={2} className="!mb-2">
              SpringLament 博客管理
            </Title>
            <Text type="secondary">请使用管理员账户登录</Text>
          </div>

          {/* 错误提示 */}
          {error && (
            <Alert
              message="登录失败"
              description={error}
              type="error"
              showIcon
              className="mb-6"
            />
          )}

          {/* 登录表单 */}
          <Form
            form={form}
            name="login"
            onFinish={handleSubmit}
            size="large"
            disabled={isLoading}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "请输入用户名" },
                { min: 2, message: "用户名至少2个字符" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="用户名"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "请输入密码" },
                { min: 4, message: "密码至少4个字符" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="密码"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                size="large"
                icon={<LoginOutlined />}
              >
                {isLoading ? "登录中..." : "登录"}
              </Button>
            </Form.Item>

            {/* 提示信息 */}
            <div className="text-center">
              <Text type="secondary" className="text-sm">
                默认管理员账户: admin / 0919
              </Text>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
