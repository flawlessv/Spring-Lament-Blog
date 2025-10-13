# Node.js 完全入门指南：从零开始的服务端开发之旅

## 前言

在现代 Web 开发生态中，JavaScript 已经从一个简单的浏览器脚本语言演变成为一个全栈开发的利器。Node.js 的出现打破了 JavaScript 只能在浏览器运行的限制，让前端工程师也能轻松涉足服务端开发领域。

本指南专为前端开发者量身定制，将带你系统地掌握 Node.js 的核心概念和实战技能。无论你是想成为全栈工程师，还是想开发自己的 API 服务，这篇文章都将成为你的最佳起点。

### 学前准备

在开始学习之前，你需要具备以下基础知识：

- ✅ 扎实的 JavaScript 基础（ES6+ 语法）
- ✅ 熟悉 npm/pnpm 等包管理工具
- ✅ 理解 HTTP 协议基本概念
- ✅ 有 AJAX/Fetch 异步请求经验

### 为什么要学习 Node.js？

1. **全栈开发能力**：掌握前后端开发，提升职场竞争力
2. **活跃的生态系统**：npm 拥有超过 200 万个包，几乎可以找到任何功能的解决方案
3. **高性能非阻塞 I/O**：基于事件驱动架构，适合处理高并发场景
4. **AI 开发友好**：大多数 AI SDK 都提供了优秀的 JavaScript 支持
5. **跨平台特性**：一次编写，多端部署（Windows、macOS、Linux）

---

## 第一章：理解 JavaScript 运行时

### 1.1 什么是运行时（Runtime）？

让我们从一个简单的问题开始思考：当你编写了以下代码时，它是如何被执行的？

```javascript
console.log("Hello World");
```

这段代码本质上只是一串文本字符，就像你在记事本里写的任何文字一样。那么问题来了：**文本怎么变成可执行的程序？**

答案是：**你需要一个"解释器"或"运行时环境"**。

**运行时（Runtime）** 是指程序执行时所需要的环境，它包含了：

- 语言解释器或编译器
- 内存管理机制
- 可调用的 API 库
- 事件循环机制（针对 JavaScript）

### 1.2 JavaScript 运行时的演变

**第一阶段：浏览器时代（1995-2009）**

JavaScript 诞生于 1995 年，最初只是为了让网页具备一些简单的交互能力。它只能在浏览器中运行，因为浏览器内置了 JavaScript 引擎（如 V8、SpiderMonkey）。

```html
<!-- JavaScript 只能这样运行 -->
<script>
  alert("我只能在浏览器中运行");
</script>
```

**第二阶段：Node.js 革命（2009-至今）**

2009 年，Ryan Dahl 创造了 Node.js，它让 JavaScript 突破了浏览器的限制。Node.js 的核心创新是：

- 使用 Chrome 的 V8 引擎作为 JS 解释器
- 提供了文件系统、网络等操作系统级别的 API
- 采用事件驱动的非阻塞 I/O 模型

这意味着 JavaScript 可以：

- 读写本地文件
- 创建 HTTP 服务器
- 操作数据库
- 执行系统命令

**第三阶段：新兴运行时（2020-至今）**

近年来出现了 Deno 和 Bun 等新兴运行时，它们试图解决 Node.js 的一些历史问题：

- **Deno**：由 Node.js 创始人开发，注重安全性和现代化
- **Bun**：专注于极致性能，内置了打包、测试等工具

不过 Node.js 依然是生产环境的主流选择，拥有最成熟的生态系统。

### 1.3 浏览器 vs Node.js：运行环境的本质区别

| 特性         | 浏览器环境                | Node.js 环境             |
| ------------ | ------------------------- | ------------------------ |
| **全局对象** | `window`                  | `global`                 |
| **DOM 操作** | ✅ 支持                   | ❌ 不支持                |
| **文件系统** | ❌ 受限（安全性）         | ✅ 完全访问              |
| **网络请求** | `XMLHttpRequest`、`fetch` | `http`、`https`、`fetch` |
| **模块系统** | ES Modules                | CommonJS + ES Modules    |
| **用途**     | 用户界面交互              | 服务器、工具链、脚本     |

**一个直观的例子：**

```javascript
// ❌ 在 Node.js 中运行会报错
document.getElementById("app").innerHTML = "Hello";
// ReferenceError: document is not defined

// ✅ 在浏览器中运行会报错
const fs = require("fs");
fs.readFileSync("./file.txt");
// ReferenceError: require is not defined (需要打包工具支持)
```

**关键认知**：浏览器 API（如 `document`、`window`）和 Node.js API（如 `fs`、`http`）是完全不同的，它们由各自的运行时提供。JavaScript 语言本身（变量、函数、Promise 等）是通用的。

---

## 第二章：Node.js 环境搭建与基础使用

### 2.1 安装 Node.js

**方式一：官方安装包（推荐初学者）**

