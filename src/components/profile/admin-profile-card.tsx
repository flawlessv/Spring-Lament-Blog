"use client";

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

        {/* Subscribe 和 About 按钮 */}
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center justify-center h-8 px-5 rounded-full border-2 border-foreground text-foreground hover:bg-foreground hover:text-background transition-all duration-200 text-sm font-medium">
            Subscribe
          </button>
          <Link
            href="/about"
            className="inline-flex items-center justify-center h-8 px-5 rounded-full border-2 border-muted-foreground/50 text-muted-foreground hover:border-foreground hover:text-foreground transition-all duration-200 text-sm font-medium"
          >
            关于我
          </Link>
        </div>
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
