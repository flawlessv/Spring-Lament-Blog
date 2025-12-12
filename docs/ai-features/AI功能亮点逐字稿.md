# AI 博客系统功能亮点逐字稿

---

## 1. 智能语义分块系统

**评委问：你是怎么处理超过 800 字符限制的文本块的？**

我在实现 RAG 系统时遇到了一个关键问题：Ollama 的 embedding 模型对单次输入有 800 字符的硬限制。如果文章块超过这个限制，简单的截断会导致语义信息丢失。

我的解决思路是：**多向量分块策略**。当某个语义块超过 800 字符时，我会将它按 800 字符硬切为多个子块，每个子块保留 50 字符的重叠，然后为每个子块独立生成 embedding 向量。

关键代码是这样的：

```typescript
// 超过 800 字符时，硬切分块
if (t.length > MAX_CHUNK_SIZE) {
  const chunks: string[] = [];
  const chunkOverlap = 50; // 保留重叠

  let start = 0;
  while (start < t.length) {
    const end = Math.min(start + MAX_CHUNK_SIZE, t.length);
    chunks.push(t.slice(start, end));
    start = end - chunkOverlap; // 下一个块从重叠位置开始
  }

  // 为每个子块生成独立的 embedding
  for (const chunk of chunks) {
    const embedding = await getEmbedding(chunk);
    embeddings.push(embedding); // 返回多个向量
  }
}
```

这样做的好处是：所有子块的语义信息都被完整保留，不会因为求平均而丢失。每个子块都可以独立检索，提高了匹配精度。我在存储时通过 `chunkIndex_subChunkIndex` 的 ID 格式来关联所有子块，这样检索时也能知道它们来自同一个原始语义块。

---

## 2. 语义感知分块策略

**评委问：你是怎么避免硬切破坏语义完整性的？**

这是我在分块阶段的核心优化。简单的按字符数硬切会破坏语义完整性，比如句子被截断、段落被分割，检索时匹配到不完整的语义片段。

我的解决思路是：**三级语义分块策略**。首先按段落分割（`\n\n+`），保留文章的段落结构；对于超长段落，再按句子边界分割（`。！？\n`），保留句子完整性；最后严格控制块大小，确保不超过 800 字符。

关键代码片段：

```typescript
// 第一级：按段落分割
const paragraphs = content.split(/\n\n+/).filter((p) => p.trim());

// 第二级：对于超长段落，按句子分割
const sentences = text.split(/([。！？\n]|\.\s+)/).filter((s) => s.trim());

// 第三级：严格控制大小，双重检查
if (chunkTokens > maxTokens || chunkChars > maxChars) {
  splitChunk(currentChunk); // 进一步分割
}
```

同时我还实现了**重叠策略**：默认 50 字符重叠，保存当前块时保留末尾的 overlap 字符，下一个块从 overlap 开始。这样可以提高边界信息的检索率，保持块之间的上下文连贯性。

这样做的效果是：保持了语义完整性，避免了句子和段落被截断，提高了检索准确性。

---

## 3. RAG 全文索引对话 + 流式输出

**评委问：你的 RAG 问答系统是怎么工作的？**

我的 RAG 系统工作流程是这样的：用户提问后，我先将问题向量化，然后在 ChromaDB 中进行向量相似度搜索，检索 Top K 个相关块（默认 5 个），将这些块组合成上下文，然后使用结构化 Prompt 调用 LLM 生成回答。

关键是我使用了**流式输出**（SSE），让用户实时看到生成过程，类似 ChatGPT 的体验。这样用户不需要等待完整回答，降低了等待焦虑。

在 Prompt 设计上，我采用了**结构化 Prompt 方法**：

```typescript
export function buildRAGPrompt(context: string, question: string): string {
  return `# Role: 知识库问答专家

## Rules
1. 必须严格基于提供的知识库内容回答问题
2. 如果知识库中没有相关信息，必须明确说明
3. 在回答中引用相关的知识来源

## Workflow
1. 仔细阅读并理解用户问题
2. 分析知识库内容，识别相关信息
3. 综合多个知识片段构建完整答案
...
`;
}
```

这样确保了回答质量和格式一致性。回答中会明确标注来源，比如"根据《文章标题》中的内容..."，让用户知道信息来源。

---

## 4. 智能文章推荐系统

**评委问：你是怎么实现文章推荐的？**

我实现了基于向量相似度的语义推荐。主要策略是：使用文章标题 + 摘要生成查询向量，在向量数据库中搜索相似文章，按相似度分数排序返回。

