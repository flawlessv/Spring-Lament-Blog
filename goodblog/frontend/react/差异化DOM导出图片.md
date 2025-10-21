---
title: 差异化DOM导出图片的技术选择
slug: domqwefuy4npp7
excerpt: React中DOM导出图片的高级技术方案详解
published: false
featured: false
publishedAt: 2025-04-20T00:00:00.000Z
readingTime: 19
category: 前端
tags:
  - js
  - react
---

# 1. React中DOM导出图片的高级技术方案详解

在React开发中，经常会遇到需要将页面内容导出为图片的需求，特别是当导出内容与当前页面展示不同时。本文将详细介绍几种主流的技术实现方案，帮助开发者选择最适合的解决方案。

## 1.1. 前言

传统的DOM截图方案往往局限于当前页面的可见内容，但在实际业务中，我们经常需要：

- 导出与当前页面不同的内容
- 生成特定格式的报告图片
- 创建高清晰度的导出图片
- 在不影响用户体验的情况下进行导出

本文将介绍三种主流的技术方案来解决这些问题。

## 1.2. 方案一：html2canvas + 隐藏DOM

这是最常用且最灵活的方案，通过创建隐藏的DOM容器来渲染专门的导出内容。

### 1.2.1. 基础实现

```typescript
import html2canvas from "html2canvas";
import { createRoot } from "react-dom/client";

interface ExportOptions {
  filename?: string;
  width?: number;
  height?: number;
  scale?: number;
  backgroundColor?: string;
}

// 导出Hook
export const useExportImage = () => {
  const exportCustomContent = async (
    renderContent: () => JSX.Element,
    options: ExportOptions = {}
  ) => {
    const {
      filename = "export.png",
      width = 800,
      height = 600,
      scale = 2,
      backgroundColor = "#ffffff",
    } = options;

    // 1. 创建隐藏容器
    const exportContainer = document.createElement("div");
    exportContainer.style.cssText = `
      position: absolute;
      left: -9999px;
      top: -9999px;
      width: ${width}px;
      height: ${height}px;
      background-color: ${backgroundColor};
      padding: 20px;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    document.body.appendChild(exportContainer);

    try {
      // 2. 渲染React组件到隐藏容器
      const root = createRoot(exportContainer);
      root.render(renderContent());

      // 3. 等待渲染完成
      await new Promise((resolve) => setTimeout(resolve, 200));

      // 4. 使用html2canvas截图
      const canvas = await html2canvas(exportContainer, {
        backgroundColor,
        scale,
        useCORS: true,
        allowTaint: true,
        logging: false,
        windowWidth: width,
        windowHeight: height,
      });

      // 5. 下载图片
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.download = filename;
          link.href = url;
          link.click();

          // 清理URL
          setTimeout(() => {
            URL.revokeObjectURL(url);
          }, 100);
        }
      }, "image/png");

      // 6. 清理React组件
      root.unmount();
    } finally {
      // 7. 移除DOM容器
      document.body.removeChild(exportContainer);
    }
  };

  return { exportCustomContent };
};
```

### 1.2.2. 使用示例

```typescript
import React from 'react'
import { useExportImage } from './hooks/useExportImage'

// 专门用于导出的组件
const ExportReportComponent: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#fff',
      padding: '20px'
    }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>
        销售报告
      </h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <h3>本月数据</h3>
          <p>销售额: ¥{data.sales}</p>
          <p>订单数: {data.orders}</p>
        </div>
        <div style={{ flex: 1 }}>
          <h3>同比增长</h3>
          <p>销售增长: {data.growth}%</p>
          <p>客户增长: {data.customerGrowth}%</p>
        </div>
      </div>
      {/* 可以包含图表、表格等复杂内容 */}
    </div>
  )
}

