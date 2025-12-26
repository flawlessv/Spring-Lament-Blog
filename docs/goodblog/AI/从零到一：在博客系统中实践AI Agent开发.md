# 手把手教你构建 AI Agent智能博客应用

目前 AI Agent 开发越来越火，我接下来用一个 AI 智能内容系统来实践和学习相关技术。这个项目实现了 RAG 问答、AI Tab 补全、全文润色、内容生成等功能，让我对 AI 应用开发有了更深入的理解。

在开始之前，先简单介绍两个核心概念。**Prompt** 就是如何与 LLM 对话的"指令"，它决定了 AI 能理解你的意图并给出合适的回复。一个好的 Prompt 应该清晰、具体、包含足够的上下文信息。比如"写一篇文章"这样的 Prompt 太模糊，而"写一篇关于 React Hooks 的技术文章，包含 useState、useEffect 的使用示例，面向初学者"就清晰多了。

**RAG（Retrieval Augmented Generation）** 则是检索增强生成，通过向量检索从知识库中找到相关内容，然后让 LLM 基于这些内容生成回答，这样 AI 就能回答超出训练数据范围的问题了。传统 LLM 只能基于训练数据回答，但训练数据有截止时间，而且不包含你的私有数据。RAG 通过"检索 + 生成"的方式，让 LLM 能够访问外部知识库，回答更准确、更相关的问题。

技术选型上，我选择了完全免费的方案：**Kimi（Moonshot AI）** 作为 LLM，**Ollama** 本地运行 embedding 模型，**Chroma** 作为向量数据库。Kimi 有免费额度，中文能力强，而且兼容 OpenAI SDK，集成起来很方便。Ollama 可以在本地运行 embedding 模型，保护隐私，完全免费。Chroma 是开源的向量数据库，轻量级，支持持久化，HNSW 索引性能也不错。这样既能学习技术，又不会有额外的成本。

## Prompt 封装实践

刚开始开发时，我把所有 Prompt 都硬编码在代码里，结果发现维护起来特别麻烦。比如要调整一个 Prompt 的措辞，得在多个地方修改，还容易遗漏。而且硬编码的 Prompt 很难复用，每次要用都得复制粘贴，代码重复度很高。

后来我决定统一封装，为了方便后续跟 LLM 对话，把所有 Prompt 模板都集中管理。这样有几个好处：一是修改方便，只需要在一个地方改；二是可以复用，不同的功能可以调用同一个 Prompt 函数；三是便于测试，可以单独测试每个 Prompt 的效果；四是代码清晰，一眼就能看出有哪些 Prompt。

我按功能模块拆分成了三个文件：`prompts/rag.ts` 处理 RAG 相关的 Prompt，`prompts/write.ts` 处理内容生成（标题、摘要、标签等），`prompts/completion.ts` 处理 AI 补全。每个文件里都是函数，传入参数就能生成对应的 Prompt。

比如生成标题的 Prompt：

```typescript
export function buildTitlePrompt(
  content: string,
  options: { count?: number; style?: string } = {}
): string {
  const count = options.count || 3;
  const style = options.style || "专业";

  return `根据以下文章内容,生成${count}个SEO友好且吸引人的标题:

内容:
${content.slice(0, 2000)}

要求:
- 长度控制在10-20字
- 包含核心关键词
- 风格: ${style}

请直接返回JSON数组格式,例如: ["标题1", "标题2", "标题3"]，不要包含其他内容。`;
}
```

这个函数接收文章内容和选项参数，返回格式化好的 Prompt。`content.slice(0, 2000)` 限制内容长度，避免 Prompt 过长。返回格式明确要求 JSON 数组，这样前端解析起来很方便。

标签推荐的 Prompt 更复杂一些，需要区分已存在的标签和新建的标签：

```typescript
export function buildTagsPrompt(
  content: string,
  existingTags: string[]
): string {
  const tagList =
    existingTags.length > 0 ? existingTags.join("、") : "(暂无标签)";

  return `根据以下文章内容，推荐相关标签。

文章内容:
${content.slice(0, 2000)}

当前数据库中已存在的标签列表:
${tagList}

