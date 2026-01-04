"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Github,
  Globe,
  MessageSquare,
  User,
  MapPin,
  Building2,
  Briefcase,
  ArrowRight,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SimpleLoading } from "@/components/ui/loading";

interface Profile {
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
}

// 推荐博客
const featuredPosts = [
  {
    title: "浅谈 Vibe Coding",
    slug: "vibe-coding-new-paradigm",
  },
  {
    title: "AI Agent 开发实践",
    slug: "ai-agent-development-practice",
  },
  {
    title: "RAG 技术实践",
    slug: "rag-intelligent-blog-qa",
  },
];

// 个人爱好数据
const hobbies = [
  {
    name: "咖啡",
    icon: "☕",
    description: "探索不同产地的咖啡豆，手冲咖啡是日常仪式，最爱耶加雪菲和蓝山",
    image: "/images/hobbies/coffee.jpg",
  },
  {
    name: "游戏",
    icon: "🎮",
    description:
      "热爱独立游戏和剧情驱动类游戏，最近在玩《艾尔登法环》和《星露谷物语》",
    image: "/images/hobbies/gaming.jpg",
  },
  {
    name: "阅读",
    icon: "📚",
    description: "偏好技术、哲学和科幻类书籍，《三体》《代码大全》是心头好",
    image: "/images/hobbies/reading.jpg",
  },
  {
    name: "音乐",
    icon: "🎵",
    description: "喜欢后摇、电子和古典音乐，编程时的最佳伴侣",
    image: "/images/hobbies/music.jpg",
  },
  {
    name: "摄影",
    icon: "📷",
    description: "用镜头记录生活中的美好瞬间，偏爱街拍和风景摄影",
    image: "/images/hobbies/photography.jpg",
  },
  {
    name: "技术",
    icon: "🚀",
    description: "热衷于探索前沿技术，特别是 AI、Web3 和前端工程化领域",
    image: "/images/hobbies/tech.jpg",
  },
];

// 工作经历数据
const workExperience = [
  {
    company: "小米科技",
    role: "前端开发工程师",
    period: "2024.04 - 至今",
    location: "北京",
    achievements: [
      "负责玄戒芯片研发需求管理系统及手机研发费用管控系统",
      "完成 70+ 需求上线，主导 AI Pagetable MCP 开发",
      "构建 CI 自动化流程，沉淀技术文档 30+ 篇",
    ],
  },
  {
    company: "杭州兑吧",
    role: "前端开发工程师",
    period: "2024.01 - 2024.04",
    location: "杭州",
    achievements: [
      "负责日活 2000 万的广告落地页、抽奖转盘迭代",
      "维护广告后台系统，涵盖 React、Vue 多技术栈",
    ],
  },
  {
    company: "e签宝",
    role: "前端开发工程师",
    period: "2023.06 - 2023.12",
    location: "杭州",
    achievements: [
      "参与天印电子印章平台维护及迭代",
      "负责 AI 手绘签名功能开发",
    ],
  },
];

export default function AboutContent() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile);
        }
      } catch (error) {
        console.error("获取个人信息失败:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (isLoading) {
    return <SimpleLoading />;
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">暂无个人信息</p>
      </div>
    );
  }

  const { displayName, bio, avatar, location, company, position } =
    profile.profile || {};

  const socialLinks = [
    {
      icon: Mail,
      href: `mailto:${profile.profile?.email}`,
      label: "邮箱",
      value: profile.profile?.email,
    },
    {
      icon: Github,
      href: profile.profile?.github
        ? `https://github.com/${profile.profile?.github}`
        : undefined,
      label: "GitHub",
      value: profile.profile?.github,
    },
    {
      icon: Globe,
      href: profile.profile?.website,
      label: "网站",
      value: profile.profile?.website,
    },
    {
      icon: MessageSquare,
      href: undefined,
      label: "微信",
      value: profile.profile?.wechat,
    },
  ].filter((link) => link.value);

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      {/* 头部个人信息 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-20"
      >
        <div className="flex flex-col md:flex-row gap-10 items-start">
          {/* 头像 */}
          <div className="flex-shrink-0">
            {avatar ? (
              <img
                src={avatar}
                alt={displayName || profile.username}
                className="w-32 h-32 rounded-full border-4 border-gray-100 dark:border-gray-800"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <User className="w-16 h-16 text-white" strokeWidth={1.5} />
              </div>
            )}
          </div>

          {/* 信息 */}
          <div className="flex-1">
            <h1 className="text-5xl font-bold mb-4">
              {displayName || profile.username}
            </h1>
            {bio && (
              <p className="text-xl text-muted-foreground mb-5 leading-relaxed">
                {bio}
              </p>
            )}

            <div className="flex flex-wrap gap-4 text-base text-muted-foreground">
              {location && (
                <span className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {location}
                </span>
              )}
              {company && (
                <span className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  {company}
                </span>
              )}
              {position && (
                <span className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  {position}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* 个人爱好 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8">个人爱好</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hobbies.map((hobby, index) => (
            <motion.div
              key={hobby.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300">
                {/* 图片区域 */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  {hobby.image ? (
                    <Image
                      src={hobby.image}
                      alt={hobby.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                      <span className="text-8xl opacity-20">{hobby.icon}</span>
                    </div>
                  )}
                  {/* 渐变遮罩 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                {/* 内容区域 - 覆盖在图片上 */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-4xl">{hobby.icon}</span>
                    <h3 className="text-2xl font-bold">{hobby.name}</h3>
                  </div>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {hobby.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 工作经历 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8">工作经历</h2>
        <div className="space-y-10">
          {workExperience.map((work, index) => (
            <div key={index} className="relative">
              {/* 时间线 */}
              {index !== workExperience.length - 1 && (
                <div className="absolute left-3 top-12 bottom-0 w-0.5 bg-gray-200 dark:border-gray-800" />
              )}

              <div className="flex gap-6">
                {/* 时间点 */}
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 border-4 border-background shadow-lg" />

                {/* 内容 */}
                <div className="flex-1 pb-10">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold mb-2">{work.company}</h3>
                    <p className="text-lg text-muted-foreground mb-2">
                      {work.role}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {work.period} · {work.location}
                    </p>
                  </div>

                  <ul className="space-y-2 text-muted-foreground">
                    {work.achievements.map((achievement, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-blue-500 mt-0.5 text-lg">→</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 联系方式 */}
      {socialLinks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold mb-8">联系方式</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href || undefined}
                target={link.href ? "_blank" : undefined}
                rel={link.href ? "noopener noreferrer" : undefined}
                className="flex items-center gap-4 p-5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all group"
              >
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <link.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-muted-foreground mb-1">
                    {link.label}
                  </div>
                  <div className="font-medium truncate text-lg">
                    {link.value}
                  </div>
                </div>
                {link.href && (
                  <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-blue-500 transition-colors flex-shrink-0" />
                )}
              </a>
            ))}
          </div>
        </motion.div>
      )}

      {/* 推荐阅读 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <BookOpen className="w-7 h-7" />
          推荐阅读
        </h2>
        <div className="flex flex-wrap gap-3">
          {featuredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="inline-flex items-center gap-3 px-6 py-3 text-base rounded-full border-2 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all group"
            >
              <span>{post.title}</span>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>
      </motion.div>

      {/* 返回首页 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl font-medium text-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          返回首页
        </Link>
      </motion.div>
    </div>
  );
}
