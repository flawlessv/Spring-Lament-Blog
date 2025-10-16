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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-gray-200/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-gray-200/40 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-scale-in">
        <Card className="shadow-2xl border-0 backdrop-blur-xl bg-white/80">
          <CardHeader className="space-y-6 pb-8 pt-12">
            <div className="flex items-center justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-900 to-gray-700 rounded-3xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                <LogIn className="w-10 h-10 text-white" strokeWidth={1.5} />
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-4xl font-bold text-center tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                SpringLament
              </CardTitle>
              <CardDescription className="text-center text-base text-gray-600">
                请使用管理员账户登录
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="pb-12">
            {/* 错误提示 */}
            {error && (
              <Alert
                variant="destructive"
                className="mb-6 border-0 bg-red-50 text-red-900 animate-fade-in"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* 登录表单 */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-5"
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
                      <FormLabel className="text-sm font-medium text-gray-900">
                        用户名
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="请输入用户名"
                          autoComplete="username"
                          disabled={isLoading}
                          className="h-12 bg-white border-gray-200 focus:border-gray-900 focus:ring-gray-900 text-base transition-all duration-300"
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
                      <FormLabel className="text-sm font-medium text-gray-900">
                        密码
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="请输入密码"
                          autoComplete="current-password"
                          disabled={isLoading}
                          className="h-12 bg-white border-gray-200 focus:border-gray-900 focus:ring-gray-900 text-base transition-all duration-300"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium bg-gray-900 hover:bg-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] mt-8"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      登录中...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-5 w-5" strokeWidth={2} />
                      登录
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* 底部提示 */}
        <p className="mt-8 text-center text-sm text-gray-500 animate-fade-in">
          © 2024 SpringLament Blog. All rights reserved.
        </p>
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