请你完成以下任务:
1. 从【已存在的标签】中选择 2-3 个最相关的标签
2. 额外推荐 2-3 个【新标签】(不在已存在列表中的)

返回格式要求:
请严格返回以下JSON格式，不要包含其他内容:
{
  "existing": ["已存在的标签1", "已存在的标签2"],
  "new": ["新标签1", "新标签2"]
}

注意:
- existing 中的标签必须完全匹配已存在列表中的名称
- new 中的标签必须是全新的，不能与已存在列表重复
- 标签名称简洁(2-6字)`;
}
```

这个 Prompt 明确告诉 AI 要做什么：从已有标签中选择，同时推荐新标签。返回格式也明确要求 JSON，包含 `existing` 和 `new` 两个字段。这样前端可以直接解析，区分哪些是已有的，哪些是新建的。

RAG 的 Prompt 也需要封装：

```typescript
export function buildRAGPrompt(context: string, question: string): string {
  return `基于以下知识库内容回答问题。如果知识库中没有相关信息,请说明无法回答。

知识库内容:
${context}

问题: ${question}

请提供准确、详细的回答,并在回答中引用相关来源。`;
}
```

这个 Prompt 结构清晰，先说明任务，然后提供知识库内容，最后是问题。要求 AI 在回答中引用来源，这样用户可以追溯答案的来源。

封装后，代码清晰多了，修改 Prompt 也只需要在一个地方改。而且可以很容易地添加新的 Prompt 函数，扩展功能。

## RAG 实现

RAG 的核心思路很简单：**检索 + 生成**。LLM 的知识有局限性，训练数据截止到某个时间点，而且可能不包含你的私有数据。RAG 通过向量检索从知识库中找到相关内容，然后把这些内容作为上下文传给 LLM，让 LLM 基于这些内容生成回答。

### RAG 的工作原理

RAG 的工作流程可以分为两个阶段：**索引阶段**和**查询阶段**。

**索引阶段**：

1. 将文章内容分块（chunking）
2. 对每个块进行向量化（embedding）
3. 将向量和元数据存储到向量数据库

**查询阶段**：

1. 将用户问题向量化
2. 在向量数据库中搜索相似的内容块
3. 将检索到的内容作为上下文
4. 调用 LLM 生成回答

### 嵌入（Embedding）原理

**嵌入（Embedding）** 就是把文本转换成数值向量的过程。计算机无法直接理解文本，需要把文本转换成数值才能计算。通过 embedding 模型，语义相似的文本会被转换成距离较近的向量，这样就能通过计算向量距离来判断文本的相似度了。

比如"如何实现虚拟列表？"和"虚拟列表的实现方法"这两个问题，虽然措辞不同，但语义相似，它们的向量在向量空间中应该距离很近。而"如何实现虚拟列表？"和"今天天气怎么样？"这两个问题语义完全不同，它们的向量距离应该很远。

向量相似度通常用余弦相似度或欧氏距离来计算。余弦相似度关注向量的方向，范围是 -1 到 1，1 表示完全相同，0 表示无关，-1 表示完全相反。欧氏距离关注向量的绝对距离，距离越小越相似。

### 一个完整的例子

举个例子，用户问"如何实现虚拟列表？"，系统会：

1. **问题向量化**：把"如何实现虚拟列表？"转换成向量，比如 `[0.1, 0.3, -0.2, ...]`（768 维向量）

2. **向量相似度搜索**：在 Chroma 数据库中搜索与这个向量最相似的 5 个内容块。假设找到了：
   - "虚拟列表是一种优化长列表渲染的技术，通过只渲染可视区域内的元素来提升性能..."（相似度 0.89）
   - "实现虚拟列表需要计算每个元素的位置，使用 transform 来定位..."（相似度 0.85）
   - "虚拟列表的核心是动态计算可见区域，只渲染这部分内容..."（相似度 0.82）

