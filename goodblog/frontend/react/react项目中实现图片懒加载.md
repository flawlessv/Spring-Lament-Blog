---
title: 不使用任何库在react项目中实现图片懒加载
slug: reactqgc3a9
published: true
featured: false
cacategory: 前端
publishedAt: 2023-01-17T00:00:00.000Z
readingTime: 1
---

可以使用Intersection Observer API来实现图片懒加载，它是一种现代的浏览器API，可以异步监测元素是否进入视口（viewport），从而触发相关操作。在React中，可以使用useRef hook获取img标签的引用，并通过创建一个IntersectionObserver实例观察它们是否可见。当目标元素进入视口时，就可以加载图片并显示。以下是一个简单的示例代码：

```tsx
import { useRef, useEffect, useState } from "react";

function LazyImage({ src, alt }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return <img ref={ref} src={isVisible ? src : ""} alt={alt} />;
}
```

这个例子使用了useState和useEffect hook，以及Intersection Observer API。用户滚动页面时，如果LazyImage组件进入可见区域，则图片被加载并呈现。
