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
      <div className="sticky top-8 w-full max-w-sm">
        <div className="animate-pulse space-y-6">
          {/* 头像和名称 */}
          <div className="text-center">
            <div className="w-28 h-28 bg-gray-200 rounded-full mx-auto mb-3"></div>
            <div className="h-5 bg-gray-200 rounded w-32 mx-auto mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-40 mx-auto mb-3"></div>
            <div className="h-8 bg-gray-200 rounded-full w-24 mx-auto mb-6"></div>
          </div>

          {/* 分类 */}
          <div className="min-h-[200px]">
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 bg-gray-200 rounded flex items-center space-x-2"
                >
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  <div className="flex-1 h-4 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* 社交媒体图标 */}
          <div className="flex justify-center space-x-3 pt-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-5 h-5 bg-gray-200 rounded"></div>
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
    <div className="sticky top-24 space-y-8 w-full max-w-sm">
      {/* 个人信息卡片 */}
      <div className="text-center space-y-6">
        {/* 头像 */}
        <div className="flex justify-center">
          {avatar ? (
            <img
              src={avatar}
              alt={displayName}
              className="w-32 h-32 rounded-full object-cover border-2 border-border shadow-xl"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-2 border-border shadow-xl">
              <User
                className="w-16 h-16 text-muted-foreground"
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
            <p className="text-sm text-muted-foreground leading-relaxed px-4">
              {bio}
            </p>
          )}
        </div>

        {/* Subscribe 按钮 */}
        <button className="inline-flex items-center justify-center h-11 px-8 rounded-full bg-foreground text-background hover:opacity-90 transition-all duration-300 text-sm font-medium transform hover:scale-105 active:scale-95 shadow-lg">
          Subscribe
        </button>

        {/* 社交媒体图标 */}
        <div className="flex justify-center flex-wrap gap-3 pt-2">
          {profile.profile?.email && (
            <a
              href={`mailto:${profile.profile.email}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-2 rounded-full hover:bg-accent transition-colors"
              title="邮箱"
            >
              <Mail
                className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors"
                strokeWidth={1.5}
              />
            </a>
          )}
          {profile.profile?.phone && (
            <a
              href={`tel:${profile.profile.phone}`}
              className="group relative p-2 rounded-full hover:bg-accent transition-colors"
              title="电话"
            >
              <Phone
                className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors"
                strokeWidth={1.5}
              />
            </a>
          )}
          {profile.profile?.wechat && (
            <div
              className="group relative p-2 rounded-full hover:bg-accent transition-colors cursor-pointer"
              title={`微信：${profile.profile.wechat}`}
            >
              <MessageSquare
                className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors"
                strokeWidth={1.5}
              />
            </div>
          )}
          {profile.profile?.website && (
            <a
              href={profile.profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-2 rounded-full hover:bg-accent transition-colors"
              title="个人网站"
            >
              <Globe
                className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors"
                strokeWidth={1.5}
              />
            </a>
          )}
          {profile.profile?.github && (
            <a
              href={`https://github.com/${profile.profile.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-2 rounded-full hover:bg-accent transition-colors"
              title="GitHub"
            >
              <Github
                className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors"
                strokeWidth={1.5}
              />
            </a>
          )}
          {profile.profile?.bilibili && (
            <a
              href={`https://space.bilibili.com/${profile.profile.bilibili}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-2 rounded-full hover:bg-accent transition-colors"
              title="B站"
            >
              <Tv
                className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors"
                strokeWidth={1.5}
              />
            </a>
          )}
        </div>
      </div>

      {/* 分类导航 */}
      {categories.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground px-2 mb-4">
            分类
          </h2>
          <div className="space-y-1">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="flex items-center gap-3 py-3 px-4 text-sm rounded-xl hover:bg-accent transition-all duration-200 group"
              >
                {category.icon ? (
                  <span className="w-5 h-5 text-center flex items-center justify-center">
                    {category.icon}
                  </span>
                ) : (
                  <FileText
                    className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors"
                    strokeWidth={1.5}
                  />
                )}
                <span className="flex-1 font-medium group-hover:text-foreground transition-colors">
                  {category.name}
                </span>
                {category._count?.posts ? (
                  <span className="text-xs text-muted-foreground font-medium px-2 py-1 rounded-full bg-secondary">
                    {category._count.posts}
                  </span>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