访问 [Node.js 官网](https://nodejs.org/)，下载 LTS（长期支持版）：

- Windows：下载 `.msi` 安装包
- macOS：下载 `.pkg` 安装包或使用 Homebrew：`brew install node`
- Linux：使用包管理器，如 `apt install nodejs npm`

**方式二：版本管理工具（推荐开发者）**

使用 nvm（Node Version Manager）可以轻松切换不同版本：

```bash
# macOS/Linux
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install --lts
nvm use --lts

# Windows (使用 nvm-windows)
# 下载安装：https://github.com/coreybutler/nvm-windows/releases
nvm install lts
nvm use lts
```

**验证安装：**

```bash
node --version    # 输出：v20.x.x（或更高版本）
npm --version     # 输出：10.x.x（或更高版本）
```

### 2.2 第一个 Node.js 程序

创建一个文件 `hello.js`：

```javascript
// hello.js
console.log("欢迎来到 Node.js 世界！");
console.log("当前 Node.js 版本：", process.version);
console.log("当前操作系统：", process.platform);
```

运行程序：

```bash
node hello.js
```

输出结果：

```
欢迎来到 Node.js 世界！
当前 Node.js 版本： v20.11.0
当前操作系统： darwin
```

### 2.3 交互式 REPL 环境

在终端直接输入 `node` 即可进入 REPL（Read-Eval-Print Loop）环境：

```bash
$ node
> 1 + 2
3
> const arr = [1, 2, 3]
undefined
> arr.map(x => x * 2)
[ 2, 4, 6 ]
> .exit  # 退出 REPL
```

**REPL 快捷键：**

- `.help` - 显示帮助
- `.break` - 中断多行输入
- `.clear` - 重置上下文
- `.save filename` - 保存会话到文件
- `.load filename` - 从文件加载
- `Ctrl+C` 两次 - 退出

### 2.4 理解 process 全局对象

`process` 是 Node.js 的核心全局对象，提供了进程相关的信息和控制能力：

```javascript
// process-demo.js

// 环境变量
console.log("用户目录：", process.env.HOME);
console.log("Node 环境：", process.env.NODE_ENV);

// 命令行参数
console.log("所有参数：", process.argv);
// 运行：node process-demo.js arg1 arg2
// 输出：[ '/usr/local/bin/node', '/path/to/process-demo.js', 'arg1', 'arg2' ]

// 当前工作目录
console.log("工作目录：", process.cwd());

// 内存使用情况
console.log("内存使用：", process.memoryUsage());
// 输出：{ rss: 36864000, heapTotal: 4526080, heapUsed: 2649456, ... }

// 进程 ID
console.log("进程 ID：", process.pid);

// 优雅退出
process.on("SIGINT", () => {
  console.log("\n程序被中断，正在清理资源...");
  process.exit(0);
});
```

---

## 第三章：Node.js 核心模块实战

### 3.1 操作系统信息模块（os）

`os` 模块提供了与操作系统交互的方法，这在浏览器中是完全不可能实现的。

```javascript
// system-info.js
const os = require("os");

/**
 * 获取系统详细信息
 */
function displaySystemInfo() {
  const info = {
    // 基本信息
    操作系统: os.platform(), // 'darwin', 'win32', 'linux'
    系统架构: os.arch(), // 'x64', 'arm64'
    主机名: os.hostname(),

    // CPU 信息
    CPU核心数: os.cpus().length,
    CPU型号: os.cpus()[0].model,
    CPU速度: `${os.cpus()[0].speed} MHz`,

    // 内存信息
    总内存: `${(os.totalmem() / 1024 ** 3).toFixed(2)} GB`,
    可用内存: `${(os.freemem() / 1024 ** 3).toFixed(2)} GB`,
    内存使用率: `${((1 - os.freemem() / os.totalmem()) * 100).toFixed(2)}%`,

    // 系统运行时间
    运行时长: `${(os.uptime() / 3600).toFixed(2)} 小时`,

    // 用户信息
    当前用户: os.userInfo().username,
    用户目录: os.homedir(),
    临时目录: os.tmpdir(),
  };

  console.table(info);
}

displaySystemInfo();

// 实用函数：监控内存使用
function monitorMemory() {
  setInterval(() => {
    const used = os.totalmem() - os.freemem();
    const percentage = ((used / os.totalmem()) * 100).toFixed(2);
    console.log(
      `内存使用：${percentage}% | 已用：${(used / 1024 ** 3).toFixed(2)} GB`
    );
  }, 5000);
}

// monitorMemory(); // 取消注释以启动监控
```

**运行结果：**

```
┌──────────────┬───────────────────────────────┐
│   (index)    │           Values              │
├──────────────┼───────────────────────────────┤
│   操作系统   │           'darwin'            │
│   系统架构   │            'arm64'            │
│   主机名     │      'MacBook-Pro.local'      │
│  CPU核心数   │              10               │
│   CPU型号    │    'Apple M1 Pro'             │
│   总内存     │          '16.00 GB'           │
│  可用内存    │           '8.23 GB'           │
│ 内存使用率   │           '48.56%'            │
└──────────────┴───────────────────────────────┘
```

### 3.2 路径处理模块（path）

`path` 模块用于处理文件路径，它会自动处理不同操作系统的路径分隔符差异（Windows 使用 `\`，Unix 使用 `/`）。

```javascript
// path-demo.js
const path = require("path");

// 路径拼接（自动处理分隔符）
const filePath = path.join("/users", "documents", "report.pdf");
console.log("拼接路径：", filePath);
// macOS: /users/documents/report.pdf
// Windows: \users\documents\report.pdf

// 解析路径为绝对路径
const absolutePath = path.resolve("src", "utils", "helper.js");
console.log("绝对路径：", absolutePath);
// 输出：/Users/yourname/project/src/utils/helper.js

// 提取路径信息
const fullPath = "/users/docs/report.pdf";
console.log({
  目录名: path.dirname(fullPath), // /users/docs
  文件名: path.basename(fullPath), // report.pdf
  扩展名: path.extname(fullPath), // .pdf
  不含扩展名: path.basename(fullPath, ".pdf"), // report
});

// 解析路径为对象
const parsed = path.parse("/users/docs/report.pdf");
console.log("路径对象：", parsed);
/*
{
  root: '/',
  dir: '/users/docs',
  base: 'report.pdf',
  ext: '.pdf',
  name: 'report'
}
*/

// 组合路径对象
const composed = path.format({
  dir: "/users/docs",
  base: "report.pdf",
});
console.log("组合路径：", composed); // /users/docs/report.pdf

// 规范化路径（处理 .. 和 .）
const messy = "/users/docs/../images/./photo.jpg";
console.log("规范化：", path.normalize(messy)); // /users/images/photo.jpg

// 获取相对路径
const from = "/users/docs/reports";
const to = "/users/docs/images/logo.png";
console.log("相对路径：", path.relative(from, to)); // ../images/logo.png

// 常用特殊变量
console.log("当前文件路径：", __filename);
console.log("当前目录路径：", __dirname);
```

**实战技巧：构建跨平台路径**

```javascript
// ❌ 不推荐：硬编码路径分隔符
const badPath = __dirname + "/data/config.json";

// ✅ 推荐：使用 path.join
const goodPath = path.join(__dirname, "data", "config.json");

// ✅ 推荐：使用 path.resolve（相对于当前工作目录）
const configPath = path.resolve("config", "database.json");
```

### 3.3 文件系统模块（fs）

`fs` 模块是 Node.js 最强大的核心模块之一，提供了文件和目录的完整操作能力。

#### 3.3.1 同步 vs 异步操作

Node.js 的 fs 模块同时提供了同步和异步两种 API：

```javascript
const fs = require("fs");

// ❌ 同步操作（会阻塞程序）
const data1 = fs.readFileSync("file.txt", "utf8");
console.log("文件内容：", data1);
console.log("继续执行...");

// ✅ 异步操作（推荐）
fs.readFile("file.txt", "utf8", (err, data2) => {
  if (err) {
    console.error("读取失败：", err);
    return;
  }
  console.log("文件内容：", data2);
});
console.log("继续执行..."); // 这行会先执行

// ✅ Promise 风格（最推荐）
const fs = require("fs").promises;
async function readFileAsync() {
  try {
    const data = await fs.readFile("file.txt", "utf8");
    console.log("文件内容：", data);
  } catch (err) {
    console.error("读取失败：", err);
  }
}
```

**性能对比：**

- **同步**：简单直观，但会阻塞整个进程，仅适合脚本工具
- **回调**：不阻塞，但容易形成"回调地狱"
- **Promise**：语法现代，推荐在生产环境使用

#### 3.3.2 完整的文件操作示例

```javascript
// file-operations.js
const fs = require("fs").promises;
const path = require("path");

/**
 * 文件操作工具类
 */
class FileManager {
  constructor(baseDir) {
    this.baseDir = baseDir;
  }

  /**
   * 确保目录存在，不存在则创建
   */
  async ensureDir(dirPath) {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
      console.log(`✅ 已创建目录：${dirPath}`);
    }
  }

  /**
   * 写入文件（会覆盖已有内容）
   */
  async writeFile(filename, content) {
    const filePath = path.join(this.baseDir, filename);
    await this.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content, "utf8");
    console.log(`✅ 已写入文件：${filePath}`);
  }

  /**
   * 追加内容到文件末尾
   */
  async appendFile(filename, content) {
    const filePath = path.join(this.baseDir, filename);
    await fs.appendFile(filePath, content, "utf8");
    console.log(`✅ 已追加内容到：${filePath}`);
  }

  /**
   * 读取文件内容
   */
  async readFile(filename) {
    const filePath = path.join(this.baseDir, filename);
    try {
      const content = await fs.readFile(filePath, "utf8");
      return content;
    } catch (err) {
      console.error(`❌ 文件不存在：${filePath}`);
      return null;
    }
  }

  /**
   * 复制文件
   */
  async copyFile(source, destination) {
    const srcPath = path.join(this.baseDir, source);
    const destPath = path.join(this.baseDir, destination);
    await this.ensureDir(path.dirname(destPath));
    await fs.copyFile(srcPath, destPath);
    console.log(`✅ 已复制：${source} → ${destination}`);
  }

  /**
   * 删除文件
   */
  async deleteFile(filename) {
    const filePath = path.join(this.baseDir, filename);
    try {
      await fs.unlink(filePath);
      console.log(`✅ 已删除文件：${filePath}`);
    } catch (err) {
      console.error(`❌ 删除失败：${err.message}`);
    }
  }

  /**
   * 重命名文件或移动文件
   */
  async moveFile(oldPath, newPath) {
    const oldFilePath = path.join(this.baseDir, oldPath);
    const newFilePath = path.join(this.baseDir, newPath);
    await this.ensureDir(path.dirname(newFilePath));
    await fs.rename(oldFilePath, newFilePath);
    console.log(`✅ 已移动：${oldPath} → ${newPath}`);
  }

  /**
   * 获取文件信息
   */
  async getFileInfo(filename) {
    const filePath = path.join(this.baseDir, filename);
    try {
      const stats = await fs.stat(filePath);
      return {
        大小: `${(stats.size / 1024).toFixed(2)} KB`,
        创建时间: stats.birthtime,
        修改时间: stats.mtime,
        是否为目录: stats.isDirectory(),
        是否为文件: stats.isFile(),
      };
    } catch (err) {
      return null;
    }
  }

  /**
   * 列出目录中的所有文件
   */
  async listFiles(dirPath = "") {
    const fullPath = path.join(this.baseDir, dirPath);
    try {
      const files = await fs.readdir(fullPath);
      return files;
    } catch (err) {
      console.error(`❌ 读取目录失败：${err.message}`);
      return [];
    }
  }

  /**
   * 递归读取目录结构
   */
  async listFilesRecursive(dirPath = "") {
    const fullPath = path.join(this.baseDir, dirPath);
    const result = [];

    async function walk(currentPath) {
      const items = await fs.readdir(currentPath, { withFileTypes: true });

      for (const item of items) {
        const itemPath = path.join(currentPath, item.name);
        const relativePath = path.relative(fullPath, itemPath);

        if (item.isDirectory()) {
          result.push({ type: "dir", path: relativePath });
          await walk(itemPath);
        } else {
          result.push({ type: "file", path: relativePath });
        }
      }
    }

    await walk(fullPath);
    return result;
  }

  /**
   * 读写 JSON 文件
   */
  async readJSON(filename) {
    const content = await this.readFile(filename);
    return content ? JSON.parse(content) : null;
  }

  async writeJSON(filename, data) {
    const content = JSON.stringify(data, null, 2);
    await this.writeFile(filename, content);
  }
}

