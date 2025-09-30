"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  Send,
  Instagram,
  Youtube,
  FileText,
  Gamepad2,
  Code,
  Heart,
  Info,
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
      <div className="sticky top-8 bg-white rounded-lg p-6 shadow-sm w-full max-w-sm">
        <div className="animate-pulse space-y-6">
          {/* 头像和名称 */}
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <div className="h-5 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-24 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-40 mx-auto mb-4"></div>
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
    <div className="sticky top-8 space-y-6 bg-white rounded-lg p-6 shadow-sm w-full max-w-sm">
      {/* 个人信息卡片 */}
      <div className="text-center">
        {/* 头像 */}
        <div className="mb-4">
          {avatar ? (
            <img
              src={avatar}
              alt={displayName}
              className="w-20 h-20 rounded-full mx-auto border-4 border-blue-100"
            />
          ) : (
            <div className="w-20 h-20 rounded-full mx-auto bg-blue-100 flex items-center justify-center border-4 border-blue-200">
              <User className="w-8 h-8 text-blue-600" />
            </div>
          )}
        </div>

        {/* 名称 */}
        <h1 className="text-lg font-bold text-gray-900 mb-1">
          {displayName || profile.username} 的博客
        </h1>

        {/* 职业和位置信息 */}
        <div className="text-sm text-gray-500 mb-4 min-h-[1.25rem]">
          {profile.profile?.position && <div>{profile.profile.position}</div>}
          {profile.profile?.company && <div>{profile.profile.company}</div>}
        </div>

        {/* 个人简介 */}
        <div className="min-h-[3rem] mb-4">
          {bio && (
            <p className="text-gray-700 text-sm leading-relaxed px-2">{bio}</p>
          )}
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
        <Mail className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
        <Send className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
        <Github className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
        <Instagram className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
        <Twitter className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
        <MessageSquare className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
      </div>
    </div>
  );
}