// 使用组件
const ReportPage: React.FC = () => {
  const { exportCustomContent } = useExportImage()

  const handleExport = () => {
    const reportData = {
      sales: 150000,
      orders: 320,
      growth: 15.5,
      customerGrowth: 12.3
    }

    exportCustomContent(
      () => <ExportReportComponent data={reportData} />,
      {
        filename: '销售报告.png',
        width: 800,
        height: 600,
        scale: 2
      }
    )
  }

  return (
    <div>
      <button onClick={handleExport}>导出报告</button>
      {/* 页面其他内容 */}
    </div>
  )
}
```

### 1.2.3. 高级用法：支持异步数据加载

```typescript
const exportWithAsyncData = async (
  dataLoader: () => Promise<any>,
  renderContent: (data: any) => JSX.Element,
  options: ExportOptions = {}
) => {
  const exportContainer = document.createElement("div");
  exportContainer.style.cssText = `
    position: absolute;
    left: -9999px;
    top: -9999px;

    width: ${options.width || 800}px;
    background-color: ${options.backgroundColor || "#fff"};

  `;

  document.body.appendChild(exportContainer);

  try {
    // 1. 加载数据
    const data = await dataLoader();

    // 2. 渲染组件
    const root = createRoot(exportContainer);
    root.render(renderContent(data));

    // 3. 等待渲染和图片加载
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 4. 确保所有图片都加载完成
    const images = exportContainer.querySelectorAll("img");
    await Promise.all(
      Array.from(images).map((img) => {
        return new Promise((resolve, reject) => {
          if (img.complete) {
            resolve(img);
          } else {
            img.onload = () => resolve(img);
            img.onerror = reject;
          }
        });
      })
    );

    // 5. 截图
    const canvas = await html2canvas(exportContainer, {
      backgroundColor: options.backgroundColor || "#fff",
      scale: options.scale || 2,

      useCORS: true,
      allowTaint: true,
    });

    // 6. 导出
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.download = options.filename || "export.png";

        link.href = url;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 100);
      }
    }, "image/png");

    root.unmount();
  } finally {
    document.body.removeChild(exportContainer);
  }
};
```

## 1.3. 方案二：React Portal

React Portal提供了一种更优雅的方式来渲染导出内容，特别适合需要与页面内容共享状态的场景。

### 1.3.1. Portal基础实现

```typescript
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import html2canvas from "html2canvas";

// 创建Portal容器
const createExportContainer = () => {
  const container = document.createElement("div");
  container.id = "export-portal-container";
  container.style.cssText = `
    position: absolute;
    left: -9999px;
    top: -9999px;
    width: 800px;
    background-color: #fff;
    padding: 20px;
    box-sizing: border-box;
  `;
  document.body.appendChild(container);
  return container;
};

// Portal导出组件
const ExportPortal: React.FC<{
  isVisible: boolean;
  onExportComplete: () => void;
  children: React.ReactNode;
  exportOptions?: ExportOptions;
}> = ({ isVisible, onExportComplete, children, exportOptions = {} }) => {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null
  );

  useEffect(() => {
    if (isVisible) {
      const container = createExportContainer();
      setPortalContainer(container);

      // 延迟执行导出，确保内容渲染完成
      setTimeout(async () => {
        try {
          const canvas = await html2canvas(container, {
            backgroundColor: exportOptions.backgroundColor || "#fff",
            scale: exportOptions.scale || 2,

            useCORS: true,
            allowTaint: true,
          });

          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");

              link.download = exportOptions.filename || "export.png";

              link.href = url;
              link.click();
              setTimeout(() => URL.revokeObjectURL(url), 100);
            }
          }, "image/png");
        } finally {
          onExportComplete();
        }
      }, 300);
    }

    return () => {
      if (portalContainer) {
        document.body.removeChild(portalContainer);
        setPortalContainer(null);
      }
    };
  }, [isVisible, onExportComplete, exportOptions]);

  if (!isVisible || !portalContainer) return null;

  return createPortal(children, portalContainer);
};
```

### 1.3.2. Portal使用示例

```typescript
const ReportWithPortal: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false)
  const [reportData, setReportData] = useState(null)

  const handleExport = async () => {
    // 可以在这里加载最新数据
    const data = await fetchReportData()
    setReportData(data)
    setIsExporting(true)
  }

  const handleExportComplete = () => {
    setIsExporting(false)
    setReportData(null)
  }

  return (
    <div>
      <button onClick={handleExport} disabled={isExporting}>
        {isExporting ? '导出中...' : '导出报告'}
      </button>

      {/* Portal导出 */}
      <ExportPortal
        isVisible={isExporting}
        onExportComplete={handleExportComplete}
        exportOptions={{
          filename: '销售报告.png',
          width: 800,
          height: 600,
          scale: 2
        }}
      >
        {reportData && (
          <div style={{ width: '100%', minHeight: '600px' }}>
            <h1>销售报告</h1>
            <div>
              <p>销售额: ¥{reportData.sales}</p>
              <p>订单数: {reportData.orders}</p>
              {/* 更多报告内容 */}
            </div>
          </div>
        )}
      </ExportPortal>
    </div>
  )
}
```

### 1.3.3. 高级Portal：可视化调试

```typescript
const DebugableExportPortal: React.FC<{
  isVisible: boolean
  debugMode?: boolean
  onExportComplete: () => void
  children: React.ReactNode
}> = ({ isVisible, debugMode = false, onExportComplete, children }) => {

  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (isVisible) {
      const container = createExportContainer()

      // 调试模式：显示导出内容
      if (debugMode) {
        container.style.left = '50px'
        container.style.top = '50px'
        container.style.border = '2px solid red'
        container.style.zIndex = '9999'
      }

      setPortalContainer(container)

      if (!debugMode) {
        // 非调试模式自动导出
        setTimeout(async () => {
          const canvas = await html2canvas(container, {
            backgroundColor: '#fff',
            scale: 2,
            useCORS: true,
            allowTaint: true,
          })

          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob)
              const link = document.createElement('a')
              link.download = 'debug-export.png'
              link.href = url
              link.click()
              setTimeout(() => URL.revokeObjectURL(url), 100)
            }
          }, 'image/png')

          onExportComplete()
        }, 300)
      }
    }

    return () => {
      if (portalContainer) {
        document.body.removeChild(portalContainer)
        setPortalContainer(null)
      }
    }
  }, [isVisible, debugMode, onExportComplete])

  if (!isVisible || !portalContainer) return null

  return createPortal(
    <div>
      {children}
      {debugMode && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={onExportComplete}>关闭调试</button>
        </div>
      )}
    </div>,
    portalContainer
  )
}
```

## 1.4. 方案三：虚拟DOM渲染

虚拟DOM方案通过React的服务端渲染功能，将组件渲染为HTML字符串，然后转换为图片。

### 1.4.1. 基础虚拟DOM实现

```typescript
import { renderToString } from "react-dom/server";
import html2canvas from "html2canvas";