// 使用示例
async function demo() {
  const fm = new FileManager("./data");

  // 写入文件
  await fm.writeFile("notes.txt", "这是第一行笔记\n");

  // 追加内容
  await fm.appendFile("notes.txt", "这是第二行笔记\n");

  // 读取文件
  const content = await fm.readFile("notes.txt");
  console.log("文件内容：\n", content);

  // 写入 JSON
  await fm.writeJSON("config.json", {
    appName: "My App",
    version: "1.0.0",
    debug: true,
  });

  // 读取 JSON
  const config = await fm.readJSON("config.json");
  console.log("配置信息：", config);

  // 获取文件信息
  const info = await fm.getFileInfo("config.json");
  console.log("文件信息：", info);

  // 列出所有文件
  const files = await fm.listFiles();
  console.log("所有文件：", files);
}

// 运行示例
demo().catch(console.error);
```

#### 3.3.3 文件流操作（处理大文件）

对于大文件（如视频、日志），一次性读取会占用大量内存。使用流可以逐块处理：

```javascript
const fs = require("fs");
const path = require("path");

/**
 * 使用流复制大文件
 */
function copyLargeFile(source, destination) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(source);
    const writeStream = fs.createWriteStream(destination);

    // 监听进度
    let transferred = 0;
    readStream.on("data", (chunk) => {
      transferred += chunk.length;
      console.log(`已传输：${(transferred / 1024 / 1024).toFixed(2)} MB`);
    });

    // 管道操作
    readStream
      .pipe(writeStream)
      .on("finish", () => {
        console.log("✅ 复制完成");
        resolve();
      })
      .on("error", reject);
  });
}

