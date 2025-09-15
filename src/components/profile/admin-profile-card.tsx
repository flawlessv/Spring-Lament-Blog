"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Github,
  Globe,
  MapPin,
  Calendar,
  MessageSquare,
  Twitter,
  Phone,
  User,
  Briefcase,
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
      <div className="sticky top-8">
        <div className="animate-pulse space-y-6">
          {/* 头像和名称 */}
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
          </div>

          {/* 分类 */}
          <div>
            <div className="h-4 bg-gray-200 rounded w-16 mb-3"></div>
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const displayName = profile.profile?.displayName || profile.username;
  const bio = profile.profile?.bio;
  const avatar = profile.profile?.avatar;

  // 获取社交链接
  const socialLinks = [
    {
      icon: Mail,
      url: profile.profile?.email ? `mailto:${profile.profile.email}` : null,
      label: "邮箱",
    },
    {
      icon: Github,
      url: profile.profile?.github
        ? `https://github.com/${profile.profile.github}`
        : null,
      label: "GitHub",
    },
    {
      icon: Globe,
      url: profile.profile?.website,
      label: "网站",
    },
    {
      icon: Twitter,
      url: profile.profile?.twitter
        ? `https://twitter.com/${profile.profile.twitter}`
        : null,
      label: "Twitter",
    },
    {
      icon: MessageSquare,
      url: profile.profile?.weibo
        ? `https://weibo.com/${profile.profile.weibo}`
        : null,
      label: "微博",
    },
  ].filter((link) => link.url);

  // 默认分类图标映射
  const categoryIcons: { [key: string]: string } = {
    年报: "🏮",
    随笔: "📝",
    编程: "💻",
    友链: "🔗",
    关于: "👤",
    咨询: "📞",
  };

  return (
    <div className="sticky top-8 space-y-6">
      {/* 个人信息卡片 */}
      <div className="text-center">
        {/* 头像 */}
        <div className="mb-4">
          {avatar ? (
            <img
              src={avatar}
              alt={displayName}
              className="w-24 h-24 rounded-full mx-auto border-4 border-gray-100"
            />
          ) : (
            <div className="w-24 h-24 rounded-full mx-auto bg-gray-100 flex items-center justify-center border-4 border-gray-100">
              <User className="w-10 h-10 text-gray-400" />
            </div>
          )}
        </div>

        {/* 名称和描述 */}
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          {displayName} 的博客
        </h1>

        {/* 职业和位置信息 */}
        <div className="text-sm text-gray-600 space-y-1 mb-4">
          {(profile.profile?.position || profile.profile?.company) && (
            <div className="flex items-center justify-center space-x-1">
              <Briefcase className="w-3 h-3" />
              <span>
                {[profile.profile?.position, profile.profile?.company]
                  .filter(Boolean)
                  .join(" | ")}
              </span>
            </div>
          )}

          {profile.profile?.location && (
            <div className="flex items-center justify-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>{profile.profile.location}</span>
            </div>
          )}
        </div>

        {/* 个人简介 */}
        {bio && (
          <p className="text-gray-700 text-sm leading-relaxed mb-4 px-2">
            {bio}
          </p>
        )}

        {/* Subscribe 按钮 */}
        <button className="px-6 py-2 bg-gray-900 text-white text-sm rounded-full hover:bg-gray-800 transition-colors">
          Subscribe
        </button>
      </div>

      {/* 分类导航 */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">📂 月刊</h3>
        <div className="space-y-1">
          {categories.slice(0, 6).map((category) => (
            <a
              key={category.id}
              href={`/categories/${category.slug}`}
              className="flex items-center space-x-2 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded px-2 transition-colors"
            >
              <span className="text-base">
                {categoryIcons[category.name] || "📋"}
              </span>
              <span className="flex-1">{category.name}</span>
              {category._count?.posts && (
                <span className="text-xs text-gray-500">
                  {category._count.posts}
                </span>
              )}
            </a>
          ))}
        </div>
      </div>

      {/* 社交链接 */}
      {socialLinks.length > 0 && (
        <div className="flex justify-center space-x-4">
          {socialLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <a
                key={index}
                href={link.url!}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title={link.label}
              >
                <Icon className="w-4 h-4" />
              </a>
            );
          })}
        </div>
      )}

      {/* 统计信息 */}
      <div className="text-center">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-semibold text-gray-900">
              {profile.stats.posts}
            </div>
            <div className="text-gray-500">文章</div>
          </div>
          <div>
            <div className="font-semibold text-gray-900">
              {profile.stats.categories}
            </div>
            <div className="text-gray-500">分类</div>
          </div>
          <div>
            <div className="font-semibold text-gray-900">
              {profile.stats.tags}
            </div>
            <div className="text-gray-500">标签</div>
          </div>
        </div>
      </div>
    </div>
  );
}
