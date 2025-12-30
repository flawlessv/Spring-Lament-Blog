/**
 * 文章查询构建器
 *
 * 将复杂的查询逻辑从 API 路由中分离出来
 */

import type {
  PostWhereInput,
  OrderByInput,
  PostQueryParams,
} from "@/types/api";

/**
 * 构建文章查询条件
 */
export function buildPostQuery(params: PostQueryParams): PostWhereInput {
  const where: PostWhereInput = {};
  const andConditions: PostWhereInput[] = [];

  // 搜索条件
  if (params.search) {
    andConditions.push({
      OR: [
        { title: { contains: params.search } },
        { content: { contains: params.search } },
        { excerpt: { contains: params.search } },
      ],
    });
  }

  // 发布状态条件
  if (params.status && params.status !== "all") {
    andConditions.push({ published: params.status === "published" });
  }

  // 分类条件
  if (params.category) {
    where.category = {
      name: { in: params.category.split(",") },
    };
  }

  // 标签条件
  if (params.tags) {
    where.tags = {
      some: {
        tag: {
          name: { in: params.tags.split(",") },
        },
      },
    };
  }

  // 组合所有 AND 条件
  if (andConditions.length > 0) {
    where.AND = andConditions;
  }

  return where;
}

/**
 * 构建排序条件
 */
export function buildOrderBy(sortBy?: string): OrderByInput {
  const sortMap: Record<string, OrderByInput> = {
    newest: { createdAt: "desc" },
    oldest: { createdAt: "asc" },
    updated: { updatedAt: "desc" },
    title: { title: "asc" },
  };

  return sortMap[sortBy || "newest"] || { createdAt: "desc" };
}

/**
 * 解析分页参数
 */
export function parsePaginationParams(
  page?: string,
  limit?: string
): { page: number; limit: number } {
  const pageNum = page ? parseInt(page, 10) : 1;
  const limitNum = limit ? parseInt(limit, 10) : 10;

  return {
    page: Math.max(1, pageNum),
    limit: Math.min(100, Math.max(1, limitNum)), // 限制最大 100 条
  };
}
