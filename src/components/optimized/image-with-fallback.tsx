"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
}

// 优化的随机图片API列表（精选10个稳定快速的）
const OPTIMIZED_RANDOM_IMAGE_APIS = [
  "https://picsum.photos/800/600",
  "https://www.dmoe.cc/random.php",
  "https://api.btstu.cn/sjbz/api.php",
  "https://www.loliapi.com/acg/",
  "https://api.likepoems.com/img/pc",
  "https://img.paulzzh.com/touhou/random",
];

// 获取随机图片API
const getRandomImageApi = () => {
  return OPTIMIZED_RANDOM_IMAGE_APIS[
    Math.floor(Math.random() * OPTIMIZED_RANDOM_IMAGE_APIS.length)
  ];
};

// 默认占位图（Base64 编码的1x1透明像素）
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNjY2MiLz48L3N2Zz4=";

export function ImageWithFallback({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
  sizes,
  quality = 75,
  fallbackSrc,
  onLoad,
  onError,
}: ImageWithFallbackProps) {
  // 如果 src 为空或无效，立即使用备用图片或随机图片
  const initialSrc =
    !src || src.trim() === "" ? fallbackSrc || getRandomImageApi() : src;

  const [imgSrc, setImgSrc] = useState(initialSrc);
  const [isLoading, setIsLoading] = useState(true);

  // 处理图片加载错误
  const handleError = () => {
    setIsLoading(false);

    if (onError) onError();

    // 如果主图加载失败，尝试使用备用图片
    if (
      !fallbackSrc &&
      !imgSrc.includes("picsum") &&
      !imgSrc.includes("unsplash")
    ) {
      // 尝试使用随机API作为备用
      const fallbackApi = getRandomImageApi();
      setImgSrc(fallbackApi);
    } else if (fallbackSrc && imgSrc !== fallbackSrc) {
      // 使用指定的备用图片
      setImgSrc(fallbackSrc);
    } else {
      // 所有备用方案都失败，使用占位图
      setImgSrc(PLACEHOLDER_IMAGE);
    }
  };

  // 处理图片加载成功
  const handleLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };

  // 监听src变化
  useEffect(() => {
    // 如果新的 src 为空，使用备用图片或随机图片
    if (!src || src.trim() === "") {
      setImgSrc(fallbackSrc || getRandomImageApi());
    } else {
      setImgSrc(src);
    }
    setIsLoading(true);
  }, [src, fallbackSrc]);

  // 显示加载状态
  if (isLoading && !priority) {
    return (
      <div className={cn("relative overflow-hidden bg-gray-100", className)}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        sizes={sizes}
        quality={quality}
        priority={priority}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "object-cover transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        placeholder="blur"
        blurDataURL={PLACEHOLDER_IMAGE}
      />

      {/* 加载遮罩 */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

// 背景图片组件（用于封面图）
interface BackgroundImageProps {
  src: string;
  className?: string;
  priority?: boolean;
  fallbackSrc?: string;
}

export function BackgroundImage({
  src,
  className,
  priority = false,
  fallbackSrc,
}: BackgroundImageProps) {
  // 如果 src 为空或无效，立即使用备用图片或随机图片
  const initialSrc =
    !src || src.trim() === "" ? fallbackSrc || getRandomImageApi() : src;

  const [imgSrc, setImgSrc] = useState(initialSrc);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    if (fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    } else {
      setImgSrc(getRandomImageApi());
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    // 如果新的 src 为空，使用备用图片或随机图片
    if (!src || src.trim() === "") {
      setImgSrc(fallbackSrc || getRandomImageApi());
    } else {
      setImgSrc(src);
    }
    setIsLoading(true);
  }, [src, fallbackSrc]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* 使用 Next.js Image 组件进行优化 */}
      <Image
        src={imgSrc}
        alt="Background"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
        quality={85}
        priority={priority}
        onLoad={handleLoad}
        onError={handleError}
        className="object-cover"
        placeholder="blur"
        blurDataURL={PLACEHOLDER_IMAGE}
      />

      {/* 加载时的渐变遮罩 */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-b from-gray-200 to-gray-300 animate-pulse" />
      )}
    </div>
  );
}