// 使用示例
copyLargeFile("large-video.mp4", "backup-video.mp4");
```

---

## 第四章：构建 HTTP 服务器

### 4.1 使用原生 http 模块

Node.js 内置的 `http` 模块可以让你快速创建 HTTP 服务器，无需任何第三方依赖。

#### 4.1.1 最简单的 HTTP 服务器

```javascript
// simple-server.js
const http = require("http");

const server = http.createServer((req, res) => {
  // 设置响应头
  res.writeHead(200, {
    "Content-Type": "text/plain; charset=utf-8",
  });

  // 返回响应内容
  res.end("你好，Node.js！");
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 服务器已启动：http://localhost:${PORT}`);
});
```

运行后访问 `http://localhost:3000` 即可看到结果。

#### 4.1.2 处理不同的路由和方法

```javascript
// router-server.js
const http = require("http");
const url = require("url");

const server = http.createServer((req, res) => {
  // 解析 URL
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // 设置 JSON 响应头
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  // 路由处理
  if (pathname === "/" && req.method === "GET") {
    // 首页
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        message: "欢迎访问 API",
        time: new Date().toISOString(),
      })
    );
  } else if (pathname === "/api/users" && req.method === "GET") {
    // 获取用户列表
    const users = [
      { id: 1, name: "张三", email: "zhangsan@example.com" },
      { id: 2, name: "李四", email: "lisi@example.com" },
    ];

    res.statusCode = 200;
    res.end(
      JSON.stringify({
        success: true,
        data: users,
      })
    );
  } else if (pathname === "/api/search" && req.method === "GET") {
    // 处理查询参数
    const keyword = query.keyword || "";

    res.statusCode = 200;
    res.end(
      JSON.stringify({
        success: true,
        keyword,
        results: [`${keyword} 的搜索结果...`],
      })
    );
  } else if (pathname === "/api/users" && req.method === "POST") {
    // 接收 POST 数据
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const userData = JSON.parse(body);
        console.log("收到用户数据：", userData);

        // 模拟保存到数据库
        const newUser = {
          id: Date.now(),
          ...userData,
          createdAt: new Date().toISOString(),
        };

        res.statusCode = 201;
        res.end(
          JSON.stringify({
            success: true,
            message: "用户创建成功",
            data: newUser,
          })
        );
      } catch (err) {
        res.statusCode = 400;
        res.end(
          JSON.stringify({
            success: false,
            message: "无效的 JSON 数据",
          })
        );
      }
    });
  } else {
    // 404 处理
    res.statusCode = 404;
    res.end(
      JSON.stringify({
        success: false,
        message: "接口不存在",
      })
    );
  }
});

server.listen(3000, () => {
  console.log("🚀 服务器已启动在 http://localhost:3000");
  console.log("📖 可用接口：");
  console.log("  GET  /");
  console.log("  GET  /api/users");
  console.log("  POST /api/users");
  console.log("  GET  /api/search?keyword=xxx");
});
```

**测试方式：**

```bash
# 测试 GET 请求
curl http://localhost:3000/api/users

# 测试带查询参数的 GET 请求
curl "http://localhost:3000/api/search?keyword=nodejs"

# 测试 POST 请求
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"王五","email":"wangwu@example.com"}'
```

### 4.2 使用 Express 框架

虽然原生 `http` 模块功能强大，但编写复杂应用时代码会变得冗长。Express 是 Node.js 生态中最流行的 Web 框架，它提供了更优雅的 API。

#### 4.2.1 Express 快速开始

```bash
# 创建项目目录
mkdir my-express-app
cd my-express-app

# 初始化项目
npm init -y

# 安装依赖
npm install express
npm install nodemon --save-dev
```

修改 `package.json` 添加启动脚本：

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}
```

创建 `index.js`：

```javascript
const express = require("express");
const app = express();

// 中间件：解析 JSON 请求体
app.use(express.json());

// 中间件：记录请求日志
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// 路由：首页
app.get("/", (req, res) => {
  res.json({
    message: "欢迎使用 Express API",
    version: "1.0.0",
  });
});

// 路由：获取用户列表
app.get("/api/users", (req, res) => {
  const users = [
    { id: 1, name: "张三", role: "admin" },
    { id: 2, name: "李四", role: "user" },
  ];
  res.json({ success: true, data: users });
});

// 路由：获取单个用户
app.get("/api/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const user = { id: userId, name: `用户${userId}` };
  res.json({ success: true, data: user });
});

// 路由：创建用户
app.post("/api/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: "姓名和邮箱为必填项",
    });
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    createdAt: new Date().toISOString(),
  };

  res.status(201).json({
    success: true,
    message: "用户创建成功",
    data: newUser,
  });
});

