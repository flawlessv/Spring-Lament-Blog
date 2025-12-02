---
title: React虚拟列表完整指南：从原理到实践
slug: react-virtual-list-guide
published: true
featured: true
publishedAt: 2025-12-02
readingTime: 15
category: 前端
tags:
  - React
  - 性能优化
  - js
coverImage: https://haowallpaper.com/link/common/file/previewFileImg/15691093812220224
---

> 深入理解虚拟列表的核心原理，掌握固定高度和动态高度两种场景的React实现方案

## 什么是虚拟列表

在前端开发中，当需要渲染大量数据（如上万条记录）时，如果将所有列表项都渲染到DOM中，会导致严重的性能问题：页面卡顿、滚动不流畅，甚至浏览器崩溃。

**虚拟列表**是一种按需渲染的优化技术，核心思想是：**只渲染可视区域内的列表项，对非可见区域的数据不进行渲染**。

假设有1万条数据需要展示，可视区域高度为`500px`，每个列表项高度为`50px`，那么可视区域最多只能显示10个列表项。虚拟列表在首次渲染时只会加载这10条数据，而不是全部1万条。

![虚拟列表示意图](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/29/16e15195cf16a558~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

### 核心优势

| 对比项       | 传统渲染           | 虚拟列表                  |
| ------------ | ------------------ | ------------------------- |
| DOM节点数    | 全部渲染（10000+） | 只渲染可见部分（10-20个） |
| 首屏渲染时间 | 数秒甚至更长       | 几乎瞬间完成              |
| 内存占用     | 随数据量线性增长   | 保持恒定                  |
| 滚动性能     | 卡顿明显           | 流畅丝滑                  |

## 虚拟列表的实现思路

虚拟列表的实现本质上是**动态计算可视区域内应该显示哪些列表项**，并通过样式控制让这些项显示在正确的位置上。核心步骤包括：

1. **计算可视区域的起始索引**（`startIndex`）
2. **计算可视区域的结束索引**（`endIndex`）
3. **截取对应的数据进行渲染**
4. **计算偏移量**（`startOffset`）让渲染内容对齐可视区域

![虚拟列表实现原理](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/29/16e1519a393dee2c~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

## 固定高度虚拟列表

### HTML结构设计

虚拟列表需要三层结构：

```tsx
<div className="virtual-list-container">
  {/* 占位层：撑开滚动条高度 */}
  <div className="virtual-list-phantom" style={{ height: totalHeight }}></div>

  {/* 渲染层：实际渲染的列表项 */}
  <div
    className="virtual-list"
    style={{ transform: `translateY(${startOffset}px)` }}
  >
    {visibleData.map((item) => (
      <div key={item.id} className="virtual-list-item">
        {item.content}
      </div>
    ))}
  </div>
</div>
```

- **`virtual-list-container`**：可视区域容器，设置固定高度和`overflow: auto`
- **`virtual-list-phantom`**：占位层，高度等于所有列表项的总高度，用于形成正常的滚动条
- **`virtual-list`**：渲染层，通过`transform`偏移到正确位置

### 核心公式推导

假设已知以下变量：

- `screenHeight`：可视区域高度（固定值）
- `itemSize`：每个列表项的高度（固定值）
- `listData`：完整的列表数据
- `scrollTop`：当前滚动距离

可以推导出：

```typescript
// 列表总高度
const listHeight = listData.length * itemSize;

// 可视区域能显示的列表项数量
const visibleCount = Math.ceil(screenHeight / itemSize);

// 可视区域起始索引
const startIndex = Math.floor(scrollTop / itemSize);

// 可视区域结束索引
const endIndex = startIndex + visibleCount;

// 可视区域要渲染的数据
const visibleData = listData.slice(startIndex, endIndex);

// 渲染层的偏移量
const startOffset = scrollTop - (scrollTop % itemSize);
```

### 为什么用 Math.floor 而不是 Math.ceil？

这是一个关键的理解点。让我们通过例子来说明：

假设`itemSize = 50px`，当`scrollTop = 120px`时：

- `scrollTop / itemSize = 120 / 50 = 2.4`
- `Math.floor(2.4) = 2`：表示已经有**2个完整的列表项**滚出可视区域，可视区域顶部应该显示**第2项**（索引从0开始）
- `Math.ceil(2.4) = 3`：会错误地认为第2项已经完全滚出，导致可视区域顶部出现空白

**核心逻辑**：`Math.floor`向下取整，确保不遗漏**部分可见的顶部项**。即使某个列表项只露出一部分，也应该被渲染。

### 偏移量 startOffset 的作用

`startOffset`的作用是让渲染层通过`transform`偏移，使得可视区域顶部的第一项能够精准对齐容器顶部。

继续上面的例子（`scrollTop = 120px`，`itemSize = 50px`）：

```typescript
startIndex = Math.floor(120 / 50) = 2  // 可视区域顶部是第2项
startOffset = 120 - (120 % 50) = 120 - 20 = 100  // 需要向下偏移100px

// 第2项的实际位置应该在 index * itemSize = 2 * 50 = 100px
// 通过 transform: translateY(100px) 让它对齐到正确位置
```

**本质**：虚拟列表通过占位层欺骗浏览器形成正常滚动条，再通过偏移量让局部渲染的内容显示在正确位置。

### React实现代码

```tsx
import React, { useState, useEffect, useRef, useMemo } from "react";

interface VirtualListProps {
  listData: any[]; // 完整数据列表
  itemSize: number; // 每项固定高度
  containerHeight: number; // 容器高度
}

const VirtualList: React.FC<VirtualListProps> = ({
  listData,
  itemSize,
  containerHeight,
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 可视区域能显示的项数
  const visibleCount = useMemo(
    () => Math.ceil(containerHeight / itemSize),
    [containerHeight, itemSize]
  );

  // 列表总高度
  const listHeight = useMemo(
    () => listData.length * itemSize,
    [listData.length, itemSize]
  );

  // 起始索引
  const startIndex = useMemo(
    () => Math.floor(scrollTop / itemSize),
    [scrollTop, itemSize]
  );

  // 结束索引
  const endIndex = useMemo(
    () => Math.min(startIndex + visibleCount, listData.length),
    [startIndex, visibleCount, listData.length]
  );

  // 可见数据
  const visibleData = useMemo(
    () => listData.slice(startIndex, endIndex),
    [listData, startIndex, endIndex]
  );

  // 偏移量
  const startOffset = useMemo(
    () => scrollTop - (scrollTop % itemSize),
    [scrollTop, itemSize]
  );

  // 监听滚动
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      ref={containerRef}
      className="virtual-list-container"
      style={{
        height: containerHeight,
        overflow: "auto",
        position: "relative",
      }}
      onScroll={handleScroll}
    >
      {/* 占位层 */}
      <div className="virtual-list-phantom" style={{ height: listHeight }} />

      {/* 渲染层 */}
      <div
        className="virtual-list"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          transform: `translateY(${startOffset}px)`,
        }}
      >
        {visibleData.map((item, index) => (
          <div
            key={startIndex + index}
            className="virtual-list-item"
            style={{
              height: itemSize,
              lineHeight: `${itemSize}px`,
            }}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualList;
```

## 动态高度虚拟列表

### 挑战与解决方案

在实际应用中，列表项的高度往往是**由内容动态撑开**的（如长短不一的文本、图片等）。这时固定高度的计算公式不再适用。

业界主流的三种解决方案：

| 方案      | 描述                        | 优点                 | 缺点                                   |
| --------- | --------------------------- | -------------------- | -------------------------------------- |
| 方案1     | 预先计算所有项高度          | 准确                 | 需要提前知道高度，不适用于内容撑开场景 |
| 方案2     | 先渲染到屏幕外测量          | 准确                 | 渲染成本翻倍，性能差                   |
| **方案3** | **预估高度 + 真实高度缓存** | **平衡性能和准确性** | **需要处理高度修正**                   |

我们采用**方案3**，其核心思路分为三个阶段：

**阶段1：预估初始化**

- 用一个预估的固定高度（如`estimatedItemSize = 100px`）初始化所有列表项的位置信息
- 此时可以快速计算出列表总高度，让滚动条正常显示
- 虽然高度不准确，但能让页面先渲染出来

**阶段2：渲染后修正**

- 当列表项真正渲染到DOM后，通过`getBoundingClientRect()`获取其真实高度
- 将真实高度缓存到`positions`数组中，替换掉预估高度
- 如果真实高度与预估高度不同，需要**级联更新**后续所有项的位置信息

**阶段3：滚动时查询**

- 后续滚动时，不再用除法计算索引（因为高度不固定）
- 而是从`positions`缓存中**查找**第一个`bottom > scrollTop`的项
- 这个查找过程可以用二分法优化，从O(n)降到O(log n)

通过这种"预估→修正→查询"的流程，既保证了首次渲染速度，又能在滚动时获得准确的位置信息。

### positions 数组：位置缓存的核心

动态高度场景下，我们引入`positions`数组来缓存每一项的位置信息：

```typescript
interface PositionItem {
  index: number; // 索引
  height: number; // 高度
  top: number; // 距离列表顶部的距离
  bottom: number; // 底部距离列表顶部的距离
}

// 示例
const positions: PositionItem[] = [
  { index: 0, height: 80, top: 0, bottom: 80 },
  { index: 1, height: 120, top: 80, bottom: 200 },
  { index: 2, height: 90, top: 200, bottom: 290 },
  // ...
];
```

### 实现流程

**步骤1：用预估高度初始化**

```typescript
const initPositions = (dataLength: number, estimatedItemSize: number) => {
  return Array.from({ length: dataLength }, (_, index) => ({
    index,
    height: estimatedItemSize,
    top: index * estimatedItemSize,
    bottom: (index + 1) * estimatedItemSize,
  }));
};
```

**步骤2：渲染后修正真实高度**

```typescript
useEffect(() => {
  // 获取已渲染的DOM元素
  const items = itemsRef.current;
  if (!items) return;

  items.forEach((node) => {
    const rect = node.getBoundingClientRect();
    const realHeight = rect.height;
    const index = Number(node.dataset.index);
    const oldHeight = positions[index].height;
    const heightDiff = oldHeight - realHeight;

    // 高度发生变化，需要修正
    if (heightDiff !== 0) {
      // 更新当前项
      positions[index].height = realHeight;
      positions[index].bottom -= heightDiff;

      // 修正后续所有项的位置
      for (let k = index + 1; k < positions.length; k++) {
        positions[k].top = positions[k - 1].bottom;
        positions[k].bottom -= heightDiff;
      }
    }
  });

  // 更新列表总高度
  setListHeight(positions[positions.length - 1]?.bottom || 0);
}, [visibleData]);
```

**步骤3：滚动时计算起始索引**

在固定高度场景下，我们可以直接用`Math.floor(scrollTop / itemSize)`计算起始索引。但在动态高度场景下，每个列表项的高度都不同，无法用简单的除法计算。

**基本思路**：从`positions`数组中找到第一个`bottom > scrollTop`的项，它就是可视区域顶部应该显示的第一项。

举例说明，假设有如下positions数组：

```typescript
// 各项高度不同
positions = [
  { index: 0, height: 80, top: 0, bottom: 80 }, // 第0项，高80px
  { index: 1, height: 120, top: 80, bottom: 200 }, // 第1项，高120px
  { index: 2, height: 90, top: 200, bottom: 290 }, // 第2项，高90px
  { index: 3, height: 150, top: 290, bottom: 440 }, // 第3项，高150px
];
```

当`scrollTop = 210px`时：

- 第0项：`bottom = 80 < 210` ❌ 已完全滚出
- 第1项：`bottom = 200 < 210` ❌ 已完全滚出
- 第2项：`bottom = 290 > 210` ✅ **这是第一个底部超过scrollTop的项**
- 因此`startIndex = 2`

**查找方法一：线性遍历**（简单但慢）

```typescript
const getStartIndex = (scrollTop: number): number => {
  for (let i = 0; i < positions.length; i++) {
    if (positions[i].bottom > scrollTop) {
      return i;
    }
  }
  return 0;
};
```

这种方法简单直观，但时间复杂度是`O(n)`。当列表有1万项时，每次滚动都要遍历1万次，性能很差。

**查找方法二：二分查找优化**（推荐）

由于`positions`数组的`bottom`值是递增的（有序数组），我们可以使用二分查找将时间复杂度降到`O(log n)`：

```typescript
const binarySearch = (positions: PositionItem[], scrollTop: number): number => {
  let start = 0;
  let end = positions.length - 1;
  let resultIndex = 0;

  while (start <= end) {
    const midIndex = Math.floor((start + end) / 2);
    const midBottom = positions[midIndex].bottom;

    if (midBottom > scrollTop) {
      resultIndex = midIndex;
      end = midIndex - 1; // 继续向左查找
    } else {
      start = midIndex + 1;
    }
  }

  return resultIndex;
};
```

**步骤4：计算偏移量**

动态高度下的偏移量改为从`positions`中取：

```typescript
const startOffset = startIndex > 0 ? positions[startIndex - 1].bottom : 0;
```

### 完整React实现

```tsx
import React, { useState, useEffect, useRef, useMemo } from "react";

interface PositionItem {
  index: number;
  height: number;
  top: number;
  bottom: number;
}

interface DynamicVirtualListProps {
  listData: any[];
  estimatedItemSize: number;
  containerHeight: number;
}

const DynamicVirtualList: React.FC<DynamicVirtualListProps> = ({
  listData,
  estimatedItemSize,
  containerHeight,
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [listHeight, setListHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const positionsRef = useRef<PositionItem[]>([]);

  // 初始化 positions
  useEffect(() => {
    positionsRef.current = listData.map((_, index) => ({
      index,
      height: estimatedItemSize,
      top: index * estimatedItemSize,
      bottom: (index + 1) * estimatedItemSize,
    }));
    setListHeight(listData.length * estimatedItemSize);
  }, [listData, estimatedItemSize]);

  // 二分查找
  const binarySearch = (scrollTop: number): number => {
    const positions = positionsRef.current;
    let start = 0;
    let end = positions.length - 1;
    let resultIndex = 0;

    while (start <= end) {
      const midIndex = Math.floor((start + end) / 2);
      const midBottom = positions[midIndex].bottom;

      if (midBottom > scrollTop) {
        resultIndex = midIndex;
        end = midIndex - 1;
      } else {
        start = midIndex + 1;
      }
    }

    return resultIndex;
  };

  // 计算可见项数
  const visibleCount = useMemo(
    () => Math.ceil(containerHeight / estimatedItemSize),
    [containerHeight, estimatedItemSize]
  );

  // 计算起始索引
  const startIndex = useMemo(() => binarySearch(scrollTop), [scrollTop]);

  // 计算结束索引
  const endIndex = useMemo(
    () => Math.min(startIndex + visibleCount, listData.length),
    [startIndex, visibleCount, listData.length]
  );

  // 可见数据
  const visibleData = useMemo(
    () => listData.slice(startIndex, endIndex),
    [listData, startIndex, endIndex]
  );

  // 计算偏移量
  const startOffset = useMemo(
    () => (startIndex > 0 ? positionsRef.current[startIndex - 1].bottom : 0),
    [startIndex]
  );

  // 更新真实高度
  useEffect(() => {
    const positions = positionsRef.current;
    itemsRef.current.forEach((node) => {
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const realHeight = rect.height;
      const index = Number(node.dataset.index);
      const oldHeight = positions[index].height;
      const heightDiff = oldHeight - realHeight;

      if (heightDiff !== 0) {
        positions[index].height = realHeight;
        positions[index].bottom -= heightDiff;

        for (let k = index + 1; k < positions.length; k++) {
          positions[k].top = positions[k - 1].bottom;
          positions[k].bottom -= heightDiff;
        }
      }
    });

    setListHeight(positions[positions.length - 1]?.bottom || 0);
  }, [visibleData]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      ref={containerRef}
      style={{
        height: containerHeight,
        overflow: "auto",
        position: "relative",
      }}
      onScroll={handleScroll}
    >
      <div style={{ height: listHeight }} />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          transform: `translateY(${startOffset}px)`,
        }}
      >
        {visibleData.map((item, index) => (
          <div
            key={startIndex + index}
            data-index={startIndex + index}
            ref={(el) => {
              if (el) itemsRef.current[index] = el;
            }}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DynamicVirtualList;
```

### 缓冲区机制：解决白屏问题

快速滚动时，由于渲染需要时间，可能出现短暂的白屏。解决方案是在可视区域上下额外渲染一些列表项作为**缓冲区**：

```typescript
const bufferSize = 5; // 上下各缓冲5个

const actualStartIndex = Math.max(0, startIndex - bufferSize);
const actualEndIndex = Math.min(listData.length, endIndex + bufferSize);

const visibleData = listData.slice(actualStartIndex, actualEndIndex);
```

![缓冲区示意图](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/29/16e151a59317cae7~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

## 进阶优化技巧

### 使用 IntersectionObserver

传统的`scroll`事件会频繁触发，造成性能浪费。可以使用`IntersectionObserver` API来监听元素进入可视区域：

```typescript
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // 元素进入可视区域，更新渲染
        }
      });
    },
    {
      root: containerRef.current,
      threshold: 0.1,
    }
  );

  // 观察目标元素
  return () => observer.disconnect();
}, []);
```

### 使用 ResizeObserver 监听高度变化

对于包含图片的列表项，图片加载完成后高度会发生变化，可以使用`ResizeObserver`实时监听：

```typescript
useEffect(() => {
  const resizeObserver = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const index = Number(entry.target.getAttribute("data-index"));
      const newHeight = entry.contentRect.height;

      // 更新 positions 中对应项的高度
      updateItemHeight(index, newHeight);
    });
  });

  itemsRef.current.forEach((item) => {
    if (item) resizeObserver.observe(item);
  });

  return () => resizeObserver.disconnect();
}, [visibleData]);
```

### 性能监控

可以通过`React DevTools Profiler`或自定义性能监控来追踪渲染耗时：

```typescript
useEffect(() => {
  const startTime = performance.now();

  // 渲染逻辑...

  const endTime = performance.now();
  console.log(`渲染耗时: ${endTime - startTime}ms`);
}, [visibleData]);
```

## 常见问题与解决方案

### 1. 虚拟列表中的全选问题

**问题**：虚拟列表只渲染了部分DOM，如何实现全选功能？

**解决思路**：**数据层和视图层分离**

虚拟列表的核心是"只渲染可见部分"，但数据本身是完整的。因此，所有数据操作应该在**数据层**进行，而不是直接操作DOM。

```tsx
const [listData, setListData] = useState<Item[]>([]);
const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

// 全选：直接操作数据状态
const handleSelectAll = () => {
  const allIds = new Set(listData.map((item) => item.id));
  setSelectedIds(allIds);
};

// 单选：更新选中状态
const handleSelectItem = (id: string) => {
  setSelectedIds((prev) => {
    const newSet = new Set(prev);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    return newSet;
  });
};

// 渲染时根据数据状态显示选中效果
{
  visibleData.map((item) => (
    <div
      key={item.id}
      className={selectedIds.has(item.id) ? "selected" : ""}
      onClick={() => handleSelectItem(item.id)}
    >
      <input type="checkbox" checked={selectedIds.has(item.id)} readOnly />
      {item.content}
    </div>
  ));
}
```

**关键点**：

- 使用`Set`存储选中状态，查询效率O(1)
- 所有操作针对完整数据，不管DOM是否渲染
- 视图仅根据数据状态渲染，保持响应式

### 2. 批量操作未渲染的项

**问题**：如何对未渲染的DOM节点进行批量操作（如批量删除）？

**解决方案**：同样遵循"数据驱动"原则

```tsx
// 批量删除
const handleBatchDelete = (idsToDelete: string[]) => {
  setListData((prev) => prev.filter((item) => !idsToDelete.includes(item.id)));

  // 同步更新选中状态
  setSelectedIds((prev) => {
    const newSet = new Set(prev);
    idsToDelete.forEach((id) => newSet.delete(id));
    return newSet;
  });
};

// 批量更新
const handleBatchUpdate = (updates: Record<string, Partial<Item>>) => {
  setListData((prev) =>
    prev.map((item) =>
      updates[item.id] ? { ...item, ...updates[item.id] } : item
    )
  );
};
```

### 3. 快速滚动时的白屏问题

**原因**：渲染速度跟不上滚动速度

**解决方案**：

1. **增加缓冲区**（前面已讲解）
2. **使用防抖/节流**限制滚动事件频率：

```typescript
import { useMemo } from "react";
import debounce from "lodash/debounce";

const handleScroll = useMemo(
  () =>
    debounce((e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    }, 16), // 约60fps
  []
);
```

3. **使用`requestAnimationFrame`**优化滚动处理：

```typescript
const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
  requestAnimationFrame(() => {
    setScrollTop(e.currentTarget.scrollTop);
  });
};
```

### 4. 动态内容高度不准确

**原因**：图片未加载完成、字体未渲染完成等

**解决方案**：

1. **预估高度尽量接近真实值**：可以通过历史数据统计平均高度
2. **使用`ResizeObserver`**持续监听高度变化（前面已讲解）
3. **图片使用占位高度**：

```tsx
<img
  src={item.imageUrl}
  style={{ width: "100%", height: "200px", objectFit: "cover" }}
  onLoad={() => {
    // 图片加载完成后更新高度
    updateItemHeight(item.id);
  }}
/>
```

### 5. 性能优化建议

1. **避免在滚动回调中进行复杂计算**：使用`useMemo`缓存计算结果
2. **减少不必要的重渲染**：使用`React.memo`包裹列表项组件
3. **大列表项使用key优化**：使用稳定的ID作为key，避免使用index
4. **合理设置缓冲区大小**：过大会增加渲染负担，过小会导致白屏

```tsx
// 使用 React.memo 优化列表项
const VirtualListItem = React.memo<{ item: Item; isSelected: boolean }>(
  ({ item, isSelected }) => (
    <div className={isSelected ? "selected" : ""}>{item.content}</div>
  ),
  (prev, next) =>
    prev.item.id === next.item.id && prev.isSelected === next.isSelected
);
```

## 总结

### 核心要点

1. **虚拟列表本质**：只渲染可视区域，通过占位层和偏移量形成完整滚动效果
2. **固定高度场景**：使用除法直接计算索引，`Math.floor`确保不遗漏部分可见项
3. **动态高度场景**：预估高度初始化 → 渲染后缓存真实高度 → 二分查找优化索引计算
4. **数据操作原则**：数据层与视图层分离，所有操作针对完整数据而非DOM
5. **性能优化**：缓冲区、IntersectionObserver、ResizeObserver、React.memo

### 与现有库的对比

| 库                    | 特点                        | 适用场景               |
| --------------------- | --------------------------- | ---------------------- |
| **react-window**      | 轻量级，API简单，性能优秀   | 追求性能和简洁的场景   |
| **react-virtualized** | 功能丰富，支持Grid、Table等 | 复杂表格和多列布局     |
| **自己实现**          | 完全可控，深入理解原理      | 学习目的或特殊定制需求 |

对于大多数生产环境，推荐使用`react-window`，它由React核心团队成员维护，性能和稳定性都有保障。

### 参考资源

- [React Window 官方文档](https://react-window.vercel.app/)
- [IntersectionObserver MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver)
- [ResizeObserver MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/ResizeObserver)
- [浅说虚拟列表的实现原理](https://github.com/dwqs/blog/issues/70)
- [React性能优化指南](https://react.dev/learn/render-and-commit)

---

通过本文，你应该已经掌握了虚拟列表从原理到实践的完整知识体系。无论是固定高度还是动态高度场景，核心思想都是**按需渲染、数据驱动**。在实际项目中，可以根据具体需求选择自己实现或使用成熟的第三方库。
