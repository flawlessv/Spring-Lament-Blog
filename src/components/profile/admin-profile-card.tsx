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
    <div className="sticky top-8 space-y-6 w-full max-w-sm">
      {/* 个人信息卡片 */}
      <div className="text-center">
        {/* 头像 */}
        <div className="mb-3">
          {avatar ? (
            <img
              src={avatar}
              alt={displayName}
              className="w-28 h-28 rounded-full mx-auto border-4 border-blue-100"
            />
          ) : (
            <div className="w-28 h-28 rounded-full mx-auto bg-blue-100 flex items-center justify-center border-4 border-blue-200">
              <User className="w-12 h-12 text-blue-600" />
            </div>
          )}
        </div>

        {/* 名称 */}
        <h1 className="text-xl font-semibold text-gray-900 mb-0.5">
          {displayName || profile.username} 的博客
        </h1>

        {/* 个人简介 */}
        <div className="mb-3">
          {bio && <p className="text-gray-500 leading-relaxed">{bio}</p>}
        </div>

        {/* Subscribe 按钮 */}
        <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors mb-6">
          Subscribe
        </button>
      </div>

      {/* 分类导航 */}
      <div className="min-h-[200px]">
        <div className="space-y-1">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="flex items-center space-x-2 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded px-2 transition-colors"
            >
              {category.icon ? (
                <span className="w-4 h-4 text-center">{category.icon}</span>
              ) : (
                <FileText className="w-4 h-4 text-gray-500" />
              )}
              <span className="flex-1">{category.name}</span>
              {category._count?.posts && (
                <span className="text-xs text-gray-500">
                  {category._count.posts}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* 社交媒体图标 */}
      <div className="flex justify-center space-x-3 pt-4">
        {profile.profile?.email && (
          <a
            href={`mailto:${profile.profile.email}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative"
          >
            <Mail className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              邮箱
            </span>
          </a>
        )}
        {profile.profile?.phone && (
          <a href={`tel:${profile.profile.phone}`} className="group relative">
            <Phone className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              电话
            </span>
          </a>
        )}
        {profile.profile?.wechat && (
          <div className="group relative cursor-pointer">
            <MessageSquare className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              微信：{profile.profile.wechat}
            </span>
          </div>
        )}
        {profile.profile?.website && (
          <a
            href={profile.profile.website}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative"
          >
            <Globe className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              个人网站
            </span>
          </a>
        )}
        {profile.profile?.github && (
          <a
            href={`https://github.com/${profile.profile.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative"
          >
            <Github className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              GitHub
            </span>
          </a>
        )}
        {profile.profile?.bilibili && (
          <a
            href={`https://space.bilibili.com/${profile.profile.bilibili}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative"
          >
            <Tv className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              B站
            </span>
          </a>
        )}
      </div>
    </div>
  );
}