// 虚拟DOM导出函数
export const exportVirtualDOM = async (
  component: React.ReactElement,
  options: ExportOptions = {}
) => {
  const {
    filename = "export.png",
    width = 800,
    height = 600,
    scale = 2,
    backgroundColor = "#ffffff",
  } = options;

  try {
    // 1. 渲染React组件为HTML字符串
    const htmlString = renderToString(component);

    // 2. 创建完整的HTML文档
    const fullHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background-color: ${backgroundColor};
              width: ${width}px;
              height: ${height}px;
              box-sizing: border-box;
            }
            * {
              box-sizing: border-box;
            }
          </style>
        </head>
        <body>
          ${htmlString}
        </body>
      </html>
    `;

    // 3. 创建iframe来渲染HTML
    const iframe = document.createElement("iframe");
    iframe.style.cssText = `
      position: absolute;
      left: -9999px;
      top: -9999px;
      width: ${width}px;
      height: ${height}px;
      border: none;
    `;

    document.body.appendChild(iframe);

    // 4. 写入HTML内容
    iframe.contentDocument?.open();
    iframe.contentDocument?.write(fullHTML);
    iframe.contentDocument?.close();

    // 5. 等待iframe加载完成
    await new Promise<void>((resolve) => {
      iframe.onload = () => {
        setTimeout(resolve, 200); // 额外等待时间确保样式应用
      };
    });

    // 6. 对iframe内容截图
    const canvas = await html2canvas(iframe.contentDocument!.body, {
      backgroundColor,
      scale,
      useCORS: true,
      allowTaint: true,
    });

    // 7. 下载图片
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = filename;
        link.href = url;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 100);
      }
    }, "image/png");

    // 8. 清理iframe
    document.body.removeChild(iframe);
  } catch (error) {
    console.error("虚拟DOM导出失败:", error);
    throw error;
  }
};
```

### 1.4.2. 虚拟DOM使用示例

```typescript
import React from 'react'
import { exportVirtualDOM } from './utils/exportVirtualDOM'

// 纯函数组件，适合服务端渲染
const ExportReportComponent: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div style={{
      width: '100%',
      minHeight: '600px',
      backgroundColor: '#fff',
      padding: '20px'
    }}>
      <h1 style={{
        color: '#333',
        marginBottom: '20px',
        fontSize: '24px',
        fontWeight: 'bold'
      }}>
        月度销售报告
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '20px'
      }}>
        <div style={{
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '8px'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#555' }}>销售数据</h3>
          <p style={{ margin: '5px 0', fontSize: '16px' }}>
            销售额: <strong>¥{data.sales?.toLocaleString()}</strong>
          </p>
          <p style={{ margin: '5px 0', fontSize: '16px' }}>
            订单数: <strong>{data.orders}</strong>
          </p>
        </div>

        <div style={{
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '8px'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#555' }}>增长数据</h3>
          <p style={{ margin: '5px 0', fontSize: '16px' }}>
            销售增长: <strong>{data.growth}%</strong>
          </p>
          <p style={{ margin: '5px 0', fontSize: '16px' }}>
            客户增长: <strong>{data.customerGrowth}%</strong>
          </p>
        </div>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#555' }}>备注</h3>
        <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
          数据统计时间：{new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}

// 使用虚拟DOM导出
const ReportPage: React.FC = () => {
  const handleExportVirtual = async () => {
    const reportData = {
      sales: 1250000,
      orders: 456,
      growth: 18.5,
      customerGrowth: 15.2
    }

    const component = <ExportReportComponent data={reportData} />

    await exportVirtualDOM(component, {
      filename: '月度销售报告.png',
      width: 800,
      height: 600,
      scale: 2,
      backgroundColor: '#ffffff'
    })
  }

  return (
    <div>
      <button onClick={handleExportVirtual}>
        导出虚拟DOM报告
      </button>
    </div>
  )
}
```

### 1.4.3. 高级虚拟DOM：支持CSS样式注入

```typescript
interface VirtualDOMExportOptions extends ExportOptions {
  customCSS?: string;
  externalCSS?: string[];
}

export const exportVirtualDOMWithCSS = async (
  component: React.ReactElement,
  options: VirtualDOMExportOptions = {}
) => {
  const {
    filename = "export.png",
    width = 800,
    height = 600,
    scale = 2,
    backgroundColor = "#ffffff",
    customCSS = "",
    externalCSS = [],
  } = options;

  // 渲染组件
  const htmlString = renderToString(component);

  // 构建CSS链接
  const cssLinks = externalCSS
    .map((url) => `<link rel="stylesheet" href="${url}">`)
    .join("\n");

  // 创建完整HTML
  const fullHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${cssLinks}
        <style>
          body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: ${backgroundColor};
            width: ${width}px;
            height: ${height}px;
            box-sizing: border-box;
          }
          * {
            box-sizing: border-box;
          }
          
          /* 自定义样式 */
          ${customCSS}
        </style>
      </head>
      <body>
        ${htmlString}
      </body>
    </html>
  `;

  // 创建iframe并渲染
  const iframe = document.createElement("iframe");
  iframe.style.cssText = `
    position: absolute;
    left: -9999px;
    top: -9999px;
    width: ${width}px;
    height: ${height}px;
    border: none;
  `;

  document.body.appendChild(iframe);

  try {
    iframe.contentDocument?.open();
    iframe.contentDocument?.write(fullHTML);
    iframe.contentDocument?.close();

    // 等待外部CSS加载
    await new Promise<void>((resolve) => {
      iframe.onload = () => {
        // 等待CSS加载完成
        setTimeout(resolve, 500);
      };
    });

    // 截图并下载
    const canvas = await html2canvas(iframe.contentDocument!.body, {
      backgroundColor,
      scale,
      useCORS: true,
      allowTaint: true,
    });

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = filename;
        link.href = url;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 100);
      }
    }, "image/png");
  } finally {
    document.body.removeChild(iframe);
  }
};
```

## 1.5. 方案对比与选择建议

| 方案        | 优点                            | 缺点                          | 适用场景                   |
| ----------- | ------------------------------- | ----------------------------- | -------------------------- |
| **隐藏DOM** | 完全支持React生命周期和状态管理 | 需要真实DOM渲染，性能开销较大 | 复杂交互组件、需要状态管理 |
| **Portal**  | 代码结构清晰，易于调试          | 仍需要DOM渲染，内存占用较高   | 需要与页面状态共享的场景   |
| **虚拟DOM** | 性能最好，无需DOM渲染           | 不支持复杂交互，样式限制多    | 静态内容、服务端渲染友好   |

### 1.5.1. 选择建议

1. **简单静态内容**: 首选虚拟DOM方案
2. **复杂交互组件**: 选择隐藏DOM方案
3. **需要调试验证**: 选择Portal方案
4. **性能要求高**: 优先考虑虚拟DOM方案
5. **样式复杂**: 选择隐藏DOM或Portal方案

## 1.6. 性能优化建议

### 1.6.1. 避免重复创建容器

```typescript
// 使用单例模式管理导出容器
class ExportManager {
  private static instance: ExportManager;

