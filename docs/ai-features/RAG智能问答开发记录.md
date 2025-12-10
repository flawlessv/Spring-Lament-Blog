# RAG 智能问答功能开发记录

## 功能概述

基于博客文章内容的 RAG（Retrieval Augmented Generation）智能问答系统，用户通过自然语言提问，系统从博客文章中检索相关内容并生成准确回答。

## 技术架构

```
用户提问
    ↓
Ollama (nomic-embed-text) 生成问题向量
    ↓
Chroma 向量数据库相似度搜索
    ↓
检索相关文章片段（Top 5）
    ↓
Kimi (moonshot-v1-32k) 基于上下文生成回答
    ↓
返回答案 + 参考来源
```

### 技术选型理由

| 组件       | 技术选择                  | 选择理由                                  |
| ---------- | ------------------------- | ----------------------------------------- |
| LLM        | Kimi (Moonshot AI)        | 免费额度充足，中文能力强，兼容 OpenAI SDK |
| Embedding  | Ollama + nomic-embed-text | 本地运行保护隐私，768 维向量，完全免费    |
| 向量数据库 | Chroma                    | 开源轻量，支持持久化，HNSW 索引性能优秀   |

---

## 核心技术难点与解决方案

### 难点一：Ollama Embedding 服务的隐性限制

#### 问题现象

索引文章时持续报错：

```
Ollama embedding 失败: Internal Server Error -
{"error":"do embedding request: Post \"http://127.0.0.1:xxxxx/embedding\": EOF"}
```

错误信息中的端口号（61777, 61823...）每次都不同，这是 Ollama 内部 runner 进程的动态端口。

#### 排查思路

**第一步：验证服务可用性**

直接调用 Ollama API 确认服务本身正常：

```bash
curl http://localhost:11434/api/tags  # ✅ 正常返回模型列表
curl http://localhost:11434/api/embeddings -d '{"model":"nomic-embed-text","prompt":"test"}'  # ✅ 正常
```

**第二步：隔离运行环境**

怀疑是 Next.js 服务端 fetch 的问题，创建独立测试端点：

```typescript
// /api/test-ollama - 直接在 Next.js 环境调用 Ollama
const response = await fetch("http://localhost:11434/api/embeddings", {
  method: "POST",
  body: JSON.stringify({ model: "nomic-embed-text", prompt: "短文本" }),
});
// ✅ 测试通过，排除 Next.js 环境问题
```

**第三步：变量控制法定位**

既然短文本正常，尝试逐步增加文本长度：

```bash
# 500 字符 → 成功
# 1000 字符 → 成功
# 1500 字符 → 成功
# 2000 字符 → EOF 错误！
```

**根因定位**：`nomic-embed-text` 模型对超长文本处理存在 bug，当输入超过约 1500 字符时，Ollama 内部的 runner 子进程会异常终止（EOF = End Of File，表示连接意外断开）。

#### 解决方案：多层防护策略

```typescript
// 1. 分块层：严格控制每个文本块的大小
export function chunkPost(content: string, options = {}) {
  const maxChars = options.maxChars || 800; // 硬性字符限制
  const maxTokens = options.maxTokens || 300; // Token 估算限制

  // 双重保障：先按语义分块，再按字符数二次切分
  const chunks = semanticChunk(content, maxTokens);
  return chunks.flatMap((chunk) =>
    chunk.length > maxChars ? splitByChars(chunk, maxChars) : [chunk]
  );
}

// 2. 调用层：截断保护 + 重试机制
async function ollamaEmbed(text: string): Promise<number[]> {
  const safeText = text.slice(0, 800); // 最后一道防线

  let retries = 3;
  while (retries > 0) {
    try {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 30000); // 30s 超时

      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error(await res.text());
      return (await res.json()).embedding;
    } catch (e) {
      if (--retries === 0) throw e;
      await sleep(1000); // 失败后等待重试
    }
  }
}
```

#### 技术洞察

这个问题的排查过程体现了几个重要原则：

1. **分层验证**：从底层服务 → 运行环境 → 业务逻辑，逐层排除
2. **变量控制**：保持其他条件不变，只改变一个变量（文本长度）
3. **防御性编程**：即使找到根因，也要在多个层面添加保护

---

### 难点二：服务可用性的优雅降级

#### 问题背景

RAG 系统依赖两个外部服务：Ollama（本地）和 Chroma（本地）。在实际使用中，这些服务可能因为各种原因不可用：

- 用户忘记启动服务
- 服务意外崩溃
- 资源不足导致服务无响应

如果直接报错，用户体验很差。

#### 解决方案：智能降级机制