关键代码：

```typescript
// 生成查询向量
const [queryVector] = await aiClient.embed(`${post.title} ${post.excerpt}`);

// 向量相似度搜索
const searchResults = await vectorStore.search(queryVector, {
  limit: options.limit || 10,
});

// 按相似度排序
results.sort((a, b) => b.score - a.score);
```

我还实现了**降级策略**：当向量服务不可用时，自动降级为标签+分类匹配。计算共同标签数量作为相关度分数，确保功能可用性。

相比传统的标签匹配推荐，向量相似度推荐的优势是：能理解语义关联，不受关键词限制，能发现表面不相关但语义相近的文章。比如"React Hooks"和"函数式组件"在语义上相关，但关键词完全不同。

---

## 5. AI Tab 实时补全

TODO:这里说的太简单了 需要完善一下

**评委问：你的 AI 补全功能是怎么实现的？**

我实现了类似 GitHub Copilot 的内联补全功能。核心思路是：通过 ProseMirror 插件机制，在用户输入时提取光标前 500 字符作为上下文，调用 AI API 生成补全建议，然后以灰色斜体文本的形式内联显示在光标位置。

关键技术点：

1. **防抖机制**：500ms 延迟，避免频繁 API 调用
2. **位置校验**：API 返回后校验光标位置，防止异步竞态
3. **装饰渲染**：使用 `Decoration.widget` 实现不影响文档结构的视觉提示

关键代码：

```typescript
// 防抖延迟
debounceTimer = setTimeout(async () => {
  // 记录当前光标位置
  const currentFrom = from;

  // API 调用...
  const suggestion = await fetchCompletion(context);

  // 再次检查光标位置（防止异步竞态）
  if (latestState.selection.from === currentFrom) {
    // 更新插件状态，显示补全建议
    tr.setMeta("ai-completion-update", {
      suggestion: suggestionText,
      position: currentFrom,
    });
  }
}, 500);
```

用户可以通过 `Tab` 键接受补全，`Esc` 键取消。这样提供了无缝的写作体验，不打断写作流程。

---

## 6. 多风格全文润色

**评委问：你的润色功能支持哪些特性？**

我实现了双模式润色：选中润色和全文润色。选中润色是用户选中文本后弹出浮动工具栏，快速润色部分内容；全文润色是通过 AI 助手面板进行全文优化。

关键特性：

1. **自定义润色要求**：用户可以输入个性化的润色要求，比如"更正式一些"、"增加技术细节"等
2. **多种写作风格**：支持专业、技术、创意等多种风格
3. **无缝替换**：润色完成后直接替换原文，无需手动复制粘贴

在 Prompt 设计上，我使用了结构化 Prompt：

```typescript
export function buildPolishPrompt(content: string, customRequirement?: string) {
  return `# Role: 内容润色与优化专家

## Rules
1. 修正语法错误
2. 优化句子结构
3. 保持原意不变
${customRequirement ? `4. 额外要求: ${customRequirement}` : ""}

## Workflow
1. 仔细阅读原文，理解核心观点
2. 全面检查语法、拼写、标点错误
3. 优化句子结构，提升可读性
...
`;
}
```

这样确保了润色质量，同时支持灵活的自定义要求。

---

## 7. 结构化 Prompt 工程体系

**评委问：你是怎么管理这么多 Prompt 的？**

我构建了一套完整的结构化 Prompt 工程体系。所有 Prompt 都采用统一的结构化模板，包含 Role、Profile、Skills、Goals、Rules、Workflow、OutputFormat 等模块。

关键思路：

1. **模块化封装**：每个功能独立的 Prompt 函数，统一的参数接口
2. **版本管理**：统一的版本号（2.0），便于迭代和回滚
3. **思维链构建**：通过 Workflow 构建清晰的思维链，确保 AI 按照预期流程工作

所有 Prompt 都遵循这个模板：

```typescript
export function buildRAGPrompt(context: string, question: string): string {
  return `# Role: 知识库问答专家

## Profile
- Author: SpringLament Blog System
- Version: 2.0
- Language: 中文

## Skills
- 深度理解知识库内容
- 精准匹配用户问题
...

## Rules
1. 必须严格基于知识库内容回答
2. 明确标注来源
...

## Workflow
1. 仔细阅读用户问题
2. 分析知识库内容
...
`;
}
```

这样做的好处是：确保生成内容的质量和一致性，易于维护和扩展，遵循 Prompt 工程最佳实践。当需要优化某个功能时，我只需要调整对应的 Rules 或 Workflow，非常方便。
