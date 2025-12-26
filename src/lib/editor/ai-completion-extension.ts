/**
 * AI 补全扩展模块
 *
 * 功能：实现类似 GitHub Copilot 的实时内联补全功能
 * - 用户输入时，自动提取上下文并调用 AI API 生成补全建议
 * - 补全建议以灰色斜体文本的形式内联显示在光标位置
 * - 用户可以通过 Tab 键接受补全，Esc 键取消
 *
 * 技术实现：
 * - 使用 ProseMirror Plugin 机制管理补全状态
 * - 使用 Decoration 在光标位置显示补全建议（不影响文档结构）
 * - 通过防抖机制避免频繁 API 调用
 * - 通过位置校验防止异步竞态条件
 */

import { Extension } from "@tiptap/core";
import { Plugin, PluginKey, TextSelection } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

/**
 * AI 补全扩展的配置选项
 */
interface AICompletionOptions {
  /** 防抖延迟时间（毫秒），默认 500ms */
  debounceMs?: number;
  /** 触发补全的最小字符数，默认 3 */
  minChars?: number;
  /** AI 补全 API 端点，默认 "/api/ai/write/complete" */
  apiEndpoint?: string;
}

/**
 * 插件状态：存储当前的补全建议和位置
 */
interface PluginState {
  /** 补全建议文本，null 表示没有建议 */
  suggestion: string | null;
  /** 补全建议显示的位置（文档中的字符偏移量），null 表示没有建议 */
  position: number | null;
}

/**
 * 插件键（PluginKey）
 *
 * 作用：用于在插件状态、键盘快捷键和装饰渲染之间共享数据
 * 为什么在模块级别创建：确保所有地方都能访问同一个 pluginKey 实例
 */
const pluginKey = new PluginKey<PluginState>("aiCompletion");

/**
 * AI 补全扩展
 *
 * 这是一个 Tiptap Extension，为编辑器添加 AI 自动补全功能。
 *
 * 工作流程：
 * 1. 用户输入文本 → 触发 apply 方法
 * 2. 防抖延迟（500ms）→ 避免频繁 API 调用
 * 3. 提取上下文（光标前 500 字符）→ 发送给 AI API
 * 4. AI 返回补全建议 → 更新插件状态
 * 5. decorations 方法渲染补全建议 → 显示在光标位置
 * 6. 用户按 Tab → 接受补全，按 Esc → 取消补全
 *
 * @example
 * ```typescript
 * // 在编辑器中使用
 * extensions={[
 *   AICompletion.configure({
 *     debounceMs: 500,
 *     minChars: 3,
 *     apiEndpoint: "/api/ai/write/complete",
 *   }),
 * ]}
 * ```
 */
