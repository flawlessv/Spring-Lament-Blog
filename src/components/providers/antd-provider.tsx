"use client";

/**
 * Ant Design 配置提供器
 *
 * 这个组件为整个应用提供 Ant Design 的主题配置和样式注册
 * 使用 @ant-design/nextjs-registry 来处理服务端渲染的样式问题
 *
 * 文档：https://ant.design/docs/react/use-with-next
 */

import React from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, theme } from "antd";
import zhCN from "antd/locale/zh_CN";

interface AntdConfigProviderProps {
  children: React.ReactNode;
}

/**
 * Ant Design 主题配置
 */
const antdTheme = {
  // 设计令牌配置
  token: {
    // 主色调配置 - 使用蓝色系
    colorPrimary: "#3b82f6", // 主色调，对应 Tailwind 的 blue-500
    colorSuccess: "#10b981", // 成功色，对应 Tailwind 的 green-500
    colorWarning: "#f59e0b", // 警告色，对应 Tailwind 的 yellow-500
    colorError: "#ef4444", // 错误色，对应 Tailwind 的 red-500

    // 字体配置
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
    fontSize: 14,

    // 圆角配置
    borderRadius: 6,

    // 布局配置
    wireframe: false, // 关闭线框模式，使用彩色主题
  },

  // 算法配置 - 可以切换明暗主题
  algorithm: theme.defaultAlgorithm, // 默认主题
  // algorithm: theme.darkAlgorithm, // 暗色主题
  // algorithm: theme.compactAlgorithm, // 紧凑主题

  // 组件特定配置
  components: {
    // Button 组件配置
    Button: {
      borderRadius: 6,
      controlHeight: 36,
    },

    // Input 组件配置
    Input: {
      borderRadius: 6,
      controlHeight: 36,
    },

    // Card 组件配置
    Card: {
      borderRadiusLG: 8,
    },

    // Table 组件配置
    Table: {
      borderRadius: 6,
      headerBg: "#fafafa",
    },

    // Menu 组件配置
    Menu: {
      borderRadius: 6,
      itemBorderRadius: 6,
    },

    // Layout 组件配置
    Layout: {
      headerBg: "#ffffff",
      siderBg: "#ffffff",
      bodyBg: "#f5f5f5",
    },
  },
};

/**
 * Ant Design 配置提供器组件
 */
export default function AntdConfigProvider({
  children,
}: AntdConfigProviderProps) {
  return (
    <AntdRegistry>
      <ConfigProvider
        theme={antdTheme}
        locale={zhCN} // 设置中文语言包
        // 其他全局配置
        componentSize="middle" // 组件尺寸：small | middle | large
        direction="ltr" // 文字方向：ltr | rtl
      >
        {children}
      </ConfigProvider>
    </AntdRegistry>
  );
}
