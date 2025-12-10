export interface Chunk {
  content: string;
  index: number;
  metadata?: Record<string, unknown>;
}

/**
 * 估算文本的 token 数量(粗略估算)
 */
function estimateTokens(text: string): number {
  // 中文按字符数,英文按单词数估算
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = text
    .split(/\s+/)
    .filter((w) => /[a-zA-Z]/.test(w)).length;
  // 1个中文字符 ≈ 1.5 tokens, 1个英文单词 ≈ 1.3 tokens
  return Math.ceil(chineseChars * 1.5 + englishWords * 1.3);
}

/**
 * 将文章内容分块
 *
 * 分块策略（按优先级）：
 * 1. 按段落分割（\n\n+）
 * 2. 按句子分割（。！？\n）
 * 3. 严格控制块大小，避免硬切破坏语义
 *
 * 注意：Ollama nomic-embed-text 对单次输入限制在 800 字符
 * 本函数会严格控制块大小，确保每个块不超过 maxChars，避免后续硬切
 */
export function chunkPost(
  content: string,
  options: {
    maxTokens?: number;
    overlap?: number;
    maxChars?: number; // 最大字符数限制（硬限制，必须遵守）
  } = {}
): Chunk[] {
  const maxTokens = options.maxTokens || 300;
  const overlap = options.overlap || 50; // 增加重叠，提高上下文连贯性
  const maxChars = options.maxChars || 800; // Ollama 硬限制
  const chunks: Chunk[] = [];

  // 按段落分割（保留段落结构）
  const paragraphs = content.split(/\n\n+/).filter((p) => p.trim());

  let currentChunk = "";
  let chunkIndex = 0;

  /**
   * 检查并保存当前块（如果超过限制）
   */
  const flushChunk = () => {
    if (currentChunk.trim()) {
      // 双重检查：既检查 token 数，也检查字符数
      const chunkTokens = estimateTokens(currentChunk);
      const chunkChars = currentChunk.length;

      if (chunkTokens > maxTokens || chunkChars > maxChars) {
        // 当前块已经超限，需要进一步分割
        splitChunk(currentChunk);
        currentChunk = "";
      } else {
        chunks.push({
          content: currentChunk.trim(),
          index: chunkIndex++,
        });
        currentChunk = "";
      }
    }
  };

  /**
   * 分割过长的块（按句子分割，保持语义完整性）
   */
  const splitChunk = (text: string) => {
    // 按句子分割（中文：。！？；英文：. ! ?）
    const sentences = text.split(/([。！？\n]|\.\s+)/).filter((s) => s.trim());
    let sentenceChunk = "";

    for (const sentence of sentences) {
      const testChunk = sentenceChunk + sentence;
      const testTokens = estimateTokens(testChunk);
      const testChars = testChunk.length;

      // 如果加上当前句子后超过限制，保存当前块
      if ((testTokens > maxTokens || testChars > maxChars) && sentenceChunk) {
        chunks.push({
          content: sentenceChunk.trim(),
          index: chunkIndex++,
        });

        // 保留重叠部分（从当前块末尾取 overlap 字符）
        const overlapText = sentenceChunk.slice(
          -Math.min(overlap, sentenceChunk.length)
        );
        sentenceChunk = overlapText + sentence;
      } else {
        sentenceChunk += sentence;
      }
    }

    // 保存最后一个句子块
    if (sentenceChunk.trim()) {
      const finalTokens = estimateTokens(sentenceChunk);
      const finalChars = sentenceChunk.length;

      // 如果最后一个块仍然超限，按字符硬切（这是最后手段）
      if (finalTokens > maxTokens || finalChars > maxChars) {
        hardSplitChunk(sentenceChunk);
      } else {
        chunks.push({
          content: sentenceChunk.trim(),
          index: chunkIndex++,
        });
      }
    }
  };

  /**
   * 硬切分块（最后手段，仅在无法按语义分割时使用）
   * 会保留重叠，尽量减少语义损失
   */
  const hardSplitChunk = (text: string) => {
    let start = 0;
    while (start < text.length) {
      const end = Math.min(start + maxChars, text.length);
      const chunk = text.slice(start, end);

      chunks.push({
        content: chunk.trim(),
        index: chunkIndex++,
      });

      // 保留重叠，避免完全割裂
      start = end - Math.min(overlap, end - start);
      if (start >= text.length - overlap) {
        // 处理最后一部分
        if (start < text.length) {
          chunks.push({
            content: text.slice(start).trim(),
            index: chunkIndex++,
          });
        }
        break;
      }
    }
  };

  // 主循环：按段落处理
  for (const para of paragraphs) {
    const paraTokens = estimateTokens(para);
    const paraChars = para.length;

    // 如果单个段落就超过限制，需要分割
    if (paraTokens > maxTokens || paraChars > maxChars) {
      // 先保存当前块
      flushChunk();

      // 分割长段落
      splitChunk(para);
    } else {
      // 尝试将段落加入当前块
      const testChunk = currentChunk ? currentChunk + "\n\n" + para : para;
      const testTokens = estimateTokens(testChunk);
      const testChars = testChunk.length;

      if ((testTokens > maxTokens || testChars > maxChars) && currentChunk) {
        // 超过限制，保存当前块
        flushChunk();
        // 保留重叠后加入新段落
        const overlapText = currentChunk.slice(
          -Math.min(overlap, currentChunk.length)
        );
        currentChunk = overlapText + "\n\n" + para;
      } else {
        // 可以加入当前块
        currentChunk = testChunk;
      }
    }
  }

  // 保存最后一个块
  flushChunk();

  // 最终验证：确保所有块都不超过限制
  const finalChunks: Chunk[] = [];
  for (const chunk of chunks) {
    if (
      chunk.content.length <= maxChars &&
      estimateTokens(chunk.content) <= maxTokens * 1.2
    ) {
      // 允许 token 估算有 20% 的误差
      finalChunks.push({ ...chunk, index: finalChunks.length });
    } else {
      // 如果还有超限的块（理论上不应该发生），硬切
      console.warn(
        `[Chunker] 发现超限块（${chunk.content.length} 字符），进行硬切`
      );
      hardSplitChunk(chunk.content);
    }
  }

  return finalChunks;
}
