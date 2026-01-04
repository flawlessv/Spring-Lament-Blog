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
  Link as LinkIcon,
  Sparkles,
  Heart,
  Coffee,
  Gamepad2,
  BookOpen,
  Music,
  Camera,
  GraduationCap,
  Rocket,
} from "lucide-react";
import Link from "next/link";
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
    },
  },
};

const scaleVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 15,
    },
  },
};

// 个人爱好数据
const hobbies = [
  {
    icon: Coffee,
    title: "咖啡探索",
    description: "喜爱探索不同产地的咖啡豆，手冲咖啡是我的日常仪式",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: Gamepad2,
    title: "游戏体验",
    description: "热爱独立游戏和剧情驱动类游戏，享受游戏中的叙事艺术",
    color: "from-purple-500 to-pink-600",
  },
  {
    icon: BookOpen,
    title: "阅读思考",
    description: "偏好技术、哲学和科幻类书籍，保持持续学习的习惯",
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: Music,
    title: "音乐欣赏",
    description: "喜欢后摇、电子和古典音乐，音乐是我编程时的最佳伴侣",
    color: "from-green-500 to-teal-600",
  },
  {
    icon: Camera,
    title: "摄影记录",
    description: "用镜头记录生活中的美好瞬间，偏爱街拍和风景摄影",
    color: "from-rose-500 to-red-600",
  },
  {
    icon: Rocket,
    title: "技术探索",
    description: "热衷于探索前沿技术，特别是 AI、Web3 和前端工程化领域",
    color: "from-indigo-500 to-blue-600",
  },
];