  private container: HTMLElement | null = null;

  static getInstance() {
    if (!ExportManager.instance) {
      ExportManager.instance = new ExportManager();
    }
    return ExportManager.instance;
  }

  getContainer() {
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.style.cssText = "position: absolute; left: -9999px;";
      document.body.appendChild(this.container);
    }
    return this.container;
  }

  cleanup() {
    if (this.container) {
      document.body.removeChild(this.container);
      this.container = null;
    }
  }
}
```

### 1.6.2. 预加载图片资源

```typescript
const preloadImages = async (imageSrcs: string[]) => {
  const promises = imageSrcs.map((src) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  });
  await Promise.all(promises);
};
```

### 1.6.3. 使用Web Workers

```typescript
// worker.js
self.onmessage = async function (e) {
  const { imageData, options } = e.data;

  // 在Worker中处理图片数据
  const canvas = new OffscreenCanvas(options.width, options.height);
  const ctx = canvas.getContext("2d");

  // 处理图片...

  const blob = await canvas.convertToBlob();
  self.postMessage({ blob });
};

// 主线程使用
const exportInWorker = async (imageData: any, options: any) => {
  const worker = new Worker("worker.js");

  return new Promise((resolve) => {
    worker.postMessage({ imageData, options });
    worker.onmessage = (e) => {
      resolve(e.data.blob);
      worker.terminate();
    };
  });
};
```

## 1.7. 总结

本文详细介绍了三种React DOM导出图片的技术方案：

1. **html2canvas + 隐藏DOM**: 功能最全面，适合复杂场景
2. **React Portal**: 代码结构清晰，便于调试
3. **虚拟DOM渲染**: 性能最优，适合静态内容

每种方案都有其适用场景，开发者应根据具体需求选择最合适的方案。同时，合理的性能优化能够显著提升导出体验。

希望这些技术方案能够帮助你在React项目中实现高质量的DOM导出功能！

```typescript
import html2canvas from "html2canvas";
import { createRoot } from "react-dom/client";

