"use client";

import React from "react";
import Link from "next/link";
import { Mail, Github, User } from "lucide-react";

interface AdminProfile {
  id: string;
  username: string;
  email?: string;
  profile?: {
    displayName?: string;
    bio?: string;
    avatar?: string;
    email?: string;
    github?: string;
    twitter?: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

interface AdminProfileCardProps {
  profile: AdminProfile | null;
  categories: Category[];
}

export default function AdminProfileCard({
  profile,
  categories,
}: AdminProfileCardProps) {
  if (!profile) {
    return null;
  }

  const { displayName, bio, avatar } = profile.profile || {};

  return (
    <div className="lg:sticky lg:top-12 w-full flex flex-col items-start font-sans">
      {/* 顶部个人信息区域 */}
      <div className="flex items-start justify-between w-full relative pr-12">
        <div className="flex-1 space-y-4">
          {/* 头像 - 再次增大，保持 6px 边框 */}
          <div className="w-28 h-28 rounded-full border-[6px] border-black dark:border-white overflow-hidden bg-white flex-shrink-0 shadow-md">
            {avatar ? (
              <img
                src={avatar}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-20 h-20 text-gray-200" strokeWidth={1} />
              </div>
            )}
          </div>

          {/* 名字与简介 */}
          <div className="space-y-3">
            <h1 className="text-[28px] font-bold text-black dark:text-white leading-tight">
              {displayName || profile.username}
            </h1>

            {/* 简介 - 进一步增大字体，水平排列 */}
            {bio && (
              <div className="text-[18px] text-gray-600 dark:text-gray-600 font-light flex flex-wrap items-center gap-x-2 leading-none">
                {bio.includes("|") ? (
                  bio.split("|").map((part, i) => (
                    <React.Fragment key={i}>
                      <span className="whitespace-nowrap">{part.trim()}</span>
                      {i < bio.split("|").length - 1 && (
                        <span className="text-gray-200">|</span>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <span>{bio}</span>
                )}
              </div>
            )}
          </div>

          {/* 订阅按钮 - 进一步加厚边框 */}
          <div className="pt-0.5">
            <button className="px-5 py-1.5 border-[3px] border-black dark:border-white rounded-full text-[12px] font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300">
              Subscribe
            </button>
          </div>
        </div>

        {/* 装饰蓝线 - 对齐头像顶部 */}
        <div className="w-[4px] h-20 bg-[#0047AB] absolute right-4 top-0 hidden lg:block opacity-90"></div>
      </div>

      {/* 分类导航 - 彩色图标，适度加粗 */}
      <nav className="w-full mt-6">
        <ul className="space-y-1.5">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/category/${category.slug}`}
                className="flex items-center gap-3 text-[15px] text-black dark:text-white hover:opacity-70 transition-all group"
              >
                <span className="text-lg opacity-100">
                  {category.icon || "📄"}
                </span>
                <span className="font-semibold tracking-tight">
                  {category.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* 底部社交 - 强化图标颜色 */}
      <div className="w-full mt-8">
        <div className="flex gap-5 text-gray-500">
          <a href="#" className="hover:text-black transition-colors">
            <Mail className="w-5 h-5" />
          </a>
          <a href="#" className="hover:text-black transition-colors">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.36-.49.99-.75 3.87-1.68 6.45-2.79 7.74-3.33 3.68-1.54 4.44-1.81 4.94-1.82.11 0 .35.03.5.16.13.1.17.24.18.33.02.06.02.13.01.2z" />
            </svg>
          </a>
          <a href="#" className="hover:text-black transition-colors">
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
