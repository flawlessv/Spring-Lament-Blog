/**
 * API 路由通用类型定义
 */

// Prisma 查询条件类型
export interface PostWhereInput {
  AND?: Array<PostWhereInput>;
  OR?: Array<PostWhereInput>;
  categoryId?: string;
  published?: boolean;
  featured?: boolean;
  title?: {
    contains?: string;
    mode?: "insensitive" | "default";
  };
  content?: {
    contains?: string;
    mode?: "insensitive" | "default";
  };
  excerpt?: {
    contains?: string;
    mode?: "insensitive" | "default";
  };
  category?: {
    name?: {
      contains?: string;
      in?: string[];
      mode?: "insensitive" | "default";
    };
  };
  tags?: {
    some?: {
      tag?: {
        name?: {
          in?: string[];
          mode?: "insensitive" | "default";
        };
      };
    };
  };
}

// 排序类型
export interface OrderByInput {
  createdAt?: "asc" | "desc";
  updatedAt?: "asc" | "desc";
  title?: "asc" | "desc";
}

// 查询参数类型
export interface PostQueryParams {
  search?: string;
  status?: string;
  category?: string;
  tags?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

// 分页结果类型
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API 响应类型
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
}

// 标签和分类推荐结果类型
export interface AIRecommendation {
  existing: string[];
  new: string[];
}