3. **构建上下文**：把这些内容块组合成上下文：

   ```
   [虚拟列表实现原理]
   虚拟列表是一种优化长列表渲染的技术，通过只渲染可视区域内的元素来提升性能...

   ---

   [虚拟列表实现细节]
   实现虚拟列表需要计算每个元素的位置，使用 transform 来定位...

   ---

   [虚拟列表核心概念]
   虚拟列表的核心是动态计算可见区域，只渲染这部分内容...
   ```

4. **调用 LLM**：把上下文和问题一起传给 Kimi：

   ```
   基于以下知识库内容回答问题。

   知识库内容:
   [上面的上下文]

   问题: 如何实现虚拟列表？

   请提供准确、详细的回答。
   ```

5. **生成回答**：Kimi 基于这些上下文生成回答，回答中会引用相关的文章。

### 技术实现细节

#### 文章索引

文章索引时先把文章分块。为什么要分块？因为文章可能很长，直接向量化会导致信息丢失，而且向量数据库对单个文档的大小有限制。分块可以让每个块包含相对完整的信息，同时控制块的大小。

分块策略很重要。我采用的是按段落分块，如果段落太长就按句子分块。每个块不超过 800 字符，因为 Ollama 的 embedding 模型对长文本不稳定。分块时还保留了 30 个字符的重叠，这样可以避免在块边界处丢失信息。

```typescript
export function chunkPost(
  content: string,
  options: {
    maxTokens?: number;
    overlap?: number;
    maxChars?: number;
  } = {}
): Chunk[] {
  const maxTokens = options.maxTokens || 300;
  const overlap = options.overlap || 30;
  const maxChars = options.maxChars || 800;
  const chunks: Chunk[] = [];

  // 按段落分割
  const paragraphs = content.split(/\n\n+/).filter((p) => p.trim());

  let currentChunk = "";
  let chunkIndex = 0;

  for (const para of paragraphs) {
    const paraTokens = estimateTokens(para);

    if (paraTokens > maxTokens) {
      // 段落过长,先保存当前块
      if (currentChunk.trim()) {
        chunks.push({
          content: currentChunk.trim(),
          index: chunkIndex++,
        });
        currentChunk = "";
      }

      // 按句子分割长段落
      const sentences = para.split(/[。！？\n]/).filter((s) => s.trim());
      let sentenceChunk = "";

      for (const sentence of sentences) {
        const chunkTokens = estimateTokens(sentenceChunk + sentence);

        if (chunkTokens > maxTokens && sentenceChunk) {
          chunks.push({
            content: sentenceChunk.trim(),
            index: chunkIndex++,
          });
          // 保留重叠部分
          const overlapText = sentenceChunk.slice(-overlap);
          sentenceChunk = overlapText + sentence;
        } else {
          sentenceChunk += sentence;
        }
      }

      if (sentenceChunk.trim()) {
        chunks.push({
          content: sentenceChunk.trim(),
          index: chunkIndex++,
        });
      }
    } else {
      const chunkTokens = estimateTokens(currentChunk + para);

      if (chunkTokens > maxTokens && currentChunk) {
        chunks.push({
          content: currentChunk.trim(),
          index: chunkIndex++,
        });
        // 保留重叠部分
        const overlapText = currentChunk.slice(-overlap);
        currentChunk = overlapText + para;
      } else {
        currentChunk += (currentChunk ? "\n\n" : "") + para;
      }
    }
  }

  // 保存最后一个块
  if (currentChunk.trim()) {
    chunks.push({
      content: currentChunk.trim(),
      index: chunkIndex,
    });
  }

  // 确保每个块不超过 maxChars 字符（Ollama 限制）
  const finalChunks: Chunk[] = [];
  for (const chunk of chunks) {
    if (chunk.content.length <= maxChars) {
      finalChunks.push({ ...chunk, index: finalChunks.length });
    } else {
      // 按 maxChars 拆分过长的块
      let start = 0;
      while (start < chunk.content.length) {
        const end = Math.min(start + maxChars, chunk.content.length);
        finalChunks.push({
          content: chunk.content.slice(start, end),
          index: finalChunks.length,
        });
        start = end - overlap; // 保留一些重叠
        if (start >= chunk.content.length - overlap) break;
      }
    }
  }

  return finalChunks;
}
```

