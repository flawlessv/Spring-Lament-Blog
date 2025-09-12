"use client";

/**
 * 登录页面组件
 *
 * 使用 shadcn/ui 组件重新实现
 * 管理员登录界面，使用 NextAuth.js 的凭证认证
 * 只允许管理员账户登录后台系统
 */

import { useState, Suspense } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { LogIn, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LoginFormData {
  username: string;
  password: string;
}

function LoginForm() {
  // 状态管理
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  // 表单管理
  const form = useForm<LoginFormData>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  /**
   * 处理表单提交
   */
  const handleSubmit = async (values: LoginFormData) => {
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
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <LogIn className="w-6 h-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              SpringLament 博客管理
            </CardTitle>
            <CardDescription className="text-center">
              请使用管理员账户登录
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* 错误提示 */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* 登录表单 */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="username"
                  rules={{
                    required: "请输入用户名",
                    minLength: {
                      value: 2,
                      message: "用户名至少2个字符",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>用户名</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="请输入用户名"
                          autoComplete="username"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  rules={{
                    required: "请输入密码",
                    minLength: {
                      value: 4,
                      message: "密码至少4个字符",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>密码</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="请输入密码"
                          autoComplete="current-password"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      登录中...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      登录
                    </>
                  )}
                </Button>

                {/* 提示信息 */}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    默认管理员账户: admin / 0919
                  </p>
                </div>
              </form>
            </Form>
          </CardContent>
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
