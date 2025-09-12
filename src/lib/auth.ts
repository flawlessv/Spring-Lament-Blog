import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

/**
 * NextAuth.js 配置
 *
 * 这个文件配置了认证系统的核心设置
 * 包括提供商、会话策略、回调函数等
 *
 * 文档：https://next-auth.js.org/configuration/options
 */

export const authOptions: NextAuthOptions = {
  /**
   * 数据库适配器配置
   *
   * 使用 Prisma 适配器连接到数据库
   * 自动处理用户、会话、账户等表的管理
   */
  adapter: PrismaAdapter(prisma),

  /**
   * 认证提供商配置
   *
   * 这里配置了凭证提供商，用于用户名/密码登录
   * 只允许管理员账户登录
   */
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: {
          label: "用户名",
          type: "text",
          placeholder: "请输入用户名",
        },
        password: {
          label: "密码",
          type: "password",
          placeholder: "请输入密码",
        },
      },

      /**
       * 认证逻辑
       *
       * 验证用户凭证并返回用户信息
       * 只允许 ADMIN 角色用户登录
       */
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          // 查找用户
          const user = await prisma.user.findUnique({
            where: {
              username: credentials.username,
            },
            include: {
              profile: true, // 包含用户资料信息
            },
          });

          // 用户不存在或不是管理员
          if (!user || user.role !== "ADMIN") {
            return null;
          }

          // 验证密码
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          // 返回用户信息（去除敏感信息）
          return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            displayName: user.profile?.displayName || user.username,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],

  /**
   * 会话策略配置
   *
   * 使用 JWT 策略而不是数据库会话
   * 提高性能并减少数据库查询
   */
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 天
    updateAge: 24 * 60 * 60, // 24 小时更新一次
  },

  /**
   * JWT 配置
   */
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 天
  },

  /**
   * 页面路由配置
   */
  pages: {
    signIn: "/login", // 自定义登录页面
    error: "/login", // 错误时重定向到登录页面
  },

  /**
   * 回调函数配置
   *
   * 用于自定义认证流程中的行为
   */
  callbacks: {
    /**
     * JWT 回调
     *
     * 在生成 JWT 时调用，可以添加自定义信息
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
        token.displayName = user.displayName;
      }
      return token;
    },

    /**
     * Session 回调
     *
     * 在获取会话信息时调用，控制客户端可访问的数据
     */
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.role = token.role as string;
        session.user.displayName = token.displayName as string;
      }
      return session;
    },
  },

  /**
   * 其他配置选项
   */
  debug: process.env.NODE_ENV === "development", // 开发环境启用调试

  /**
   * 事件回调（可选）
   *
   * 可以在认证事件发生时执行自定义逻辑
   */
  events: {
    async signIn({ user }) {
      console.log(`用户登录: ${user.username}`);
    },
    async signOut({ token }) {
      console.log(`用户登出: ${token.username}`);
    },
  },
};

export default NextAuth(authOptions);