分块后，对每个块进行向量化。我用的是 Ollama 的 `nomic-embed-text` 模型，它生成 768 维的向量。向量化时需要注意，每个块都要单独调用 embedding API，不能批量处理，因为 Ollama 对批量处理支持不好。

```typescript
// 生成向量 - 逐个处理，添加延迟避免 Ollama 过载
const aiClient = getAIClient();
const embeddings: number[][] = [];

for (let i = 0; i < chunks.length; i++) {
  const [embedding] = await aiClient.embed(chunks[i].content);
  embeddings.push(embedding);

  // 每处理5个块后等待100ms，让 Ollama 有时间恢复
  if ((i + 1) % 5 === 0) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}
```

向量化后，把向量和元数据存储到 Chroma 数据库。每个向量都有一个唯一的 ID，通常是 `postId_chunkIndex` 的格式。元数据包含文章 ID、块索引、标题、分类、标签等信息，方便后续过滤和展示。

```typescript
const vectors = chunks.map((chunk, i) => ({
  id: `${postId}_${chunk.index}`,
  embedding: embeddings[i],
  metadata: {
    postId: post.id,
    chunkIndex: chunk.index,
    title: post.title,
    slug: post.slug,
    category: post.category?.name || "",
    tags: post.tags.map((pt) => pt.tag.name).join(","),
  },
  document: chunk.content,
}));

const vectorStore = getVectorStore();
await vectorStore.upsert(vectors);
```

#### 查询流程

查询时，先把问题向量化，然后在 Chroma 中做相似度搜索，找到 Top 5 的相关片段，构建上下文后传给 Kimi 生成回答：

```typescript
export async function ragQuery(
  question: string,
  options: RAGOptions = {}
): Promise<RAGResponse> {
  const aiClient = getAIClient();

  // 检查 Ollama 是否可用
  const ollamaAvailable = await isOllamaAvailable();

  // 如果 Ollama 不可用，使用降级模式（纯 LLM）
  if (!ollamaAvailable) {
    return fallbackQuery(question, options);
  }

  try {
    const vectorStore = getVectorStore();

    // 1. 将问题向量化
    const [queryVector] = await aiClient.embed(question);

    // 2. 构建过滤条件（可选）
    const filters: Record<string, unknown> = {};
    if (options.filters?.categoryId) {
      filters.categoryId = options.filters.categoryId;
    }

    // 3. 向量相似度搜索
    const searchResults = await vectorStore.search(queryVector, {
      limit: options.limit || 5,
      filters: Object.keys(filters).length > 0 ? filters : undefined,
    });

    // 如果没有搜索结果，使用降级模式
    if (searchResults.length === 0) {
      return fallbackQuery(question, options);
    }

    // 4. 获取文章详细信息
    const postIds = [
      ...new Set(searchResults.map((r) => r.metadata.postId as string)),
    ];
    const posts = await prisma.post.findMany({
      where: { id: { in: postIds } },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
      },
    });

    const postMap = new Map(posts.map((p) => [p.id, p]));

    // 5. 构建上下文
    const context = searchResults
      .map((result) => {
        const post = postMap.get(result.metadata.postId as string);
        if (!post) return null;
        return `[${post.title}]\n${result.document}`;
      })
      .filter(Boolean)
      .join("\n\n---\n\n");

    // 6. 构建 Prompt
    const prompt = buildRAGPrompt(context, question);

    // 7. 调用 LLM
    const response = await aiClient.chat(
      [
        {
          role: "system",
          content: RAG_SYSTEM_MESSAGE,
        },
        { role: "user", content: prompt },
      ],
      {
        maxTokens: options.maxTokens || 1000,
      }
    );

    // 8. 构建来源信息
    const sources = searchResults.map((result) => {
      const post = postMap.get(result.metadata.postId as string);
      return {
        postId: result.metadata.postId as string,
        title: post?.title || "未知",
        slug: post?.slug || "",
        excerpt: result.document?.slice(0, 200) || "",
        score: result.score,
      };
    });

    return {
      answer: response.content,
      sources,
      tokensUsed: response.tokensUsed,
      mode: "rag",
    };
  } catch (error) {
    console.error("RAG 查询失败，降级为纯 LLM 模式:", error);
    return fallbackQuery(question, options);
  }
}
```