```typescript
export async function ragQuery(question: string): Promise<RAGResponse> {
  // 1. 快速检测 Ollama 可用性（2秒超时）
  const ollamaAvailable = await isOllamaAvailable();

  if (!ollamaAvailable) {
    console.warn("Ollama 不可用，降级为纯 LLM 模式");
    return fallbackQuery(question);
  }

  try {
    // 2. 正常 RAG 流程
    const queryVector = await embed(question);
    const relevantChunks = await vectorStore.search(queryVector, { limit: 5 });

    if (relevantChunks.length === 0) {
      // 3. 向量库为空时也降级
      return fallbackQuery(question);
    }

    return generateAnswer(question, relevantChunks);
  } catch (error) {
    // 4. 任何异常都降级，保证服务可用
    console.error("RAG 查询失败，降级处理:", error);
    return fallbackQuery(question);
  }
}

// 降级方案：使用最新文章作为上下文
async function fallbackQuery(question: string): Promise<RAGResponse> {
  const recentPosts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  const context = recentPosts
    .map((p) => `[${p.title}]\n${p.excerpt}`)
    .join("\n\n");

  const answer = await llm.chat([
    {
      role: "system",
      content: "基于以下博客内容回答问题，如无相关内容可用通用知识回答",
    },
    { role: "user", content: `${context}\n\n问题：${question}` },
  ]);

  return {
    answer: answer.content,
    sources: recentPosts,
    mode: "fallback", // 标记降级模式，前端可展示提示
  };
}
```

#### 前端配合

```tsx
// 降级模式时显示提示
{
  message.mode === "fallback" && (
    <p className="text-amber-500 text-xs">
      ⚠️ 基础模式（向量检索不可用，回答可能不够精准）
    </p>
  );
}
```

#### 设计理念

**"宁可降级，不可宕机"** —— 对于非核心功能，可用性优先于完整性。用户能得到一个"还行"的回答，比看到一个错误页面好得多。

---

### 难点三：长文本分块策略

#### 问题背景

博客文章长度从几百字到上万字不等，如何合理分块直接影响检索质量：

- 块太大：超出 embedding 模型限制，且检索不精准
- 块太小：丢失上下文，语义不完整
- 简单按字数切：可能切断句子、段落，破坏语义

#### 解决方案：语义感知 + 硬限制的混合策略

```typescript
export function chunkPost(content: string): Chunk[] {
  const MAX_CHARS = 800; // 硬性限制（Ollama 安全阈值）
  const TARGET_TOKENS = 300; // 目标 token 数
  const OVERLAP = 50; // 重叠字符数，保证上下文连贯

  // 第一步：按段落分割，保持语义完整
  const paragraphs = content.split(/\n\n+/).filter((p) => p.trim());

  const chunks: Chunk[] = [];
  let currentChunk = "";

  for (const para of paragraphs) {
    const estimatedTokens = estimateTokens(currentChunk + para);

    if (estimatedTokens > TARGET_TOKENS && currentChunk) {
      // 当前块已满，保存并开始新块
      chunks.push({ content: currentChunk.trim(), index: chunks.length });

      // 保留上一块的结尾作为重叠，维持上下文
      currentChunk = currentChunk.slice(-OVERLAP) + para;
    } else {
      currentChunk += (currentChunk ? "\n\n" : "") + para;
    }
  }

  // 第二步：对超长块进行二次切分
  return chunks.flatMap((chunk) => {
    if (chunk.content.length <= MAX_CHARS) return [chunk];

    // 按句子边界切分，避免切断句子
    return splitAtSentenceBoundary(chunk.content, MAX_CHARS, OVERLAP);
  });
}

// Token 估算：中文按字符，英文按单词
function estimateTokens(text: string): number {
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = text
    .split(/\s+/)
    .filter((w) => /[a-zA-Z]/.test(w)).length;
  return Math.ceil(chineseChars * 1.5 + englishWords * 1.3);
}
```

#### 效果对比

| 策略                | 一篇 10000 字文章 | 检索准确率       |
| ------------------- | ----------------- | ---------------- |
| 固定 1000 字切分    | 10 块             | 一般，常切断语义 |
| 按段落 + Token 限制 | 15-20 块          | 较好，语义完整   |
| 段落 + Token + 重叠 | 18-25 块          | 最佳，上下文连贯 |

---

## 架构设计亮点

### 1. 零成本方案

通过技术选型实现完全免费的 RAG 系统：

- **Embedding**：Ollama 本地运行，无 API 费用
- **向量存储**：Chroma 开源免费，本地文件持久化
- **LLM**：Kimi 免费额度足够个人博客使用

### 2. 隐私优先

敏感的文章内容向量化过程完全在本地完成，只有生成回答时才调用云端 LLM，且上下文经过筛选，最大程度保护隐私。

### 3. 前端集成

索引管理直接集成在问答界面，无需单独的管理页面：

- 一键构建/重建索引
- 实时显示进度和结果
- 失败时展示详细原因，方便排查

---

## 性能数据

| 指标              | 数值   |
| ----------------- | ------ |
| 17 篇文章索引时间 | ~45 秒 |
| 单次问答响应时间  | 2-4 秒 |
| 向量维度          | 768 维 |
| 检索 Top-K        | 5      |

---

## 后续优化方向

1. **混合检索**：结合 BM25 关键词搜索和向量语义搜索
2. **流式输出**：实现打字机效果，提升用户体验
3. **缓存层**：对相似问题的回答进行缓存
4. **模型升级**：评估 `mxbai-embed-large` 等更强的 embedding 模型

---

## 总结

本次 RAG 开发的核心收获：

1. **系统性排查能力**：面对复杂问题，分层验证、变量控制是高效定位的关键
2. **防御性设计**：多层保护、优雅降级，让系统在异常情况下依然可用
3. **工程权衡**：在分块粒度、检索精度、性能之间找到平衡点
4. **零成本可行**：开源工具链足以构建生产可用的 RAG 系统