// 路由：更新用户
app.put("/api/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email } = req.body;

  res.json({
    success: true,
    message: "用户更新成功",
    data: { id: userId, name, email },
  });
});

// 路由：删除用户
app.delete("/api/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  res.json({
    success: true,
    message: `用户 ${userId} 已删除`,
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error("服务器错误：", err);
  res.status(500).json({
    success: false,
    message: "服务器内部错误",
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "接口不存在",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Express 服务器已启动在 http://localhost:${PORT}`);
});
```

运行项目：

```bash
npm run dev
```

#### 4.2.2 RESTful API 完整示例

创建一个完整的用户管理 API：

```javascript
// app.js
const express = require("express");
const app = express();

app.use(express.json());

// 模拟数据库
let users = [
  {
    id: 1,
    name: "张三",
    email: "zhangsan@example.com",
    createdAt: "2025-01-01",
  },
  { id: 2, name: "李四", email: "lisi@example.com", createdAt: "2025-01-02" },
];
let nextId = 3;

/**
 * GET /api/users - 获取用户列表（支持分页和搜索）
 */
app.get("/api/users", (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  // 搜索过滤
  let filteredUsers = users;
  if (search) {
    filteredUsers = users.filter(
      (u) => u.name.includes(search) || u.email.includes(search)
    );
  }

  // 分页
  const start = (page - 1) * limit;
  const end = start + parseInt(limit);
  const paginatedUsers = filteredUsers.slice(start, end);

  res.json({
    success: true,
    data: paginatedUsers,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredUsers.length,
    },
  });
});

/**
 * GET /api/users/:id - 获取单个用户
 */
app.get("/api/users/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "用户不存在",
    });
  }

  res.json({ success: true, data: user });
});

/**
 * POST /api/users - 创建新用户
 */
app.post("/api/users", (req, res) => {
  const { name, email } = req.body;

  // 验证
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: "姓名和邮箱为必填项",
    });
  }

  // 检查邮箱是否已存在
  if (users.some((u) => u.email === email)) {
    return res.status(409).json({
      success: false,
      message: "邮箱已被使用",
    });
  }

  const newUser = {
    id: nextId++,
    name,
    email,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: "用户创建成功",
    data: newUser,
  });
});

/**
 * PUT /api/users/:id - 更新用户
 */
app.put("/api/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "用户不存在",
    });
  }

  const { name, email } = req.body;

  // 更新用户
  users[userIndex] = {
    ...users[userIndex],
    ...(name && { name }),
    ...(email && { email }),
    updatedAt: new Date().toISOString(),
  };

  res.json({
    success: true,
    message: "用户更新成功",
    data: users[userIndex],
  });
});

/**
 * DELETE /api/users/:id - 删除用户
 */
app.delete("/api/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "用户不存在",
    });
  }

  users.splice(userIndex, 1);

  res.json({
    success: true,
    message: "用户删除成功",
  });
});

// 启动服务器
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
});
```

### 4.3 使用 Koa 框架

Koa 是由 Express 原班人马打造的新一代框架，采用了更现代的 async/await 语法，中间件机制更加优雅。

#### 4.3.1 Koa 基础使用

```bash
npm install koa koa-body @koa/router
```

创建 `koa-app.js`：

```javascript
const Koa = require("koa");
const Router = require("@koa/router");
const { koaBody } = require("koa-body");

const app = new Koa();
const router = new Router();

// 中间件：解析请求体
app.use(koaBody());

// 中间件：日志记录
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// 中间件：错误处理
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
      success: false,
      message: err.message,
    };
    console.error("Error:", err);
  }
});

// 路由
router.get("/", async (ctx) => {
  ctx.body = {
    message: "欢迎使用 Koa API",
    version: "1.0.0",
  };
});

router.get("/api/users", async (ctx) => {
  // 模拟异步数据库查询
  await new Promise((resolve) => setTimeout(resolve, 100));

  ctx.body = {
    success: true,
    data: [
      { id: 1, name: "张三" },
      { id: 2, name: "李四" },
    ],
  };
});

router.post("/api/users", async (ctx) => {
  const { name, email } = ctx.request.body;

  if (!name || !email) {
    ctx.status = 400;
    ctx.body = {
      success: false,
      message: "姓名和邮箱为必填项",
    };
    return;
  }

  // 模拟保存到数据库
  await new Promise((resolve) => setTimeout(resolve, 100));

  ctx.status = 201;
  ctx.body = {
    success: true,
    message: "用户创建成功",
    data: { id: Date.now(), name, email },
  };
});

// 注册路由
app.use(router.routes());
app.use(router.allowedMethods());

// 启动服务器
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Koa 服务器运行在 http://localhost:${PORT}`);
});
```

**Koa vs Express 对比：**

| 特性         | Express        | Koa                    |
| ------------ | -------------- | ---------------------- |
| **语法风格** | 回调风格       | async/await            |
| **中间件**   | 线性执行       | 洋葱模型               |
| **错误处理** | 需要手动处理   | 自动捕获 async 错误    |
| **内置功能** | 较多内置中间件 | 极简核心，功能通过插件 |
| **学习曲线** | 较缓           | 需要理解洋葱模型       |

---

## 第五章：数据库操作与 ORM

### 5.1 为什么需要数据库？

在前面的示例中，我们都是将数据存储在内存中（普通变量），这有很大的局限性：

- ❌ 服务器重启后数据丢失
- ❌ 无法处理大量数据
- ❌ 没有数据持久化能力
- ❌ 无法实现复杂查询

数据库可以解决这些问题，常见的数据库类型：

**关系型数据库（SQL）：**

- PostgreSQL（推荐）
- MySQL/MariaDB
- SQLite（轻量级，适合开发和小型项目）

**非关系型数据库（NoSQL）：**

- MongoDB（文档数据库）
- Redis（内存数据库）

### 5.2 使用 Prisma ORM

Prisma 是现代 Node.js 开发中最流行的 ORM 工具，它的优势：

- ✅ 类型安全（完美支持 TypeScript）
- ✅ 自动生成数据库迁移
- ✅ 直观的查询 API
- ✅ 支持多种数据库

#### 5.2.1 Prisma 快速开始

```bash
# 安装 Prisma
npm install prisma --save-dev
npm install @prisma/client