// 工作经历数据
const workExperience = [
  {
    company: "小米科技",
    position: "前端开发工程师",
    period: "2024.04 ~ 至今",
    location: "北京",
    achievements: [
      "独立负责小米玄戒芯片研发需求管理系统及手机研发费用管控系统的前端开发",
      "完成 70+ 需求上线，确保项目高质量按时交付",
      "参与组内单测推广，设计并迭代生产级 AI 单测 Prompt",
      "构建单测代码 CI 自动化报错归因流程，实现单测运行失败自动定位",
      "主导 AI Pagetable MCP 开发，实现自然语言到 DSL/Feature 的无缝转换",
      "使用 Claude Code Hooks 自动化 Git/发布流程，减少手工操作与出错点",
      "沉淀业务、前端、AI 领域高质量文档 30+ 篇",
    ],
    tech: ["React", "TypeScript", "Next.js", "AI/MCP", "CI/CD"],
  },
  {
    company: "杭州兑吧网络科技有限公司",
    position: "前端开发工程师",
    period: "2024.01 ~ 2024.04",
    location: "杭州",
    achievements: [
      "负责日活 2000 万的广告落地页、抽奖转盘的迭代开发",
      "维护广告后台系统，涵盖 ToB、ToC 及多技术栈项目",
    ],
    tech: ["React", "Vue", "TypeScript"],
  },
  {
    company: "杭州天谷信息科技有限公司（e签宝）",
    position: "前端开发工程师",
    period: "2023.06 ~ 2023.12",
    location: "杭州",
    achievements: [
      "参与天印电子印章平台的维护及迭代开发",
      "负责 AI 手绘签名功能开发",
      "进行技术债治理和性能优化",
    ],
    tech: ["React", "Vue", "AI", "Canvas"],
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
      color: "from-blue-400 to-blue-600",
    },
    {
      icon: Github,
      href: profile.profile?.github
        ? `https://github.com/${profile.profile?.github}`
        : undefined,
      label: "GitHub",
      value: profile.profile?.github,
      color: "from-gray-600 to-gray-800",
    },
    {
      icon: Globe,
      href: profile.profile?.website,
      label: "个人网站",
      value: profile.profile?.website,
      color: "from-purple-400 to-purple-600",
    },
    {
      icon: MessageSquare,
      href: undefined,
      label: "微信",
      value: profile.profile?.wechat,
      color: "from-green-400 to-green-600",
    },
  ].filter((link) => link.value);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto space-y-10 py-8"
    >
      {/* 头部卡片 */}
      <motion.div variants={itemVariants} className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-xl" />
        <div className="relative bg-background/80 backdrop-blur-sm border border-border/50 rounded-3xl p-8 md:p-12 shadow-sm">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* 头像 */}
            <motion.div variants={scaleVariants} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
              {avatar ? (
                <img
                  src={avatar}
                  alt={displayName || profile.username}
                  className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-background shadow-xl"
                />
              ) : (
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-4 border-background shadow-xl">
                  <User
                    className="w-16 h-16 md:w-20 md:h-20 text-muted-foreground"
                    strokeWidth={1}
                  />
                </div>
              )}
              <motion.div
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg"
                animate={{
                  rotate: [0, 10, -10, 10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
            </motion.div>

            {/* 基本信息 */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <motion.div variants={itemVariants}>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {displayName || profile.username}
                </h1>
                {bio && (
                  <p className="text-lg text-muted-foreground mt-4 leading-relaxed">
                    {bio}
                  </p>
                )}
              </motion.div>

              {/* 信息标签 */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap gap-3 justify-center md:justify-start"
              >
                {location && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{location}</span>
                  </div>
                )}
                {company && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full text-sm">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{company}</span>
                  </div>
                )}
                {position && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full text-sm">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{position}</span>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 个人爱好 */}
      <motion.div variants={itemVariants}>
        <div className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Heart className="w-6 h-6 text-red-500" />
            个人爱好
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hobbies.map((hobby) => (
              <motion.div
                key={hobby.title}
                variants={scaleVariants}
                whileHover={{ scale: 1.03, y: -5 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                <div className="relative bg-muted/30 hover:bg-muted/50 border border-border/50 rounded-xl p-5 transition-all duration-300 group-hover:shadow-lg h-full">
                  <div
                    className={`p-3 rounded-lg bg-gradient-to-br ${hobby.color} shadow-lg w-fit mb-4`}
                  >
                    <hobby.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">
                    {hobby.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {hobby.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 工作经历 */}
      <motion.div variants={itemVariants}>
        <div className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Briefcase className="w-6 h-6 text-blue-500" />
            工作经历
          </h2>
          <div className="space-y-6">
            {workExperience.map((work, index) => (
              <motion.div
                key={`${work.company}-${index}`}
                variants={scaleVariants}
                className="relative group"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="pl-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">
                        {work.company}
                      </h3>
                      <p className="text-muted-foreground">{work.position}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <GraduationCap className="w-4 h-4" />
                        {work.period}
                      </span>
                      {work.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {work.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 主要成就 */}
                  <ul className="space-y-2 mb-3">
                    {work.achievements.map((achievement, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{achievement}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* 技术栈 */}
                  <div className="flex flex-wrap gap-2">
                    {work.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 分隔线 */}
                {index < workExperience.length - 1 && (
                  <div className="mt-6 border-t border-border/50" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 社交链接 */}
      {socialLinks.length > 0 && (
        <motion.div variants={itemVariants}>
          <div className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Heart className="w-6 h-6 text-red-500" />
              联系方式
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {socialLinks.map((link) => (
                <motion.div
                  key={link.label}
                  variants={scaleVariants}
                  whileHover={{ scale: 1.02 }}
                  className="relative group"
                >
                  {link.href ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="relative overflow-hidden bg-muted/30 hover:bg-muted/50 border border-border/50 rounded-xl p-4 transition-all duration-300 group-hover:shadow-md">
                        <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300 from-blue-500 via-purple-500 to-pink-500" />
                        <div className="relative flex items-center gap-4">
                          <div
                            className={`p-3 rounded-lg bg-gradient-to-br ${link.color} shadow-lg`}
                          >
                            <link.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-muted-foreground mb-1">
                              {link.label}
                            </div>
                            <div className="font-medium truncate text-foreground">
                              {link.value}
                            </div>
                          </div>
                          <LinkIcon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                      </div>
                    </a>
                  ) : (
                    <div className="relative overflow-hidden bg-muted/30 border border-border/50 rounded-xl p-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-lg bg-gradient-to-br ${link.color} shadow-lg`}
                        >
                          <link.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-muted-foreground mb-1">
                            {link.label}
                          </div>
                          <div className="font-medium truncate text-foreground">
                            {link.value}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* 返回首页 */}
      <motion.div variants={itemVariants} className="text-center pb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          <span>返回首页</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </Link>
      </motion.div>
    </motion.div>
  );
}