这个函数实现了完整的 RAG 流程。首先检查 Ollama 是否可用，如果不可用就降级为纯 LLM 模式。然后向量化问题，在向量数据库中搜索，构建上下文，调用 LLM 生成回答，最后返回回答和来源信息。

### 降级机制

RAG 系统依赖 Ollama 和 Chroma 两个服务，如果这些服务不可用，系统会降级为纯 LLM 模式。降级模式使用最近的文章作为上下文，虽然效果不如 RAG，但至少能保证功能可用。

```typescript
async function fallbackQuery(
  question: string,
  options: RAGOptions = {}
): Promise<RAGResponse> {
  const aiClient = getAIClient();

  // 从数据库获取一些最新的文章作为上下文
  const recentPosts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
    },
  });

  // 构建简单的上下文
  const context = recentPosts
    .map(
      (post) => `[${post.title}]\n${post.excerpt || post.content.slice(0, 500)}`
    )
    .join("\n\n---\n\n");

  const prompt = buildRAGFallbackPrompt(context, question);

  const response = await aiClient.chat(
    [
      {
        role: "system",
        content: RAG_FALLBACK_SYSTEM_MESSAGE,
      },
      { role: "user", content: prompt },
    ],
    {
      maxTokens: options.maxTokens || 1000,
    }
  );

  // 构建来源（使用最近的文章）
  const sources = recentPosts.slice(0, 3).map((post) => ({
    postId: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || post.content.slice(0, 200),
    score: 0,
  }));

  return {
    answer: response.content,
    sources,
    tokensUsed: response.tokensUsed,
    mode: "fallback",
  };
}
```

### 遇到的坑

遇到的坑主要是 Ollama embedding 对长文本不稳定，超过 1500 字符就容易报 EOF 错误。我通过限制文本长度（800 字符）和添加重试机制解决了这个问题。具体来说，在分块时严格控制每个块的大小，在调用 embedding API 时也做了截断保护，还添加了重试机制，失败后等待 1 秒再重试，最多重试 3 次。

## AI Tab 补全实现

实现类似 Copilot 的内联补全功能时，我参考了 GitHub Copilot Vim 和 Novel 编辑器的思路。GitHub Copilot Vim 使用虚拟文本（virt_text）显示建议，不修改实际文件；Novel 使用 Tiptap 的 Decoration 机制。核心思路都是**文本拼接策略**，确保后续代码可见，不会遮挡。

### 参考思路

GitHub Copilot Vim 的实现思路很有意思。它使用虚拟文本（Ghost Text）来显示建议，虚拟文本不会修改实际文件内容，只是视觉上的覆盖显示。在 Neovim 中使用 `nvim_buf_set_extmark` 的 `virt_text` 功能，在 Vim 中使用 `textprop` 功能。

关键的设计是文本拼接策略。假设代码是 `console.log(13)`，光标在 `1` 和 `2` 之间，建议是 `2)`。GitHub Copilot 会计算从光标到建议结束位置之间的文本（`23`），然后显示 `"2" + ")"`，这样用户看到的是 `console.log(12))`，其中 `2))` 是建议（灰色显示），最后的 `)` 是原有代码，仍然可见。

Novel 编辑器使用 Tiptap 的 Decoration 机制来实现类似的效果。Decoration 是 ProseMirror 提供的装饰系统，可以在文档上添加视觉元素而不修改文档结构。Novel 使用 `Decoration.inline` 或 `Decoration.widget` 来显示补全建议。

### 技术选型

我选择了 Tiptap/ProseMirror 插件机制来实现。Tiptap 是基于 ProseMirror 的 React 富文本编辑器框架，提供了扩展系统，可以创建自定义扩展来处理 AI 补全。

### 实现细节

#### 插件结构

创建一个 Tiptap 扩展，使用 ProseMirror 插件来管理补全状态：