# 初始化 Prisma
npx prisma init --datasource-provider sqlite
```

这会创建两个文件：

- `prisma/schema.prisma` - 数据库模式定义
- `.env` - 环境变量配置

编辑 `prisma/schema.prisma`：

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// 用户表
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  password  String
  role      String   @default("user")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  posts     Post[]
  profile   Profile?
}

// 用户资料表
model Profile {
  id     Int    @id @default(autoincrement())
  bio    String?
  avatar String?
  userId Int    @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// 文章表
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  published Boolean  @default(false)
  viewCount Int      @default(0)
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  tags      Tag[]
}

// 标签表
model Tag {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[]
}
```

生成数据库表：

```bash
# 创建数据库迁移
npx prisma migrate dev --name init

# 这会创建数据库并生成 Prisma Client
```

#### 5.2.2 Prisma Client 基础操作

创建 `db-demo.js`：

```javascript
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * 创建用户
 */
async function createUser() {
  const user = await prisma.user.create({
    data: {
      name: "张三",
      email: "zhangsan@example.com",
      password: "hashed_password_here",
      profile: {
        create: {
          bio: "这是我的个人简介",
          avatar: "https://example.com/avatar.jpg",
        },
      },
    },
    include: {
      profile: true,
    },
  });

  console.log("用户已创建：", user);
  return user;
}

/**
 * 查询所有用户
 */
async function getAllUsers() {
  const users = await prisma.user.findMany({
    include: {
      profile: true,
      posts: true,
    },
  });

  console.log(`找到 ${users.length} 个用户：`);
  users.forEach((user) => {
    console.log(`- ${user.name} (${user.email}) - ${user.posts.length} 篇文章`);
  });

  return users;
}

/**
 * 根据 ID 查询用户
 */
async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      profile: true,
      posts: {
        where: { published: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    console.log("用户不存在");
    return null;
  }

  console.log("用户信息：", user);
  return user;
}

/**
 * 根据邮箱查询用户
 */
async function getUserByEmail(email) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  return user;
}

/**
 * 更新用户
 */
async function updateUser(id, data) {
  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  });

  console.log("用户已更新：", updatedUser);
  return updatedUser;
}

/**
 * 删除用户（会级联删除关联的 profile 和 posts）
 */
async function deleteUser(id) {
  const deletedUser = await prisma.user.delete({
    where: { id },
  });

  console.log("用户已删除：", deletedUser);
  return deletedUser;
}

/**
 * 创建文章
 */
async function createPost(authorId, title, content) {
  const post = await prisma.post.create({
    data: {
      title,
      content,
      author: {
        connect: { id: authorId },
      },
      tags: {
        connectOrCreate: [
          {
            where: { name: "Node.js" },
            create: { name: "Node.js" },
          },
          {
            where: { name: "教程" },
            create: { name: "教程" },
          },
        ],
      },
    },
    include: {
      author: true,
      tags: true,
    },
  });

  console.log("文章已创建：", post);
  return post;
}

/**
 * 发布文章
 */
async function publishPost(postId) {
  const post = await prisma.post.update({
    where: { id: postId },
    data: { published: true },
  });

  console.log("文章已发布：", post.title);
  return post;
}

/**
 * 搜索文章（支持分页）
 */
async function searchPosts(keyword, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [posts, total] = await prisma.$transaction([
    prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: keyword } },
          { content: { contains: keyword } },
        ],
        published: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tags: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),
    prisma.post.count({
      where: {
        OR: [
          { title: { contains: keyword } },
          { content: { contains: keyword } },
        ],
        published: true,
      },
    }),
  ]);

  console.log(`搜索 "${keyword}" 找到 ${total} 个结果`);
  return { posts, total, page, limit };
}

/**
 * 增加文章浏览量
 */
async function incrementViewCount(postId) {
  const post = await prisma.post.update({
    where: { id: postId },
    data: {
      viewCount: { increment: 1 },
    },
  });

  return post;
}

/**
 * 获取用户统计信息
 */
async function getUserStats(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
      posts: {
        select: {
          viewCount: true,
        },
      },
    },
  });

  if (!user) return null;

  const totalViews = user.posts.reduce((sum, post) => sum + post.viewCount, 0);

  return {
    userId: user.id,
    name: user.name,
    postCount: user._count.posts,
    totalViews,
  };
}

// 主函数：演示完整流程
async function main() {
  console.log("🚀 开始数据库操作演示...\n");

  try {
    // 1. 创建用户
    console.log("📝 创建用户...");
    const user = await createUser();

    // 2. 创建文章
    console.log("\n📝 创建文章...");
    const post = await createPost(
      user.id,
      "Node.js 入门教程",
      "这是一篇关于 Node.js 的教程..."
    );

    // 3. 发布文章
    console.log("\n📢 发布文章...");
    await publishPost(post.id);

    // 4. 增加浏览量
    console.log("\n👀 模拟浏览...");
    await incrementViewCount(post.id);
    await incrementViewCount(post.id);

    // 5. 查询所有用户
    console.log("\n👥 查询所有用户...");
    await getAllUsers();

    // 6. 搜索文章
    console.log("\n🔍 搜索文章...");
    await searchPosts("Node.js");

    // 7. 获取用户统计
    console.log("\n📊 用户统计...");
    const stats = await getUserStats(user.id);
    console.log(stats);

    console.log("\n✅ 演示完成！");
  } catch (error) {
    console.error("❌ 错误：", error);
  } finally {
    await prisma.$disconnect();
  }
}

// 如果直接运行此文件，则执行 main 函数
if (require.main === module) {
  main();
}

// 导出函数供其他模块使用
module.exports = {
  prisma,
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
  createPost,
  publishPost,
  searchPosts,
  incrementViewCount,
  getUserStats,
};
```

#### 5.2.3 将 Prisma 集成到 Express

