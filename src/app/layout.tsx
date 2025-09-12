import type { Metadata } from "next";
import AuthProvider from "@/components/providers/auth-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpringLament Blog",
  description: "个人博客系统 - 高效创作与优雅展示",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
