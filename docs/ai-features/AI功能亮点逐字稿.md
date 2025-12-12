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

我实现了基于向量相似度的语义推荐系统，核心思路是：用当前文章的标题和摘要生成查询向量，在向量数据库中搜索语义相似的文章，然后过滤掉当前文章，按相似度排序返回。

### 核心设计思路

**1. 查询向量生成策略**

我选择使用**标题 + 摘要（前500字符）**来生成查询向量，而不是全文。这样做的原因：

- **效率更高**：摘要已经包含了文章的核心信息，不需要处理全文
- **语义更聚焦**：标题和摘要通常最能代表文章主题
- **成本更低**：向量化更短的文本，API 调用更快

```typescript
// 使用文章标题 + 摘要生成查询向量（比全文更高效）
const queryText = `${currentPost.title}\n${currentPost.content.slice(0, 500)}`;
const [queryVector] = await aiClient.embed(queryText);
```

**2. 当前文章过滤机制**

这是推荐系统的关键点。向量搜索可能会返回当前文章本身（因为相似度最高），所以必须过滤掉。

我的实现方式：

- 在搜索时多取一些结果（`limit * 3`），因为要排除当前文章和去重
- 使用 `Set` 数据结构记录已处理的文章 ID，包括当前文章 ID
- 遍历搜索结果时，跳过当前文章和已处理过的文章

```typescript
// 获取相关文章的详细信息（排除当前文章，去重）
const seenPostIds = new Set<string>([currentPost.id]);
const relatedPostIds: string[] = [];

for (const result of searchResults) {
  const postId = result.metadata.postId as string;
  if (!seenPostIds.has(postId)) {
    seenPostIds.add(postId);
    relatedPostIds.push(postId);
    if (relatedPostIds.length >= limit) break;
  }
}
```

**3. 去重处理**

向量搜索可能返回同一篇文章的多个块（因为一篇文章被切分成多个块），需要去重。我的做法是：

- 使用 `Set` 记录已处理的文章 ID
- 只保留每个文章的第一个匹配结果（相似度最高的）
- 通过 `postId` 去重，而不是通过块 ID

**4. 相似度分数保留**

为了保持推荐质量，我保留了向量搜索的相似度分数：

- 在搜索时记录每个文章的相似度分数
- 使用 `Map` 存储 `postId -> score` 的映射
- 返回结果时带上分数，前端可以显示推荐强度

```typescript
// 按相似度排序
const scoreMap = new Map<string, number>();
for (const result of searchResults) {
  const postId = result.metadata.postId as string;
  if (!scoreMap.has(postId)) {
    scoreMap.set(postId, result.score);
  }
}
```

**5. 降级策略**

当向量服务不可用时（比如 Ollama 未启动），我实现了降级策略：

- 优先使用分类匹配：同分类的文章优先推荐
- 其次使用标签匹配：有共同标签的文章作为补充
- 计算相关度分数：共同标签数量 _ 0.3 + 同分类 _ 0.5
- 如果没有分类和标签，返回最新文章

```typescript
// 降级推荐：基于分类和标签
const where: any = {
  id: { notIn: Array.from(excludeSet) },
  published: true,
  OR: [] as any[],
};

if (currentPost.categoryId) {
  where.OR.push({ categoryId: currentPost.categoryId });
}

if (tagIds.length > 0) {
  where.OR.push({
    tags: {
      some: {
        tagId: { in: tagIds },
      },
    },
  });
}
```

### 技术优势

相比传统的标签匹配推荐，向量相似度推荐的优势：

1. **语义理解**：能理解语义关联，不受关键词限制
2. **发现隐藏关联**：能发现表面不相关但语义相近的文章
3. **更精准**：基于内容相似度，而不是简单的标签匹配
4. **降级保证**：向量服务不可用时自动降级，保证功能可用性

### 性能优化

1. **多取少用**：搜索时取 `limit * 3` 个结果，过滤后只返回 `limit` 个
2. **数据库查询优化**：只查询需要的字段，减少数据传输
3. **Map 数据结构**：使用 Map 存储文章映射和分数，O(1) 查找
4. **提前终止**：找到足够的文章后立即终止循环

这个推荐系统既保证了推荐质量（语义相似度），又保证了可用性（降级策略），还优化了性能（高效查询和去重）。

---

## 5. AI Tab 实时补全