```typescript
export const AICompletion = Extension.create<AICompletionOptions>({
  name: "aiCompletion",

  addOptions() {
    return {
      debounceMs: 500,
      minChars: 3,
      apiEndpoint: "/api/ai/write/complete",
    };
  },

  addProseMirrorPlugins() {
    const extension = this;
    let debounceTimer: NodeJS.Timeout | null = null;

    return [
      new Plugin<PluginState>({
        key: pluginKey,
        state: {
          init(): PluginState {
            return { suggestion: null, position: null };
          },
          apply(tr, value, oldState, newState) {
            // 状态更新逻辑
          },
        },
        props: {
          decorations(state) {
            // 装饰渲染逻辑
          },
        },
      }),
    ];
  },

  addKeyboardShortcuts() {
    return {
      Tab: ({ editor }) => {
        // Tab 键接受逻辑
      },
      Escape: ({ editor }) => {
        // Esc 键取消逻辑
      },
    };
  },
});
```

#### 状态管理

使用 ProseMirror 的插件状态来管理补全建议。状态包含 `suggestion`（建议文本）和 `position`（光标位置）。状态更新通过事务元数据（transaction metadata）来实现：

```typescript
state: {
  init(): PluginState {
    return { suggestion: null, position: null };
  },
  apply(tr, value, oldState, newState) {
    // 如果事务标记为清除补全，清除建议
    if (tr.getMeta("ai-completion-clear")) {
      return { suggestion: null, position: null };
    }

    // 如果正在接受补全，清除建议
    if (tr.getMeta("ai-completion-accept")) {
      return { suggestion: null, position: null };
    }

    // 如果事务包含补全更新，更新状态
    const update = tr.getMeta("ai-completion-update");
    if (update) {
      return {
        suggestion: update.suggestion,
        position: update.position,
      };
    }

    // 检查是否有文本变化
    const isTextChange = tr.docChanged && !tr.getMeta("ai-completion") && !tr.getMeta("ai-completion-accept");

    if (!isTextChange) {
      // 如果没有文本变化，保持现有状态
      // 但如果光标位置改变了，需要清除补全
      const { selection } = newState;
      if (value.position !== null && selection.from !== value.position) {
        return { suggestion: null, position: null };
      }
      return value;
    }

    // 文本变化，触发补全请求
    // ... 防抖和 API 调用逻辑
  },
}
```

#### 防抖机制

防抖机制很重要，避免用户快速输入时频繁请求 API。我设置了 500ms 的防抖延迟：

```typescript
// 清除之前的定时器
if (debounceTimer) {
  clearTimeout(debounceTimer);
}

// 获取当前选择位置
const { selection } = newState;
const { from, to } = selection;

// 如果选择了文本，不显示补全
if (from !== to) {
  return { suggestion: null, position: null };
}

// 检查是否在代码块中
const $from = newState.selection.$from;
const codeBlock = $from.node(-1)?.type.name === "codeBlock";
if (codeBlock) {
  return { suggestion: null, position: null };
}

// 获取光标前的文本
const textBeforeCursor = newState.doc.textBetween(
  Math.max(0, from - 500),
  from
);

// 如果文本太短，不显示补全
if (textBeforeCursor.trim().length < (extension.options.minChars || 3)) {
  return { suggestion: null, position: null };
}

// 防抖：延迟调用 API
const currentFrom = from;
debounceTimer = setTimeout(async () => {
  // API 调用逻辑
}, extension.options.debounceMs);
```

#### 异步竞态处理

异步竞态处理也很重要，因为 API 请求是异步的，用户可能在请求返回前继续输入。所以需要在 API 返回后校验光标位置，只有位置一致时才更新建议：

