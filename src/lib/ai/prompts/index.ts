/**
 * Prompt 模板统一导出
 */

// RAG 相关
export {
  RAG_SYSTEM_MESSAGE,
  RAG_FALLBACK_SYSTEM_MESSAGE,
  buildRAGPrompt,
  buildRAGFallbackPrompt,
} from "./rag";

// 内容生成相关
export {
  buildTitlePrompt,
  buildExcerptPrompt,
  buildTagsPrompt,
  buildCategoryPrompt,
  buildOutlinePrompt,
  buildExpandPrompt,
  buildPolishPrompt,
} from "./write";

// AI 补全相关
export { COMPLETION_SYSTEM_MESSAGE, buildCompletionPrompt } from "./completion";