**评委问：你的 AI 补全功能是怎么实现的？**

我实现了类似 GitHub Copilot 的内联补全功能。这个功能的核心挑战在于：如何在用户快速输入时，实时生成补全建议，同时避免频繁的 API 调用和异步竞态问题。

### 核心设计思路

**1. 状态驱动的插件架构**

我基于 ProseMirror 的 Plugin 机制实现。ProseMirror 的插件系统提供了 `apply` 方法来监听文档状态变化，`decorations` 方法来渲染视觉装饰。这种设计让我可以：

- 在用户输入时自动触发补全逻辑
- 使用装饰（Decoration）显示补全建议，而不影响文档结构
- 通过插件状态管理补全信息，确保 UI 与数据同步

**2. 防抖机制优化**

用户快速输入时，如果每次输入都调用 API，会导致：

- 大量无效请求（前面的请求会被后面的输入覆盖）
- 服务器压力大
- 补全建议频繁闪烁，体验差

我的解决方案是：**500ms 防抖延迟**。每次新输入时，清除之前的定时器，只保留最后一次输入的定时器。这样用户停止输入 500ms 后才会触发 API 调用。

```typescript
// 每次新输入时清除旧定时器
if (debounceTimer) {
  clearTimeout(debounceTimer);
  debounceTimer = null;
}

// 设置新定时器，延迟 500ms
debounceTimer = setTimeout(async () => {
  // API 调用逻辑
}, 500);
```

**3. 双重位置校验防止异步竞态**

这是最关键的优化点。AI API 调用是异步的，用户可能在 API 返回前继续输入或移动光标。如果直接显示补全建议，可能会显示在错误的位置。

我的解决方案是**双重位置校验**：

- **第一次校验**：防抖回调执行时，检查光标位置是否仍然一致
- **第二次校验**：API 返回后，再次检查光标位置

只有两次校验都通过，才会显示补全建议。

```typescript
// 第一次校验：防抖回调执行时
const currentState = extension.editor.state;
const currentFrom = currentState.selection.from;

// 如果位置已改变，直接返回
if (currentFrom !== from) {
  return;
}

// 调用 API
const suggestion = await fetchCompletion(context);

// 第二次校验：API 返回后
const latestState = extension.editor.state;
if (latestState.selection.from === currentFrom) {
  // 位置仍然一致，更新状态显示补全
  tr.setMeta("ai-completion-update", {
    suggestion: suggestionText,
    position: currentFrom,
  });
}
```

**4. 非侵入式渲染**

补全建议使用 `Decoration.widget` 实现，这是一个视觉提示，不拦截用户操作。关键特性：

- 不影响文档结构（不会插入到文档中）
- 不拦截鼠标事件（`pointer-events: none`）
- 灰色斜体样式，清晰区分建议和实际内容

```typescript
decorations(state) {
  const pluginState = pluginKey.getState(state);

  if (!pluginState.suggestion) {
    return DecorationSet.empty;
  }

  // 创建装饰元素
  const widget = document.createElement("span");
  widget.style.cssText = "color: #9ca3af; font-style: italic; pointer-events: none;";
  widget.textContent = pluginState.suggestion;

  return DecorationSet.create(state.doc, [
    Decoration.widget(pluginState.position, widget, { side: 1 })
  ]);
}
```

**5. 边界条件处理**

我还实现了多个边界检查，确保补全只在合适的时机触发：

- **文本选择检查**：用户选择文本时，可能想要替换或删除，不需要补全
- **代码块检查**：代码块的补全应该由专门的代码编辑器处理
- **文本长度检查**：文本太短时，上下文不足，补全质量差

### 用户交互

用户可以通过 `Tab` 键接受补全，`Esc` 键取消。接受补全时，会插入补全文本并清除补全状态；取消时，只清除补全状态，不影响文档内容。

### 技术优势

这个实现方案的优势在于：

1. **无缝体验**：补全建议直接显示在光标位置，不打断写作流程
2. **性能优化**：防抖机制减少 API 调用，双重校验避免无效更新
3. **可靠性高**：多重边界检查和处理，确保功能稳定
4. **可扩展性强**：基于 ProseMirror 插件机制，易于扩展和维护

整个功能从用户输入到补全建议显示，形成了一个完整的闭环，既保证了用户体验，又确保了系统的稳定性和性能。

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
