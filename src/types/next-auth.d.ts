/**
 * NextAuth.js 类型扩展
 *
 * 这个文件扩展了 NextAuth.js 的默认类型
 * 添加了我们应用特有的用户属性
 *
 * 文档：https://next-auth.js.org/getting-started/typescript
 */

import type { DefaultSession, DefaultUser } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";

// 声明模块扩展
declare module "next-auth" {
  /**
   * 扩展 Session 类型
   *
   * 添加应用特有的用户属性到会话对象中
   */
  interface Session extends DefaultSession {
    user: {
      /** 用户 ID */
      id: string;
      /** 用户名 */
      username: string;
      /** 用户角色 */
      role: string;
      /** 显示名称 */
      displayName: string;
    } & DefaultSession["user"];
  }

  /**
   * 扩展 User 类型
   *
   * 添加应用特有的用户属性到用户对象中
   */
  interface User extends DefaultUser {
    /** 用户名 */
    username: string;
    /** 用户角色 */
    role: string;
    /** 显示名称 */
    displayName: string;
  }
}

// 声明 JWT 模块扩展
declare module "next-auth/jwt" {
  /**
   * 扩展 JWT 类型
   *
   * 添加应用特有的属性到 JWT token 中
   */
  interface JWT extends DefaultJWT {
    /** 用户 ID */
    id: string;
    /** 用户名 */
    username: string;
    /** 用户角色 */
    role: string;
    /** 显示名称 */
    displayName: string;
  }
}