interface ExportOptions {
  filename?: string;
  width?: number;
  height?: number;
  scale?: number;
  backgroundColor?: string;
}

// 导出Hook
export const useExportImage = () => {
  const exportCustomContent = async (
    renderContent: () => JSX.Element,
    options: ExportOptions = {}
  ) => {
    const {
      filename = "export.png",
      width = 800,
      height = 600,
      scale = 2,
      backgroundColor = "#ffffff",
    } = options;

    // 1. 创建隐藏容器
    const exportContainer = document.createElement("div");
    exportContainer.style.cssText = `
      position: absolute;
      left: -9999px;
      top: -9999px;
      width: ${width}px;
      height: ${height}px;
      background-color: ${backgroundColor};
      padding: 20px;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    document.body.appendChild(exportContainer);

    try {
      // 2. 渲染React组件到隐藏容器
      const root = createRoot(exportContainer);
      root.render(renderContent());

      // 3. 等待渲染完成
      await new Promise((resolve) => setTimeout(resolve, 200));

      // 4. 使用html2canvas截图
      const canvas = await html2canvas(exportContainer, {
        backgroundColor,
        scale,
        useCORS: true,
        allowTaint: true,
        logging: false,
        windowWidth: width,
        windowHeight: height,
      });

      // 5. 下载图片
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.download = filename;
          link.href = url;
          link.click();

          // 清理URL
          setTimeout(() => {
            URL.revokeObjectURL(url);
          }, 100);
        }
      }, "image/png");

      // 6. 清理React组件
      root.unmount();
    } finally {
      // 7. 移除DOM容器
      document.body.removeChild(exportContainer);
    }
  };

  return { exportCustomContent };
};
```

```typescript
import React from 'react'
import { useExportImage } from './hooks/useExportImage'

// 专门用于导出的组件
const ExportReportComponent: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#fff',
      padding: '20px'
    }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>
        销售报告
      </h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <h3>本月数据</h3>
          <p>销售额: ¥{data.sales}</p>
          <p>订单数: {data.orders}</p>
        </div>
        <div style={{ flex: 1 }}>
          <h3>同比增长</h3>
          <p>销售增长: {data.growth}%</p>
          <p>客户增长: {data.customerGrowth}%</p>
        </div>
      </div>
      {/* 可以包含图表、表格等复杂内容 */}
    </div>
  )
}

// 使用组件
const ReportPage: React.FC = () => {
  const { exportCustomContent } = useExportImage()

  const handleExport = () => {
    const reportData = {
      sales: 150000,
      orders: 320,
      growth: 15.5,
      customerGrowth: 12.3
    }

    exportCustomContent(
      () => <ExportReportComponent data={reportData} />,
      {
        filename: '销售报告.png',
        width: 800,
        height: 600,
        scale: 2
      }
    )
  }

  return (
    <div>
      <button onClick={handleExport}>导出报告</button>
      {/* 页面其他内容 */}
    </div>
  )
}
```

```typescript
const exportWithAsyncData = async (
  dataLoader: () => Promise<any>,
  renderContent: (data: any) => JSX.Element,
  options: ExportOptions = {}
) => {
  const exportContainer = document.createElement("div");
  exportContainer.style.cssText = `
    position: absolute;
    left: -9999px;
    top: -9999px;

    width: ${options.width || 800}px;
    background-color: ${options.backgroundColor || "#fff"};

  `;

  document.body.appendChild(exportContainer);

  try {
    // 1. 加载数据
    const data = await dataLoader();

    // 2. 渲染组件
    const root = createRoot(exportContainer);
    root.render(renderContent(data));

    // 3. 等待渲染和图片加载
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 4. 确保所有图片都加载完成
    const images = exportContainer.querySelectorAll("img");
    await Promise.all(
      Array.from(images).map((img) => {
        return new Promise((resolve, reject) => {
          if (img.complete) {
            resolve(img);
          } else {
            img.onload = () => resolve(img);
            img.onerror = reject;
          }
        });
      })
    );

    // 5. 截图
    const canvas = await html2canvas(exportContainer, {
      backgroundColor: options.backgroundColor || "#fff",
      scale: options.scale || 2,

      useCORS: true,
      allowTaint: true,
    });

    // 6. 导出
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.download = options.filename || "export.png";

        link.href = url;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 100);
      }
    }, "image/png");

    root.unmount();
  } finally {
    document.body.removeChild(exportContainer);
  }
};
```

```typescript
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import html2canvas from "html2canvas";

// 创建Portal容器
const createExportContainer = () => {
  const container = document.createElement("div");
  container.id = "export-portal-container";
  container.style.cssText = `
    position: absolute;
    left: -9999px;
    top: -9999px;
    width: 800px;
    background-color: #fff;
    padding: 20px;
    box-sizing: border-box;
  `;
  document.body.appendChild(container);
  return container;
};

// Portal导出组件
const ExportPortal: React.FC<{
  isVisible: boolean;
  onExportComplete: () => void;
  children: React.ReactNode;
  exportOptions?: ExportOptions;
}> = ({ isVisible, onExportComplete, children, exportOptions = {} }) => {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null
  );

  useEffect(() => {
    if (isVisible) {
      const container = createExportContainer();
      setPortalContainer(container);

      // 延迟执行导出，确保内容渲染完成
      setTimeout(async () => {
        try {
          const canvas = await html2canvas(container, {
            backgroundColor: exportOptions.backgroundColor || "#fff",
            scale: exportOptions.scale || 2,

            useCORS: true,
            allowTaint: true,
          });

          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");

              link.download = exportOptions.filename || "export.png";

              link.href = url;
              link.click();
              setTimeout(() => URL.revokeObjectURL(url), 100);
            }
          }, "image/png");
        } finally {
          onExportComplete();
        }
      }, 300);
    }

    return () => {
      if (portalContainer) {
        document.body.removeChild(portalContainer);
        setPortalContainer(null);
      }
    };
  }, [isVisible, onExportComplete, exportOptions]);

  if (!isVisible || !portalContainer) return null;

  return createPortal(children, portalContainer);
};
```

```typescript
const ReportWithPortal: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false)
  const [reportData, setReportData] = useState(null)

  const handleExport = async () => {
    // 可以在这里加载最新数据
    const data = await fetchReportData()
    setReportData(data)
    setIsExporting(true)
  }

  const handleExportComplete = () => {
    setIsExporting(false)
    setReportData(null)
  }

  return (
    <div>
      <button onClick={handleExport} disabled={isExporting}>
        {isExporting ? '导出中...' : '导出报告'}
      </button>

      {/* Portal导出 */}
      <ExportPortal
        isVisible={isExporting}
        onExportComplete={handleExportComplete}
        exportOptions={{
          filename: '销售报告.png',
          width: 800,
          height: 600,
          scale: 2
        }}
      >
        {reportData && (
          <div style={{ width: '100%', minHeight: '600px' }}>
            <h1>销售报告</h1>
            <div>
              <p>销售额: ¥{reportData.sales}</p>
              <p>订单数: {reportData.orders}</p>
              {/* 更多报告内容 */}
            </div>
          </div>
        )}
      </ExportPortal>
    </div>
  )
}
```

```typescript
const DebugableExportPortal: React.FC<{
  isVisible: boolean
  debugMode?: boolean
  onExportComplete: () => void
  children: React.ReactNode
}> = ({ isVisible, debugMode = false, onExportComplete, children }) => {

  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (isVisible) {
      const container = createExportContainer()

      // 调试模式：显示导出内容
      if (debugMode) {
        container.style.left = '50px'
        container.style.top = '50px'
        container.style.border = '2px solid red'
        container.style.zIndex = '9999'
      }

      setPortalContainer(container)

      if (!debugMode) {
        // 非调试模式自动导出
        setTimeout(async () => {
          const canvas = await html2canvas(container, {
            backgroundColor: '#fff',
            scale: 2,
            useCORS: true,
            allowTaint: true,
          })

          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob)
              const link = document.createElement('a')
              link.download = 'debug-export.png'
              link.href = url
              link.click()
              setTimeout(() => URL.revokeObjectURL(url), 100)
            }
          }, 'image/png')

          onExportComplete()
        }, 300)
      }
    }

    return () => {
      if (portalContainer) {
        document.body.removeChild(portalContainer)
        setPortalContainer(null)
      }
    }
  }, [isVisible, debugMode, onExportComplete])

  if (!isVisible || !portalContainer) return null

  return createPortal(
    <div>
      {children}
      {debugMode && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={onExportComplete}>关闭调试</button>
        </div>
      )}
    </div>,
    portalContainer
  )
}
```

```typescript
import { renderToString } from "react-dom/server";
import html2canvas from "html2canvas";

// 虚拟DOM导出函数
export const exportVirtualDOM = async (
  component: React.ReactElement,
  options: ExportOptions = {}
) => {
  const {
    filename = "export.png",
    width = 800,
    height = 600,
    scale = 2,
    backgroundColor = "#ffffff",
  } = options;

  try {
    // 1. 渲染React组件为HTML字符串
    const htmlString = renderToString(component);

    // 2. 创建完整的HTML文档
    const fullHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background-color: ${backgroundColor};
              width: ${width}px;
              height: ${height}px;
              box-sizing: border-box;
            }
            * {
              box-sizing: border-box;
            }
          </style>
        </head>
        <body>
          ${htmlString}
        </body>
      </html>
    `;

    // 3. 创建iframe来渲染HTML
    const iframe = document.createElement("iframe");
    iframe.style.cssText = `
      position: absolute;
      left: -9999px;
      top: -9999px;
      width: ${width}px;
      height: ${height}px;
      border: none;
    `;

    document.body.appendChild(iframe);

    // 4. 写入HTML内容
    iframe.contentDocument?.open();
    iframe.contentDocument?.write(fullHTML);
    iframe.contentDocument?.close();

    // 5. 等待iframe加载完成
    await new Promise<void>((resolve) => {
      iframe.onload = () => {
        setTimeout(resolve, 200); // 额外等待时间确保样式应用
      };
    });

    // 6. 对iframe内容截图
    const canvas = await html2canvas(iframe.contentDocument!.body, {
      backgroundColor,
      scale,
      useCORS: true,
      allowTaint: true,
    });

    // 7. 下载图片
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = filename;
        link.href = url;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 100);
      }
    }, "image/png");

    // 8. 清理iframe
    document.body.removeChild(iframe);
  } catch (error) {
    console.error("虚拟DOM导出失败:", error);
    throw error;
  }
};
```

```typescript
import React from 'react'
import { exportVirtualDOM } from './utils/exportVirtualDOM'