export const AICompletion = Extension.create<AICompletionOptions>({
  name: "aiCompletion",

  /**
   * 默认配置选项
   */
  addOptions() {
    return {
      debounceMs: 500, // 500ms 防抖，平衡响应速度和 API 调用频率
      minChars: 3, // 至少 3 个字符才触发补全
      apiEndpoint: "/api/ai/write/complete", // AI 补全 API 端点
    };
  },

  /**
   * 添加 ProseMirror 插件
   *
   * 这个插件负责：
   * 1. 管理补全状态（suggestion 和 position）
   * 2. 监听文本变化，触发 AI 补全请求
   * 3. 渲染补全建议（通过 decorations）
   */
  addProseMirrorPlugins() {
    // 保存 Extension 实例的引用（用于在闭包中访问）
    // 注意：在 apply 方法中，this 不是 Extension 实例，而是 StateField
    // 所以需要在闭包中保存 Extension 引用
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const extension = this;

    // 防抖定时器：用于延迟 API 调用，避免用户快速输入时频繁请求
    let debounceTimer: NodeJS.Timeout | null = null;

    return [
      new Plugin<PluginState>({
        key: pluginKey,
        state: {
          /**
           * 初始化插件状态
           * 返回初始状态：没有补全建议
           */
          init(): PluginState {
            return { suggestion: null, position: null };
          },

          /**
           * 状态更新函数（apply）
           *
           * 这个函数在每次编辑器状态变化时被调用，负责：
           * 1. 处理补全相关的元数据（清除、接受、更新）
           * 2. 检测文本变化，触发 AI 补全请求
           * 3. 处理各种边界情况（选择文本、代码块、光标移动等）
           *
           * @param tr - ProseMirror 事务对象，包含状态变化信息
           * @param value - 当前插件状态
           * @param oldState - 旧的状态
           * @param newState - 新的状态
           * @returns 更新后的插件状态
           */
          apply(tr, value, oldState, newState) {
            // ========== 阶段 1：处理补全相关的元数据（优先级最高）==========

            // 情况 1：用户按 Esc 键，清除补全建议
            if (tr.getMeta("ai-completion-clear")) {
              return { suggestion: null, position: null };
            }

            // 情况 2：用户按 Tab 键接受补全，清除建议
            if (tr.getMeta("ai-completion-accept")) {
              return { suggestion: null, position: null };
            }

            // 情况 3：AI API 返回补全建议，更新状态
            const update = tr.getMeta("ai-completion-update");
            if (update) {
              return {
                suggestion: update.suggestion,
                position: update.position,
              };
            }

            // ========== 阶段 2：检测文本变化，决定是否触发补全请求 ==========

            // 判断是否有实际的文本变化（排除补全相关的元数据变化）
            const isTextChange =
              tr.docChanged &&
              !tr.getMeta("ai-completion") &&
              !tr.getMeta("ai-completion-accept");

            // 如果没有文本变化，检查光标位置是否改变
            if (!isTextChange) {
              const { selection } = newState;
              // 如果光标位置改变了，清除补全（因为补全建议是针对之前位置的）
              if (
                value.position !== null &&
                selection.from !== value.position
              ) {
                return { suggestion: null, position: null };
              }
              // 否则保持现有状态（没有变化，不需要更新）
              return value;
            }

            // ========== 阶段 3：有文本变化，准备触发补全请求 ==========

            // 步骤 1：清除之前的防抖定时器（用户继续输入时，取消之前的请求）
            if (debounceTimer) {
              clearTimeout(debounceTimer);
              debounceTimer = null;
            }

            // 步骤 2：获取当前选择位置
            const { selection } = newState;
            const { from, to } = selection;

            // 边界检查 1：如果用户选择了文本，不显示补全
            // 原因：选择文本时，用户可能想要替换或删除，不需要补全
            if (from !== to) {
              return { suggestion: null, position: null };
            }

            // 边界检查 2：如果光标在代码块中，不显示补全
            // 原因：代码块的补全应该由代码编辑器处理，不是文本补全
            const $from = newState.selection.$from;
            const codeBlock = $from.node(-1)?.type.name === "codeBlock";
            if (codeBlock) {
              return { suggestion: null, position: null };
            }

            // 边界检查 3：提取光标前的文本作为上下文
            // 限制在 500 字符以内，避免上下文过长导致 API 调用慢
            const CONTEXT_LENGTH = 500;
            const textBeforeCursor = newState.doc.textBetween(
              Math.max(0, from - CONTEXT_LENGTH),
              from
            );

            // 边界检查 4：如果文本太短，不触发补全（避免无意义的请求）
            const minChars = extension.options.minChars || 3;
            if (textBeforeCursor.trim().length < minChars) {
              return { suggestion: null, position: null };
            }

            // ========== 阶段 4：防抖延迟，触发 AI 补全请求 ==========

            // 记录当前光标位置（用于后续校验，防止异步竞态）
            const currentFrom = from;

            // 设置防抖定时器：延迟调用 API，避免用户快速输入时频繁请求
            debounceTimer = setTimeout(async () => {
              try {
                // ========== 步骤 1：再次获取编辑器状态（可能在防抖期间已改变）==========
                const currentState = extension.editor.state;
                const currentSelection = currentState.selection;

                // ========== 步骤 2：校验光标位置（防止异步竞态）==========
                // 如果光标位置已改变，说明用户继续输入了，不更新补全
                // 这是第一次校验，避免处理过期的补全请求
                if (currentSelection.from !== currentFrom) {
                  return;
                }

                // ========== 步骤 3：获取完整文档内容作为上下文 ==========
                const fullText = currentState.doc.textContent;

                // ========== 步骤 4：调用 AI API 获取补全建议 ==========
                const apiEndpoint =
                  extension.options.apiEndpoint || "/api/ai/write/complete";
                const response = await fetch(apiEndpoint, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    content: fullText,
                    cursorPosition: currentFrom,
                  }),
                });

                if (!response.ok) {
                  throw new Error("补全请求失败");
                }

                // ========== 步骤 5：解析 API 返回的补全建议 ==========
                const data = await response.json();
                const suggestionText = data.suggestions?.[0]?.text;

                // ========== 步骤 6：如果有补全建议，更新插件状态 ==========
                if (suggestionText && suggestionText.length > 0) {
                  // 再次校验光标位置（双重检查，确保位置一致）
                  // 这是第二次校验，确保在 API 返回后位置仍然一致
                  const latestState = extension.editor.state;
                  if (latestState.selection.from === currentFrom) {
                    // 创建事务，更新插件状态
                    const tr = latestState.tr;
                    const pluginState = pluginKey.getState(latestState);

                    // 确保插件状态存在
                    if (pluginState) {
                      // 通过事务元数据更新补全建议
                      // 这会在下一次 apply 调用时被处理（阶段 1 的情况 3）
                      tr.setMeta("ai-completion-update", {
                        suggestion: suggestionText,
                        position: currentFrom,
                      });
                      // 应用事务，触发状态更新
                      extension.editor.view.dispatch(tr);
                    }
                  }
                }
              } catch (error) {
                // 静默失败，不影响用户编辑
                // 补全功能是辅助功能，不应该影响正常的编辑体验
                console.error("AI 补全错误:", error);
              }
            }, extension.options.debounceMs);

            // 返回当前状态（补全建议会在 API 返回后通过元数据更新）
            return value;
          },
        },
        props: {
          /**
           * 装饰渲染函数（decorations）
           *
           * 作用：在光标位置渲染补全建议的视觉提示
           *
           * 实现方式：
           * - 使用 Decoration.widget 创建不影响文档结构的装饰
           * - 装饰以灰色斜体文本的形式显示在光标位置
           * - 不拦截鼠标事件，不影响用户编辑
           *
           * @param state - 当前编辑器状态
           * @returns DecorationSet - 装饰集合，如果没有补全建议则返回空集合
           */
          decorations(state) {
            // ========== 步骤 1：获取插件状态 ==========
            const pluginState = pluginKey.getState(state) as PluginState;

            // 如果没有补全建议，不显示装饰
            if (!pluginState.suggestion || pluginState.position === null) {
              return DecorationSet.empty;
            }

            // ========== 步骤 2：校验位置有效性 ==========
            // 校验 1：检查位置是否有效（防止位置超出文档范围）
            try {
              const resolved = state.doc.resolve(pluginState.position);
              if (!resolved) {
                return DecorationSet.empty;
              }
            } catch {
              // 位置无效（可能文档已变化），不显示装饰
              return DecorationSet.empty;
            }

            // 校验 2：检查当前位置是否与光标位置一致
            // 如果光标已移动，不显示补全（因为补全建议是针对之前位置的）
            const { selection } = state;
            if (selection.from !== pluginState.position) {
              return DecorationSet.empty;
            }

            // ========== 创建补全建议的视觉装饰 ==========

            // 创建一个 span 元素来显示补全建议
            const widget = document.createElement("span");
            widget.className = "ai-completion-suggestion";

            // 样式设置：
            // - 灰色文字（#9ca3af），不抢夺注意力
            // - 斜体，区分于正常文本
            // - pointer-events: none，不拦截鼠标事件
            // - user-select: none，不可选中
            widget.style.cssText =
              "color: #9ca3af; " +
              "font-style: italic; " +
              "pointer-events: none; " +
              "user-select: none;";

            widget.textContent = pluginState.suggestion;
            widget.setAttribute("data-suggestion", pluginState.suggestion);

            // 创建 widget 装饰
            // side: 1 表示在位置后显示（光标后）
            // ignoreSelection: true 确保装饰不影响文本选择
            const decoration = Decoration.widget(pluginState.position, widget, {
              side: 1, // 在光标后显示
              ignoreSelection: true, // 不影响选择
            });

            // 返回装饰集合
            return DecorationSet.create(state.doc, [decoration]);
          },
        },
      }),
    ];
  },

  /**
   * 添加键盘快捷键
   *
   * 支持的快捷键：
   * - Tab: 接受补全建议，将建议文本插入到光标位置
   * - Esc: 取消补全建议，清除显示的补全
   */
  addKeyboardShortcuts() {
    return {
      /**
       * Tab 键：接受补全建议
       *
       * 工作流程：
       * 1. 检查是否有补全建议
       * 2. 如果有，将建议文本插入到光标位置
       * 3. 设置光标到插入文本的末尾
       * 4. 标记为接受补全，触发状态清除
       *
       * @returns true 表示已处理 Tab 键，false 表示未处理（允许默认行为）
       */
      Tab: ({ editor }) => {
        // 获取插件状态
        const pluginState = pluginKey.getState(editor.state) as
          | PluginState
          | undefined;

        // 如果有补全建议，接受它
        if (pluginState?.suggestion && pluginState.position !== null) {
          const { suggestion } = pluginState;
          const { state, view } = editor;

          // 创建事务
          const { tr } = state;

          // 获取当前光标位置
          const from = state.selection.from;

          // 步骤 1：插入补全建议文本
          tr.insertText(suggestion);

          // 步骤 2：设置光标到插入文本的末尾
          const newPos = from + suggestion.length;
          tr.setSelection(TextSelection.create(tr.doc, newPos));

          // 步骤 3：标记为接受补全（这会触发 apply 方法清除补全状态）
          tr.setMeta("ai-completion-accept", true);

          // 步骤 4：应用事务
          view.dispatch(tr);

          // 返回 true 表示已处理 Tab 键，阻止默认行为（插入制表符）
          return true;
        }

        // 没有补全建议，允许默认行为（插入制表符）
        return false;
      },

      /**
       * Esc 键：取消补全建议
       *
       * 工作流程：
       * 1. 检查是否有补全建议
       * 2. 如果有，清除补全建议
       *
       * @returns true 表示已处理 Esc 键，false 表示未处理
       */
      Escape: ({ editor }) => {
        // 获取插件状态
        const pluginState = pluginKey.getState(editor.state) as
          | PluginState
          | undefined;

        // 如果有补全建议，清除它
        if (pluginState?.suggestion) {
          // 通过事务元数据清除补全建议
          editor.view.dispatch(
            editor.state.tr.setMeta("ai-completion-clear", true)
          );
          return true;
        }

        // 没有补全建议，允许默认行为
        return false;
      },
    };
  },
});