创建 `server-with-db.js`：

```javascript
const express = require("express");
const { prisma } = require("./db-demo");

const app = express();
app.use(express.json());

/**
 * 用户相关路由
 */

// 获取用户列表
app.get("/api/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: { posts: true },
        },
      },
    });

    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 创建用户
app.post("/api/users", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 检查邮箱是否已存在
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "邮箱已被使用",
      });
    }

    const user = await prisma.user.create({
      data: { name, email, password }, // 实际项目中应该加密密码
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "用户创建成功",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 文章相关路由
 */

// 获取文章列表（分页 + 搜索）
app.get("/api/posts", async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      published: true,
      ...(search && {
        OR: [
          { title: { contains: search } },
          { content: { contains: search } },
        ],
      }),
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true },
          },
          tags: true,
        },
        orderBy: { createdAt: "desc" },
        skip: parseInt(skip),
        take: parseInt(limit),
      }),
      prisma.post.count({ where }),
    ]);

    res.json({
      success: true,
      data: posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取单篇文章（并增加浏览量）
app.get("/api/posts/:id", async (req, res) => {
  try {
    const postId = parseInt(req.params.id);

    const post = await prisma.post.update({
      where: { id: postId },
      data: { viewCount: { increment: 1 } },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        tags: true,
      },
    });

    res.json({ success: true, data: post });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "文章不存在",
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// 创建文章
app.post("/api/posts", async (req, res) => {
  try {
    const { title, content, authorId, tags = [] } = req.body;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        author: { connect: { id: authorId } },
        tags: {
          connectOrCreate: tags.map((tagName) => ({
            where: { name: tagName },
            create: { name: tagName },
          })),
        },
      },
      include: {
        author: true,
        tags: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "文章创建成功",
      data: post,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 服务器已启动在 http://localhost:${PORT}`);
  console.log("📚 可用接口：");
  console.log("  GET    /api/users");
  console.log("  POST   /api/users");
  console.log("  GET    /api/posts");
  console.log("  GET    /api/posts/:id");
  console.log("  POST   /api/posts");
});

// 优雅关闭
process.on("SIGINT", async () => {
  console.log("\n正在关闭服务器...");
  await prisma.$disconnect();
  process.exit(0);
});
```

---

## 第六章：环境变量与配置管理

在实际开发中，我们的代码会在不同环境（开发、测试、生产）运行，每个环境可能需要不同的配置。环境变量就是为了解决这个问题。

### 6.1 使用 dotenv

```bash
npm install dotenv
```

创建 `.env` 文件：

```env
PORT=3000
NODE_ENV=development
API_KEY=your-secret-key
DATABASE_URL=postgresql://localhost:5432/mydb
```

在代码中使用：

```javascript
// app.js
require("dotenv").config();

const port = process.env.PORT || 3000;
const apiKey = process.env.API_KEY;

console.log(`服务器运行在端口 ${port}`);
console.log(`API Key: ${apiKey}`);
```

**注意事项：**

- 务必将 `.env` 添加到 `.gitignore`
- 可以创建 `.env.example` 作为模板提交到 Git
- 生产环境建议使用平台提供的环境变量管理

---

## 第七章：调用第三方 API

Node.js 常用于构建"中间层"，即在前端和其他服务之间做转发和聚合。

### 7.1 使用 fetch API

Node.js v18+ 内置了 `fetch`：

```javascript
// fetch-demo.js

async function getGitHubUser(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return {
      name: data.name,
      bio: data.bio,
      followers: data.followers,
      repos: data.public_repos,
    };
  } catch (error) {
    console.error("请求失败：", error.message);
    return null;
  }
}

// POST 请求示例
async function createData(payload) {
  const response = await fetch("https://api.example.com/data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
    body: JSON.stringify(payload),
  });

  return await response.json();
}

// 测试
getGitHubUser("torvalds").then(console.log);
```

### 7.2 使用 axios（可选）

如果需要更多功能（拦截器、超时等），可以使用 axios：

```bash
npm install axios
```

```javascript
const axios = require("axios");

// 创建实例
const api = axios.create({
  baseURL: "https://api.example.com",
  timeout: 5000,
  headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
});

// 使用
async function fetchData() {
  const { data } = await api.get("/endpoint");
  return data;
}
```

---

## 第八章：异步编程深入理解

### 8.1 从回调到 Promise 到 async/await

Node.js 的异步特性是其核心优势，理解异步编程至关重要。

```javascript
// ❌ 回调地狱
fs.readFile("file1.txt", (err, data1) => {
  if (err) return console.error(err);
  fs.readFile("file2.txt", (err, data2) => {
    if (err) return console.error(err);
    fs.readFile("file3.txt", (err, data3) => {
      if (err) return console.error(err);
      console.log("读取完成");
    });
  });
});

// ✅ Promise 链式调用
const fs = require("fs").promises;

fs.readFile("file1.txt")
  .then(() => fs.readFile("file2.txt"))
  .then(() => fs.readFile("file3.txt"))
  .then(() => console.log("读取完成"))
  .catch((err) => console.error(err));

// ✅ async/await（最推荐）
async function readFiles() {
  try {
    await fs.readFile("file1.txt");
    await fs.readFile("file2.txt");
    await fs.readFile("file3.txt");
    console.log("读取完成");
  } catch (err) {
    console.error(err);
  }
}
```

### 8.2 并发控制

```javascript
// 并行执行（同时发起）
async function parallel() {
  const [result1, result2, result3] = await Promise.all([
    asyncTask1(),
    asyncTask2(),
    asyncTask3(),
  ]);
  console.log("所有任务完成");
}

// 串行执行（依次执行）
async function serial() {
  const result1 = await asyncTask1();
  const result2 = await asyncTask2();
  const result3 = await asyncTask3();
  console.log("所有任务完成");
}

