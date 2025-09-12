"use client";

import { useState, useEffect } from "react";
import { User, Calendar, FileText, Folder, Tag } from "lucide-react";
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
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-6">
        <div className="animate-pulse">
          <div className="w-20 h-20 bg-slate-200 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto mb-2"></div>
          <div className="h-3 bg-slate-200 rounded w-1/2 mx-auto mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-slate-200 rounded"></div>
            <div className="h-3 bg-slate-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-6 text-center">
        <User className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-500">暂无管理员信息</p>
      </div>
    );
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-6 sticky top-24">
      {/* 头像和基本信息 */}
      <div className="text-center mb-6">
        <div className="relative inline-block mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <User className="h-10 w-10 text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">
          {profile.username}
        </h2>
        <p className="text-sm text-slate-500">{profile.email}</p>
      </div>

      {/* 个人简介 */}
      <div className="mb-6">
        <p className="text-sm text-slate-600 leading-relaxed">{profile.bio}</p>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-lg font-bold text-slate-900">
            {profile.stats.posts}
          </div>
          <div className="text-xs text-slate-500">文章</div>
        </div>
        <div className="text-center">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Folder className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-lg font-bold text-slate-900">
            {profile.stats.categories}
          </div>
          <div className="text-xs text-slate-500">分类</div>
        </div>
        <div className="text-center">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Tag className="h-5 w-5 text-purple-600" />
          </div>
          <div className="text-lg font-bold text-slate-900">
            {profile.stats.tags}
          </div>
          <div className="text-xs text-slate-500">标签</div>
        </div>
      </div>

      {/* 加入时间 */}
      <div className="pt-4 border-t border-slate-200">
        <div className="flex items-center justify-center text-xs text-slate-500">
          <Calendar className="h-4 w-4 mr-1" />
          <span>
            {format(new Date(profile.joinedAt), "yyyy年MM月 加入", {
              locale: zhCN,
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
