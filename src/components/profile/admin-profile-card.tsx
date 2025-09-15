"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

interface AdminProfile {
  id: string;
  username: string;
  email: string;
  bio: string;
  avatar: string;
  joinedAt: string;
  stats: {
    posts: number;
    categories: number;
    tags: number;
  };
}

export default function AdminProfileCard() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/profile");
        if (response.ok) {
          const data = await response.json();
          setProfile(data.profile);
        }
      } catch (error) {
        console.error("获取管理员信息失败:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 sticky top-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 sticky top-8">
      {/* 基本信息 */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          {profile.username}
        </h1>
        <p className="text-sm text-gray-600 mb-3">{profile.email}</p>
        <p className="text-gray-700 leading-relaxed text-sm">{profile.bio}</p>
      </div>

      {/* 统计信息 */}
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>文章</span>
          <span className="font-medium">{profile.stats.posts}</span>
        </div>
        <div className="flex justify-between">
          <span>分类</span>
          <span className="font-medium">{profile.stats.categories}</span>
        </div>
        <div className="flex justify-between">
          <span>标签</span>
          <span className="font-medium">{profile.stats.tags}</span>
        </div>
        <div className="pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            {format(new Date(profile.joinedAt), "yyyy年MM月加入", {
              locale: zhCN,
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