// 限制并发数量
async function limitedConcurrency(tasks, limit) {
  const results = [];
  const executing = [];

  for (const task of tasks) {
    const p = task().then((result) => {
      executing.splice(executing.indexOf(p), 1);
      return result;
    });

    results.push(p);
    executing.push(p);

    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}
```

### 8.3 事件循环理解

Node.js 的事件循环分为多个阶段：

```javascript
// 执行顺序演示
console.log("1. 同步代码");

setTimeout(() => console.log("2. setTimeout"), 0);

setImmediate(() => console.log("3. setImmediate"));

Promise.resolve().then(() => console.log("4. Promise"));

process.nextTick(() => console.log("5. nextTick"));

console.log("6. 同步代码");

// 输出顺序：1 → 6 → 5 → 4 → 3 → 2
// nextTick > Promise (microtask) > setImmediate > setTimeout
```

---

## 第九章：进程与子进程

### 9.1 process 对象

```javascript
// 获取命令行参数
// 运行：node app.js --port 3000
const args = process.argv.slice(2);
console.log("参数：", args); // ['--port', '3000']

// 环境变量
console.log("NODE_ENV:", process.env.NODE_ENV);

// 当前工作目录
console.log("当前目录：", process.cwd());

// 进程 ID
console.log("进程 ID：", process.pid);

// 内存使用
console.log("内存使用：", process.memoryUsage());

// 退出进程
process.exit(0); // 0 表示正常退出，非 0 表示异常
```

### 9.2 执行系统命令

```javascript
const { exec, spawn } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

// 方式 1：exec（适合简单命令）
async function runCommand() {
  try {
    const { stdout, stderr } = await execPromise("ls -la");
    console.log("输出：", stdout);
  } catch (error) {
    console.error("错误：", error);
  }
}

// 方式 2：spawn（适合长时间运行或需要流式输出）
function runLongCommand() {
  const child = spawn("npm", ["install"]);

  child.stdout.on("data", (data) => {
    console.log(`输出：${data}`);
  });

  child.stderr.on("data", (data) => {
    console.error(`错误：${data}`);
  });

  child.on("close", (code) => {
    console.log(`进程退出，代码 ${code}`);
  });
}
```

---

## 第十章：实用工具与最佳实践

### 10.1 常用 npm 包推荐

**Web 开发：**

- `express` / `koa` - Web 框架
- `dotenv` - 环境变量管理
- `cors` - 跨域处理
- `helmet` - 安全头设置

**数据库：**

- `prisma` - 现代 ORM
- `mongoose` - MongoDB ORM

**工具库：**

- `lodash` - 实用函数集
- `dayjs` - 日期处理
- `axios` - HTTP 客户端

**开发工具：**

- `nodemon` - 自动重启
- `eslint` - 代码检查
- `prettier` - 代码格式化

### 10.2 项目结构建议

```
my-node-app/
├── src/
│   ├── routes/        # 路由
│   ├── controllers/   # 控制器
│   ├── services/      # 业务逻辑
│   ├── middlewares/   # 中间件
│   ├── utils/         # 工具函数
│   └── app.js         # 入口文件
├── tests/             # 测试文件
├── .env               # 环境变量
├── .gitignore
├── package.json
└── README.md
```

### 10.3 错误处理最佳实践

```javascript
// 1. 使用 try-catch 处理 async 函数
async function safeOperation() {
  try {
    const result = await riskyOperation();
    return result;
  } catch (error) {
    console.error("操作失败：", error.message);
    // 可以记录日志、发送告警等
    throw error; // 或者返回默认值
  }
}

// 2. Express 统一错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "服务器错误",
  });
});

// 3. 捕获未处理的异常
process.on("uncaughtException", (error) => {
  console.error("未捕获的异常：", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("未处理的 Promise 拒绝：", reason);
});
```

### 10.4 性能优化建议

```javascript
// 1. 使用流处理大文件
const fs = require("fs");

// ❌ 不推荐：一次性读取
const data = fs.readFileSync("large-file.txt");

// ✅ 推荐：使用流
const readStream = fs.createReadStream("large-file.txt");
readStream.on("data", (chunk) => {
  // 逐块处理
});

// 2. 避免阻塞事件循环
// ❌ 不推荐：大量同步计算
for (let i = 0; i < 1000000000; i++) {
  // 会阻塞其他请求
}

// ✅ 推荐：拆分任务或使用 Worker Threads

// 3. 使用缓存
const cache = new Map();

async function getData(key) {
  if (cache.has(key)) {
    return cache.get(key);
  }

  const data = await fetchFromDatabase(key);
  cache.set(key, data);
  return data;
}
```

### 10.5 部署准备

**使用 PM2 管理进程：**

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start app.js --name "my-app"

# 查看状态
pm2 list

# 查看日志
pm2 logs

# 重启
pm2 restart my-app
```

**环境变量配置：**

- 开发环境：使用 `.env` 文件
- 生产环境：使用平台提供的环境变量功能（如 Vercel、Railway、Heroku）

---

## 总结

通过本指南，你已经系统地学习了：

1. ✅ Node.js 运行时的本质
2. ✅ 核心模块：`fs`、`path`、`http`、`os`
3. ✅ 使用 Express/Koa 构建 Web 服务
4. ✅ 数据库操作（Prisma ORM）
5. ✅ 异步编程与事件循环
6. ✅ 调用第三方 API
7. ✅ 进程管理与子进程
8. ✅ 最佳实践与部署

### 下一步学习方向

1. **TypeScript**：为 Node.js 项目添加类型安全
2. **测试**：学习 Jest 或 Mocha 进行单元测试
3. **微服务**：学习如何拆分和管理大型应用
4. **WebSocket**：实现实时通信功能
5. **GraphQL**：学习新一代 API 查询语言
6. **Serverless**：了解无服务器架构

### 推荐资源

- 📖 [Node.js 官方文档](https://nodejs.org/docs/)
- 📖 [Express 官方指南](https://expressjs.com/)
- 📖 [Prisma 文档](https://www.prisma.io/docs/)
- 🎓 [freeCodeCamp Node.js 教程](https://www.freecodecamp.org/)

---

**开始你的 Node.js 开发之旅吧！** 🚀