```typescript
debounceTimer = setTimeout(async () => {
  try {
    // 获取当前编辑器状态（可能在防抖期间已改变）
    const currentState = extension.editor.state;
    const currentSelection = currentState.selection;

    // 如果光标位置已改变，不更新
    if (currentSelection.from !== currentFrom) {
      return;
    }

    // 获取完整内容
    const fullText = currentState.doc.textContent;

    // 调用 API 获取补全建议
    const response = await fetch(
      extension.options.apiEndpoint || "/api/ai/write/complete",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: fullText,
          cursorPosition: currentFrom,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("补全请求失败");
    }

    const data = await response.json();
    const suggestionText = data.suggestions?.[0]?.text;

    if (suggestionText && suggestionText.length > 0) {
      // 再次检查光标位置
      const latestState = extension.editor.state;
      if (latestState.selection.from === currentFrom) {
        // 更新插件状态
        const tr = latestState.tr;
        const pluginState = pluginKey.getState(latestState);
        if (pluginState) {
          // 直接更新状态
          tr.setMeta("ai-completion-update", {
            suggestion: suggestionText,
            position: currentFrom,
          });
          extension.editor.view.dispatch(tr);
        }
      }
    }
  } catch (error) {
    console.error("AI 补全错误:", error);
  }
}, extension.options.debounceMs);
```

这里做了两次位置校验：一次在 API 调用前，一次在 API 返回后。只有两次校验都通过，才会更新补全建议。

#### 装饰渲染

使用 `Decoration.widget` 在光标位置显示灰色的补全建议：

```typescript
props: {
  decorations(state) {
    const pluginState = pluginKey.getState(state) as PluginState;
    if (!pluginState.suggestion || pluginState.position === null) {
      return DecorationSet.empty;
    }

    // 检查位置是否有效
    try {
      const resolved = state.doc.resolve(pluginState.position);
      if (!resolved) {
        return DecorationSet.empty;
      }
    } catch {
      return DecorationSet.empty;
    }

    // 检查当前位置是否与光标位置一致（装饰应该显示在光标位置）
    const { selection } = state;
    if (selection.from !== pluginState.position) {
      // 光标已移动，清除补全
      return DecorationSet.empty;
    }

    // 创建 widget 装饰来显示补全建议
    const widget = document.createElement("span");
    widget.className = "ai-completion-suggestion";
    widget.style.cssText = "color: #9ca3af; font-style: italic; pointer-events: none; user-select: none;";
    widget.textContent = pluginState.suggestion;
    widget.setAttribute("data-suggestion", pluginState.suggestion);

    const decoration = Decoration.widget(pluginState.position, widget, {
      side: 1, // 在光标后显示
      ignoreSelection: true,
    });

    return DecorationSet.create(state.doc, [decoration]);
  },
}
```

`Decoration.widget` 创建一个 DOM 元素，设置灰色斜体样式，`pointer-events: none` 确保不会影响用户输入，`user-select: none` 防止用户选中建议文本。

#### Tab 键接受逻辑

Tab 键接受逻辑通过 ProseMirror 的事务系统实现：

```typescript
Tab: ({ editor }) => {
  // 使用模块级别的 pluginKey
  const pluginState = pluginKey.getState(editor.state) as
    | PluginState
    | undefined;

  if (pluginState?.suggestion && pluginState.position !== null) {
    const { suggestion } = pluginState;
    const { state, view } = editor;

    // 创建事务
    const { tr } = state;

    // 获取当前光标位置
    const from = state.selection.from;

    // 插入文本（insertText 会自动处理光标位置）
    tr.insertText(suggestion);

    // 设置光标到插入文本的末尾
    const newPos = from + suggestion.length;
    tr.setSelection(TextSelection.create(tr.doc, newPos));

    // 标记为接受补全
    tr.setMeta("ai-completion-accept", true);

    // 应用事务
    view.dispatch(tr);

    return true;
  }

  return false;
};
```

这里使用 `tr.insertText()` 插入建议文本，然后设置光标位置到插入文本的末尾，最后标记为接受补全，这样状态更新时会清除建议。

#### Esc 键取消逻辑

Esc 键取消逻辑很简单，只需要清除补全建议：

```typescript
Escape: ({ editor }) => {
  const pluginState = pluginKey.getState(editor.state) as
    | PluginState
    | undefined;

  if (pluginState?.suggestion) {
    // 清除补全建议
    editor.view.dispatch(editor.state.tr.setMeta("ai-completion-clear", true));
    return true;
  }

  return false;
};
```

### 关键技术点

1. **模块级别的 pluginKey**：`pluginKey` 必须在模块级别创建，确保在 `addProseMirrorPlugins` 和 `addKeyboardShortcuts` 中都能访问到同一个实例。

