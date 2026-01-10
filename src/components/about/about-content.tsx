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

// 个人爱好数据
const hobbies = [
  {
    name: "Coding",
    icon: "💻",
    description: "构建数字世界，享受逻辑推导与问题解决的纯粹快乐。",
    image: "/images/about/coding.jpg",
  },
  {
    name: "音乐",
    icon: "🎵",
    description: "后摇、电子与古典，是编程时最忠诚的灵魂伴侣。",
    image: "/images/about/music.jpg",
  },
  {
    name: "Thinking",
    icon: "❤️",
    description: "在日常的缝隙中捕捉本质，享受深度思考带来的平静。",
    image: "/images/about/sikao.jpg",
  },
  {
    name: "摄影",
    icon: "📷",
    description: "定格光影，用镜头记录那些稍纵即逝的感性瞬间。",
    image: "/images/about/photography.jpg",
  },
  {
    name: "小说",
    icon: "📖",
    description: "潜入虚构的海洋，在文字构建的宇宙里体验万种人生。",
    image: "/images/about/xiaoshuo.jpg",
  },
  {
    name: "Wine",
    icon: "🍷",
    description: "探索葡萄藤下的风味奥秘，在微醺中品味生活的多重维度。",
    image: "/images/about/wine.jpg",
  },
];

