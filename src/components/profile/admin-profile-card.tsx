"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Mail,
  Github,
  Globe,
  MessageSquare,
  Phone,
  User,
  FileText,
  Tv,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AdminProfile {
  id: string;
  username: string;
  email?: string;
  profile?: {
    displayName?: string;
    bio?: string;
    avatar?: string;
    email?: string;
    phone?: string;
    wechat?: string;
    qq?: string;
    website?: string;
    github?: string;
    twitter?: string;
    weibo?: string;
    bilibili?: string;
    youtube?: string;
    location?: string;
    company?: string;
    position?: string;
  };
  joinedAt: string;
  stats: {
    posts: number;
    categories: number;
    tags: number;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  color?: string;
  icon?: string;
  _count?: {
    posts: number;
  };
}

export default function AdminProfileCard() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, categoriesRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/categories"),
        ]);

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData.profile);
        }

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData.categories || []);
        }
      } catch (error) {
        console.error("获取数据失败:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="lg:sticky lg:top-24 w-full max-w-xs">
        <div className="animate-pulse space-y-6">
          {/* 头像和名称 */}
          <div>
            <div className="w-28 h-28 bg-gray-200 dark:bg-gray-700 rounded-full mb-3"></div>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-3"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-24 mb-6"></div>
          </div>

          {/* 分类 */}
          <div className="min-h-[200px]">
            <div className="space-y-1">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-7 bg-gray-200 dark:bg-gray-700 rounded flex items-center space-x-1.5"
                >
                  <div className="w-3.5 h-3.5 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="flex-1 h-3.5 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* 社交媒体图标 */}
          <div className="flex space-x-2 pt-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const { displayName, bio, avatar } = profile.profile || {};

  return (
    <div className="lg:sticky lg:top-24 space-y-6 w-full max-w-xs">
      {/* 个人信息卡片 */}
      <div className="space-y-4">
        {/* 头像 */}
        <div className="flex">
          {avatar ? (
            <img
              src={avatar}
              alt={displayName}
              className="w-28 h-28 rounded-full object-cover border-2 border-border"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-2 border-border">
              <User
                className="w-14 h-14 text-muted-foreground"
                strokeWidth={1.5}
              />
            </div>
          )}
        </div>

        {/* 名称 */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            {displayName || profile.username}
          </h1>

          {/* 个人简介 */}
          {bio && (
            <p className="text-base text-muted-foreground leading-relaxed">
              {bio}
            </p>
          )}
        </div>

        {/* Subscribe 按钮 */}
        <button className="inline-flex items-center justify-center h-8 px-5 rounded-full border-2 border-foreground text-foreground hover:bg-foreground hover:text-background transition-all duration-200 text-sm font-medium">
          Subscribe
        </button>
      </div>

      {/* 分类导航 */}
      {categories.length > 0 && (
        <div className="space-y-1">
          <div className="space-y-0.5">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="flex items-center gap-1.5 py-1.5 text-sm hover:text-foreground transition-colors group"
              >
                {category.icon ? (
                  <span className="w-3.5 h-3.5 text-center flex items-center justify-center flex-shrink-0 text-xs">
                    {category.icon}
                  </span>
                ) : (
                  <FileText
                    className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0"
                    strokeWidth={1.5}
                  />
                )}
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                  {category.name}
                </span>
                {category._count?.posts ? (
                  <span className="text-xs text-muted-foreground ml-1 font-mono">
                    {category._count.posts}
                  </span>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 社交媒体图标 */}
      <TooltipProvider>
        <div className="flex flex-wrap gap-2 pt-2">
          {profile.profile?.email && (
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={`mailto:${profile.profile.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-1 hover:bg-accent transition-colors rounded"
                >
                  <Mail
                    className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors"
                    strokeWidth={1.5}
                  />
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>邮箱：{profile.profile.email}</p>
              </TooltipContent>
            </Tooltip>
          )}
          {profile.profile?.phone && (
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={`tel:${profile.profile.phone}`}
                  className="group relative p-1 hover:bg-accent transition-colors rounded"
                >
                  <Phone
                    className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors"
                    strokeWidth={1.5}
                  />
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>电话：{profile.profile.phone}</p>
              </TooltipContent>
            </Tooltip>
          )}
          {profile.profile?.wechat && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="group relative p-1 hover:bg-accent transition-colors cursor-pointer rounded">
                  <MessageSquare
                    className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors"
                    strokeWidth={1.5}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>微信：{profile.profile.wechat}</p>
              </TooltipContent>
            </Tooltip>
          )}
          {profile.profile?.website && (
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={profile.profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-1 hover:bg-accent transition-colors rounded"
                >
                  <Globe
                    className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors"
                    strokeWidth={1.5}
                  />
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>个人网站</p>
              </TooltipContent>
            </Tooltip>
          )}
          {profile.profile?.github && (
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={`https://github.com/${profile.profile.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-1 hover:bg-accent transition-colors rounded"
                >
                  <Github
                    className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors"
                    strokeWidth={1.5}
                  />
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>GitHub：{profile.profile.github}</p>
              </TooltipContent>
            </Tooltip>
          )}
          {profile.profile?.bilibili && (
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={`https://space.bilibili.com/${profile.profile.bilibili}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-1 hover:bg-accent transition-colors rounded"
                >
                  <Tv
                    className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors"
                    strokeWidth={1.5}
                  />
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>B站：{profile.profile.bilibili}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </TooltipProvider>
    </div>
  );
}