2. **事务元数据**：使用事务元数据（`tr.setMeta`）来传递状态更新，这样可以在状态更新时知道是哪种操作（更新、接受、清除）。

3. **位置校验**：异步 API 调用时，必须在调用前后都校验光标位置，防止竞态条件。

4. **装饰渲染**：使用 `Decoration.widget` 创建 DOM 元素，设置合适的样式，确保不影响用户输入。

## 其他功能

除了 RAG 和 AI 补全，还实现了全文润色、内容生成、相关文章推荐等功能。

### 全文润色

全文润色使用流式输出，实时显示润色进度，用户体验更好。后端使用 Server-Sent Events (SSE) 推送流式数据，前端使用 EventSource API 接收数据，实时更新 UI。

```typescript
// 后端：流式输出
const stream = new ReadableStream({
  async start(controller) {
    const aiClient = getAIClient();
    const response = await aiClient.chatStream(
      [{ role: "user", content: prompt }],
      {
        onChunk: (chunk) => {
          controller.enqueue(`data: ${JSON.stringify({ chunk })}\n\n`);
        },
      }
    );
    controller.close();
  },
});

return new Response(stream, {
  headers: {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  },
});
```

```typescript
// 前端：接收流式数据
const eventSource = new EventSource("/api/ai/write/polish");
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.chunk) {
    setContent((prev) => prev + data.chunk);
  }
};
```

### 内容生成

内容生成基于之前封装的 Prompt 模板，可以生成标题、摘要、标签、分类等。每个功能都有对应的 Prompt 函数，传入参数就能生成对应的 Prompt，然后调用 LLM API 生成内容。

标签和分类推荐比较特殊，需要区分已存在的和新建的。Prompt 中明确要求返回 JSON 格式，包含 `existing` 和 `new` 两个字段，前端解析后可以分别处理。

### 相关文章推荐

相关文章推荐也是基于向量检索，使用当前文章的标题和摘要作为查询向量，找到语义相似的文章。如果 RAG 不可用，就降级为标签/分类匹配。

```typescript
export async function getRelatedPosts(slug: string): Promise<RelatedPost[]> {
  const post = await prisma.post.findUnique({
    where: { slug },
    select: { id: true, title: true, excerpt: true },
  });

  if (!post) return [];

  // 尝试使用 RAG 语义搜索
  try {
    const results = await semanticSearch(
      `${post.title} ${post.excerpt || ""}`,
      { limit: 3 }
    );

    if (results.length > 0) {
      return results
        .filter((r) => r.postId !== post.id)
        .slice(0, 3)
        .map((r) => ({
          id: r.postId,
          title: r.title,
          slug: r.slug,
          score: r.score,
        }));
    }
  } catch (error) {
    console.error("语义搜索失败，降级为标签匹配:", error);
  }

  // 降级：使用标签/分类匹配
  // ...
}
```

## 总结

这个项目让我对 AI 应用开发有了更深入的理解。技术选型上，我没有用 LangChain 或 Agent 框架，而是直接调用 LLM API，自己实现 RAG 逻辑。这样虽然代码量多一些，但更灵活，也更容易理解底层原理。

轻量级实现的优势是代码简洁、可控性强，每个功能都是独立的，便于维护和调试。通过这个项目，我不仅学会了 RAG、Embedding、Prompt 工程等技术，更重要的是理解了如何在实际项目中应用这些技术，解决真实的问题。

RAG 的实现让我理解了向量检索的原理，知道了如何分块、向量化、存储和查询。AI 补全的实现让我理解了编辑器插件的开发，知道了如何使用 ProseMirror 的状态管理和装饰系统。Prompt 封装让我理解了代码组织的重要性，知道了如何让代码更清晰、更易维护。

这个项目还有很多可以优化的地方，比如可以添加更多的 Prompt 模板，可以优化分块策略，可以改进补全的准确性，可以添加更多的降级机制。但作为一个学习项目，它已经让我对 AI 应用开发有了全面的认识，为后续更复杂的项目打下了基础。