// 工作经历数据
const workExperience = [
  {
    company: "小米科技",
    role: "前端开发工程师",
    period: "2024.07 - 至今",
    location: "武汉",
    image: "/images/about/xiaomi.jpg",
    achievements: [
      "独立负责玄戒芯片及手机费用管控核心系统开发",
      "参与AI提效相关的开发以及知识分享",
    ],
  },
  {
    company: "杭州兑吧",
    role: "前端实习生",
    period: "2024.01 - 2024.04",
    location: "杭州",
    image: "/images/about/duiba.jpg",
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
    image: "/images/about/eqb.jpg",
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
        ? profile.profile.github.startsWith("http")
          ? profile.profile.github
          : `https://github.com/${profile.profile.github}`
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
    <div className="max-w-5xl mx-auto py-16 px-6 sm:px-8">
      {/* 头部个人信息 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-24"
      >
        <div className="flex flex-col md:flex-row gap-12 items-center md:items-start text-center md:text-left">
          {/* 头像 - 与首页侧边栏一致的 6px 粗边框 */}
          <div className="flex-shrink-0">
            <div className="w-40 h-40 rounded-full border-[6px] border-black dark:border-white overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
              {avatar ? (
                <img
                  src={avatar}
                  alt={displayName || profile.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <User className="w-20 h-20 text-gray-400" strokeWidth={1} />
                </div>
              )}
            </div>
          </div>

          {/* 信息 */}
          <div className="flex-1 pt-4">
            <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter uppercase">
              {displayName || profile.username}
            </h1>
            {bio && (
              <div className="text-xl md:text-2xl font-bold text-black dark:text-white mb-8 leading-tight tracking-tight">
                {bio.split("|").map((part, i) => (
                  <span key={i} className="inline-block mr-4">
                    {part.trim()}
                    {i < bio.split("|").length - 1 && (
                      <span className="ml-4 opacity-20">/</span>
                    )}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
              {location && (
                <span className="flex items-center gap-2 px-3 py-1 border-2 border-black dark:border-white rounded-full text-black dark:text-white">
                  <MapPin className="w-3 h-3" />
                  {location}
                </span>
              )}
              {company && (
                <span className="flex items-center gap-2 px-3 py-1 bg-black dark:bg-white text-white dark:text-black rounded-full">
                  <Building2 className="w-3 h-3" />
                  {company}
                </span>
              )}
              {position && (
                <span className="flex items-center gap-2 px-3 py-1 border-2 border-black dark:border-white rounded-full text-black dark:text-white">
                  <Briefcase className="w-3 h-3" />
                  {position}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* 核心特质 - 新增模块 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-32"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border-4 border-black dark:border-white p-8 bg-black text-white dark:bg-white dark:text-black">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-60">
              Zodiac Sign
            </h3>
            <div className="text-5xl font-black tracking-tighter uppercase mb-2">
              Libra
            </div>
            <p className="text-xl font-bold opacity-80">
              天秤座 / 在平衡中寻求美感与正义
            </p>
          </div>
          <div className="border-4 border-black dark:border-white p-8 bg-white text-black dark:bg-black dark:text-white">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-60">
              Personality
            </h3>
            <div className="text-5xl font-black tracking-tighter uppercase mb-2">
              INFJ
            </div>
            <p className="text-xl font-bold opacity-80">
              提倡者 / 理想主义者的坚定践行
            </p>
          </div>
        </div>
      </motion.div>

      {/* 个人爱好 - 粗边框卡片网格 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-32"
      >
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-black dark:bg-white flex items-center justify-center">
            <span className="text-2xl text-white dark:text-black">★</span>
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter">
            My Hobbies
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hobbies.map((hobby, index) => (
            <motion.div
              key={hobby.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative overflow-hidden border-4 border-black dark:border-white bg-white dark:bg-black transition-all duration-300 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] hover:-translate-x-1 hover:-translate-y-1">
                {/* 图片区域 */}
                <div className="relative aspect-square overflow-hidden saturate-[1.2] contrast-[1.1] brightness-[1.05] transition-all duration-500 border-b-4 border-black dark:border-white">
                  {hobby.image ? (
                    <Image
                      src={hobby.image}
                      alt={hobby.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:saturate-[1.5]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                      <span className="text-9xl opacity-10">{hobby.icon}</span>
                    </div>
                  )}
                </div>

                {/* 内容区域 */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{hobby.icon}</span>
                    <h3 className="text-2xl font-black uppercase tracking-tighter">
                      {hobby.name}
                    </h3>
                  </div>
                  <p className="text-sm font-bold leading-relaxed text-gray-600 dark:text-gray-400">
                    {hobby.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 工作经历 - 粗黑风格时间轴 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-32"
      >
        <div className="flex items-center gap-4 mb-16">
          <div className="w-12 h-12 border-4 border-black dark:border-white flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-black dark:text-white" />
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter">
            Experience
          </h2>
        </div>

        <div className="space-y-16">
          {workExperience.map((work, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 md:gap-16"
            >
              <div className="flex flex-col gap-6">
                <div className="font-black text-xl uppercase tracking-widest text-gray-400 dark:text-gray-600 pt-1">
                  {work.period.replace(/-/g, "—")}
                </div>
                {work.image && (
                  <div className="relative aspect-video md:aspect-square w-full border-4 border-black dark:border-white overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                    <Image
                      src={work.image}
                      alt={work.company}
                      fill
                      className="object-cover saturate-[1.2] contrast-[1.1] transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                )}
              </div>
              <div className="relative border-l-4 border-black dark:border-white pl-8 md:pl-12">
                <div className="absolute -left-[14px] top-2 w-6 h-6 bg-black dark:bg-white rounded-full border-4 border-white dark:border-black" />
                <h3 className="text-3xl font-black mb-2 uppercase tracking-tighter">
                  {work.company}
                </h3>
                <p className="text-xl font-bold mb-6 text-black dark:text-white opacity-60">
                  {work.role} · {work.location}
                </p>
                <ul className="space-y-4">
                  {work.achievements.map((achievement, idx) => (
                    <li key={idx} className="flex items-start gap-4 group">
                      <div className="w-2 h-2 bg-black dark:bg-white mt-2 flex-shrink-0 transition-transform group-hover:rotate-45" />
                      <span className="text-lg font-medium leading-snug">
                        {achievement}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 联系方式 - 黑白反色卡片 */}
      {socialLinks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-32"
        >
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-12">
            Connect
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href || undefined}
                target={link.href ? "_blank" : undefined}
                rel={link.href ? "noopener noreferrer" : undefined}
                className="group flex items-center gap-6 p-6 border-4 border-black dark:border-white bg-white dark:bg-black transition-all duration-300 hover:bg-black dark:hover:bg-white"
              >
                <div className="p-4 bg-black dark:bg-white text-white dark:text-black transition-colors group-hover:bg-white dark:group-hover:bg-black group-hover:text-black dark:group-hover:text-white">
                  <link.icon className="w-8 h-8" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-gray-500 mb-1">
                    {link.label}
                  </div>
                  <div className="font-black truncate text-xl group-hover:text-white dark:group-hover:text-black transition-colors uppercase tracking-tight">
                    {link.value}
                  </div>
                </div>
                {link.href && (
                  <ExternalLink className="w-6 h-6 text-gray-300 group-hover:text-white dark:group-hover:text-black transition-colors flex-shrink-0" />
                )}
              </a>
            ))}
          </div>
        </motion.div>
      )}

      {/* 底部功能区 */}
      <div className="border-t-4 border-black dark:border-white pt-16 flex justify-center">
        {/* 返回首页 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-4 px-12 py-6 bg-black dark:bg-white text-white dark:text-black font-black text-xl uppercase tracking-[0.2em] transition-all hover:opacity-80 active:scale-95 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.2)]"
          >
            Back to Base
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
