/**
 * API 路由认证和响应辅助函数
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { ApiSuccessResponse, ApiErrorResponse } from "@/types/api";

/**
 * 要求管理员认证，失败返回 403 响应
 * @param request Next.js 请求对象
 * @returns session 或错误响应
 */
export async function requireAdminAuth(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "无权限访问，需要管理员权限" },
      { status: 403 }
    );
  }

  return session;
}

/**
 * 创建成功响应
 * @param data 响应数据
 * @param status HTTP 状态码
 * @returns NextResponse 对象
 */
export function createSuccessResponse<T>(
  data: T,
  status: number = 200
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

/**
 * 创建错误响应
 * @param message 错误信息
 * @param status HTTP 状态码
 * @param code 错误代码（可选）
 * @returns NextResponse 对象
 */
export function createErrorResponse(
  message: string,
  status: number = 500,
  code?: string
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(code && { code }),
    },
    { status }
  );
}

/**
 * 验证请求方法
 * @param request Next.js 请求对象
 * @param allowedMethods 允许的 HTTP 方法列表
 * @returns 如果方法不允许，返回错误响应；否则返回 null
 */
export function validateRequestMethod(
  request: NextRequest,
  allowedMethods: string[]
): NextResponse<ApiErrorResponse> | null {
  const method = request.method;

  if (!allowedMethods.includes(method || "")) {
    return createErrorResponse(
      `不支持的请求方法。允许的方法: ${allowedMethods.join(", ")}`,
      405,
      "METHOD_NOT_ALLOWED"
    );
  }

  return null;
}

/**
 * 从请求中获取并验证用户 ID
 * @param request Next.js 请求对象
 * @returns 用户 ID 或错误响应
 */
export async function getUserIdFromRequest(
  request: NextRequest
): Promise<string | NextResponse<ApiErrorResponse>> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return createErrorResponse("未登录", 401, "UNAUTHORIZED");
  }

  return session.user.id;
}
