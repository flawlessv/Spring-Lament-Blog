"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  featured: boolean;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
    profile?: {
      displayName?: string;
    };
  };
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    color?: string;
  }>;
  tags: Array<{
    id: string;
    name: string;
    slug: string;
    color?: string;
  }>;
  commentsCount: number;
}

interface PostListProps {
  className?: string;
  categorySlug?: string;
}

// 随机图片API列表
const RANDOM_IMAGE_APIS = [
  // 次元API系列
  "https://t.alcy.cc/",
  "https://t.alcy.cc/fj",
  "https://t.alcy.cc/mp",

  // 樱花系列
  "https://www.dmoe.cc/random.php",

  // 搏天API
  "https://api.btstu.cn/sjbz/api.php",

  // 三秋API系列
  "https://api.ghser.com/random/api.php",
  "https://api.ghser.com/random/pc.php",
  "https://api.ghser.com/random/bg.php",

  // LoliAPI系列
  "https://www.loliapi.com/acg/",

  // 小歪API
  "https://api.ixiaowai.cn/api/api.php",

  // 如诗API
  "https://api.likepoems.com/img/pc",

  // 超级小兔
  "https://imgapi.xl0408.top/index.php",

  // 呓喵酱
  "https://api.yimian.xyz/img",

  // 韩小韩API
  "https://api.vvhan.com/api/wallpaper/acg",

  // 东方Project
  "https://img.paulzzh.com/touhou/random",

  // 保罗API
  "https://api.paugram.com/wallpaper/",

  // 墨天逸
  "https://api.mtyqx.cn/tapi/random.php",

  // Jitsu随机图
  "https://moe.jitsu.top/api",

  // 零七生活
  "https://api.oick.cn/random/api.php",

  // 桑帛云系列
  "https://api.lolimi.cn/API/dmt/api.php?type=image",
  "https://api.lolimi.cn/API/yuan/?type=image",

  // 星河API系列
  "https://api.asxe.vip/random.php",
  "https://api.asxe.vip/scenery.php",

  // 魅影API
  "https://tuapi.eees.cc/api.php?category=dongman&type=302",

  // 赫萝API
  "https://api.horosama.com/random.php",

  // 狗哥API系列
  "https://www.ggapi.cn/api/acg/",
  "https://www.ggapi.cn/api/aiimg/",
  "https://www.ggapi.cn/api/gancheng/",

  // 小小API
  "https://v2.xxapi.cn/api/randomAcgPic?type=pc&return=302",

  // 素颜API系列
  "https://api.suyanw.cn/api/ys",
  "https://api.suyanw.cn/api/mao",
  "https://api.suyanw.cn/api/comic/api.php",

  // 无铭API
  "https://jkapi.com/api/acg_img",

  // 御坂API系列
  "https://ybapi.cn/API/dmt.php",
  "https://ybapi.cn/API/pc_acgimg.php",

  // seamee API系列
  "https://api.seaya.link/web?type=file",
  "https://api.seaya.link/random?type=file",

  // 浪心API系列
  "https://api.lxtu.cn/api.php?category=ecy",
  "https://api.lxtu.cn/api.php?category=ys",
  "https://api.lxtu.cn/api.php?category=ecyfj",
  "https://api.lxtu.cn/api.php?category=mn",
  "https://api.lxtu.cn/api.php?category=smn",

  // unsplash
  "https://source.unsplash.com/random",

  // 缙哥哥原神
  "https://api.dujin.org/pic/yuanshen/",

  // NyanCat
  "https://sex.nyan.run/api/v2/img",

  // 无缺博客
  "https://api.wuque.cc/random/images",

  // 云调用岁月小筑
  "https://cloud.qqshabi.cn/api/images/api.php",

  // TenAPI
  "https://tenapi.cn/v2/acg",

  // ALAPI
  "https://v2.alapi.cn/api/acg?token=KA6k5H7oBNZavgEJ",
];

// 获取随机API
const getRandomImageApi = () => {
  return RANDOM_IMAGE_APIS[
    Math.floor(Math.random() * RANDOM_IMAGE_APIS.length)
  ];
};

export default function PostList({
  className = "",
  categorySlug,
}: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPosts = useCallback(
    async (pageNum: number) => {
      try {
        if (pageNum > 1) setLoadingMore(true);

        const params = new URLSearchParams({
          page: pageNum.toString(),
          limit: "10",
        });

        if (categorySlug) {
          params.append("category", categorySlug);
        }

        const response = await fetch(`/api/posts?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          if (pageNum === 1) {
            setPosts(data.posts);
          } else {
            setPosts((prev) => [...prev, ...data.posts]);
          }
          setHasMore(data.pagination.current < data.pagination.pages);
        }
      } catch (error) {
        console.error("获取文章列表失败:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [categorySlug]
  );

  useEffect(() => {
    fetchPosts(page);
  }, [page, fetchPosts]);

  // 当分类变化时重置页面并重新加载
  useEffect(() => {
    // 避免初始化时重复加载
    if (categorySlug !== undefined) {
      setPage(1);
      setHasMore(true);
      setLoading(true);
      // 不立即清空posts，等新数据加载完成后再更新，减少页面抖动
      fetchPosts(1);
    }
  }, [categorySlug, fetchPosts]);

  // 滚动监听自动加载
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 1000 &&
        hasMore &&
        !loading &&
        !loadingMore
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading, loadingMore]);

  if (loading && page === 1) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg animate-pulse">
            <div className="flex space-x-4">
              <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-gray-500">还没有发布任何文章</p>
      </div>
    );
  }

  return (
    <div className={`space-y-[60px] ${className}`}>
      {posts.map((post) => (
        <article key={post.id}>
          <Link href={`/posts/${post.slug}`}>
            <div className="relative w-full max-w-[680px] h-[285px] mx-auto overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl group">
              {/* 背景图片 */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${post.coverImage || getRandomImageApi()})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/70 transition-opacity duration-300 group-hover:from-black/20 group-hover:via-black/30 group-hover:to-black/80"></div>
              </div>

              {/* 文章内容覆盖层 */}
              <div
                className="relative h-full p-8 flex flex-col justify-between text-white"
                style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
              >
                {/* 顶部：日期和精选标识 */}
                <div className="flex items-start justify-between">
                  <div className="text-sm opacity-90 font-medium tracking-wider">
                    {format(new Date(post.createdAt), "MMM dd, yyyy", {
                      locale: zhCN,
                    }).toUpperCase()}
                  </div>
                  {post.featured && (
                    <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg"></div>
                  )}
                </div>

                {/* 底部：标题、摘要和分类 */}
                <div className="space-y-3">
                  <h2 className="text-xl md:text-2xl font-bold leading-tight line-clamp-2 transition-all duration-300 group-hover:scale-[1.02]">
                    {post.title}
                  </h2>

                  {/* 摘要 */}
                  {post.excerpt && (
                    <p className="text-sm opacity-90 leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}

                  {/* 分类标签 */}
                  {post.categories.length > 0 && (
                    <div className="flex items-center space-x-3">
                      {post.categories.slice(0, 2).map((category) => (
                        <span
                          key={category.id}
                          className="inline-block px-3 py-1 text-sm bg-white/25 backdrop-blur-sm rounded-full transition-all duration-300 group-hover:bg-white/35"
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </article>
      ))}

      {/* 自动加载指示器 */}
      {loadingMore && (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2 text-muted-foreground">
            <div className="w-4 h-4 border-2 border-border border-t-foreground rounded-full animate-spin"></div>
            <span className="text-sm">加载中...</span>
          </div>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">没有更多文章了</p>
        </div>
      )}
    </div>
  );
}