// 纯函数组件，适合服务端渲染
const ExportReportComponent: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div style={{
      width: '100%',
      minHeight: '600px',
      backgroundColor: '#fff',
      padding: '20px'
    }}>
      <h1 style={{
        color: '#333',
        marginBottom: '20px',
        fontSize: '24px',
        fontWeight: 'bold'
      }}>
        月度销售报告
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '20px'
      }}>
        <div style={{
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '8px'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#555' }}>销售数据</h3>
          <p style={{ margin: '5px 0', fontSize: '16px' }}>
            销售额: <strong>¥{data.sales?.toLocaleString()}</strong>
          </p>
          <p style={{ margin: '5px 0', fontSize: '16px' }}>
            订单数: <strong>{data.orders}</strong>
          </p>
        </div>

        <div style={{
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '8px'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#555' }}>增长数据</h3>
          <p style={{ margin: '5px 0', fontSize: '16px' }}>
            销售增长: <strong>{data.growth}%</strong>
          </p>
          <p style={{ margin: '5px 0', fontSize: '16px' }}>
            客户增长: <strong>{data.customerGrowth}%</strong>
          </p>
        </div>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#555' }}>备注</h3>
        <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
          数据统计时间：{new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}

// 使用虚拟DOM导出
const ReportPage: React.FC = () => {
  const handleExportVirtual = async () => {
    const reportData = {
      sales: 1250000,
      orders: 456,
      growth: 18.5,
      customerGrowth: 15.2
    }

    const component = <ExportReportComponent data={reportData} />

    await exportVirtualDOM(component, {
      filename: '月度销售报告.png',
      width: 800,
      height: 600,
      scale: 2,
      backgroundColor: '#ffffff'
    })
  }

  return (
    <div>
      <button onClick={handleExportVirtual}>
        导出虚拟DOM报告
      </button>
    </div>
  )
}
```

```typescript
interface VirtualDOMExportOptions extends ExportOptions {
  customCSS?: string;
  externalCSS?: string[];
}

export const exportVirtualDOMWithCSS = async (
  component: React.ReactElement,
  options: VirtualDOMExportOptions = {}
) => {
  const {
    filename = "export.png",
    width = 800,
    height = 600,
    scale = 2,
    backgroundColor = "#ffffff",
    customCSS = "",
    externalCSS = [],
  } = options;

  // 渲染组件
  const htmlString = renderToString(component);

  // 构建CSS链接
  const cssLinks = externalCSS
    .map((url) => `<link rel="stylesheet" href="${url}">`)
    .join("\n");

  // 创建完整HTML
  const fullHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${cssLinks}
        <style>
          body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: ${backgroundColor};
            width: ${width}px;
            height: ${height}px;
            box-sizing: border-box;
          }
          * {
            box-sizing: border-box;
          }
          
          /* 自定义样式 */
          ${customCSS}
        </style>
      </head>
      <body>
        ${htmlString}
      </body>
    </html>
  `;

  // 创建iframe并渲染
  const iframe = document.createElement("iframe");
  iframe.style.cssText = `
    position: absolute;
    left: -9999px;
    top: -9999px;
    width: ${width}px;
    height: ${height}px;
    border: none;
  `;

  document.body.appendChild(iframe);

  try {
    iframe.contentDocument?.open();
    iframe.contentDocument?.write(fullHTML);
    iframe.contentDocument?.close();

    // 等待外部CSS加载
    await new Promise<void>((resolve) => {
      iframe.onload = () => {
        // 等待CSS加载完成
        setTimeout(resolve, 500);
      };
    });

    // 截图并下载
    const canvas = await html2canvas(iframe.contentDocument!.body, {
      backgroundColor,
      scale,
      useCORS: true,
      allowTaint: true,
    });

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = filename;
        link.href = url;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 100);
      }
    }, "image/png");
  } finally {
    document.body.removeChild(iframe);
  }
};
```

```typescript
// 使用单例模式管理导出容器
class ExportManager {
  private static instance: ExportManager;

  private container: HTMLElement | null = null;

  static getInstance() {
    if (!ExportManager.instance) {
      ExportManager.instance = new ExportManager();
    }
    return ExportManager.instance;
  }

  getContainer() {
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.style.cssText = "position: absolute; left: -9999px;";
      document.body.appendChild(this.container);
    }
    return this.container;
  }

  cleanup() {
    if (this.container) {
      document.body.removeChild(this.container);
      this.container = null;
    }
  }
}
```

```typescript
const preloadImages = async (imageSrcs: string[]) => {
  const promises = imageSrcs.map((src) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  });
  await Promise.all(promises);
};
```

```typescript
// worker.js
self.onmessage = async function (e) {
  const { imageData, options } = e.data;

  // 在Worker中处理图片数据
  const canvas = new OffscreenCanvas(options.width, options.height);
  const ctx = canvas.getContext("2d");

  // 处理图片...

  const blob = await canvas.convertToBlob();
  self.postMessage({ blob });
};

// 主线程使用
const exportInWorker = async (imageData: any, options: any) => {
  const worker = new Worker("worker.js");

  return new Promise((resolve) => {
    worker.postMessage({ imageData, options });
    worker.onmessage = (e) => {
      resolve(e.data.blob);
      worker.terminate();
    };
  });
};
```
