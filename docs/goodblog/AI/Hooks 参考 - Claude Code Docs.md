---
created: 2025-11-13T09:37:55 (UTC +08:00)
tags: []
source: https://code.claude.com/docs/zh-CN/hooks#userpromptsubmit
author:
---

# Hooks 参考 - Claude Code Docs

> ## Excerpt
>
> 本页面提供在 Claude Code 中实现 hooks 的参考文档。

---

## 配置

Claude Code hooks 在您的 [设置文件](https://code.claude.com/docs/zh-CN/settings) 中配置：

- `~/.claude/settings.json` - 用户设置
- `.claude/settings.json` - 项目设置
- `.claude/settings.local.json` - 本地项目设置（未提交）
- 企业管理的策略设置

### 结构

Hooks 按匹配器组织，其中每个匹配器可以有多个 hooks：

```json
{
  "hooks": {
    "EventName": [
      {
        "matcher": "ToolPattern",
        "hooks": [
          {
            "type": "command",
            "command": "your-command-here"
          }
        ]
      }
    ]
  }
}
```

- **matcher**：用于匹配工具名称的模式，区分大小写（仅适用于 `PreToolUse` 和 `PostToolUse`）
  - 简单字符串精确匹配：`Write` 仅匹配 Write 工具
  - 支持正则表达式：`Edit|Write` 或 `Notebook.*`
  - 使用 `*` 匹配所有工具。您也可以使用空字符串 (`""`) 或留空 `matcher`。
- **hooks**：当模式匹配时要执行的 hooks 数组
  - `type`：Hook 执行类型 - `"command"` 用于 bash 命令或 `"prompt"` 用于基于 LLM 的评估
  - `command`：（对于 `type: "command"`）要执行的 bash 命令（可以使用 `$CLAUDE_PROJECT_DIR` 环境变量）
  - `prompt`：（对于 `type: "prompt"`）要发送给 LLM 进行评估的提示
  - `timeout`：（可选）hook 应运行的时间（以秒为单位），超时后取消该特定 hook

对于不使用匹配器的事件，如 `UserPromptSubmit`、`Notification`、`Stop` 和 `SubagentStop`，您可以省略 matcher 字段：

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "/path/to/prompt-validator.py"
          }
        ]
      }
    ]
  }
}
```

### 项目特定的 Hook 脚本

您可以使用环境变量 `CLAUDE_PROJECT_DIR`（仅在 Claude Code 生成 hook 命令时可用）来引用存储在项目中的脚本，确保它们无论 Claude 的当前目录如何都能工作：

```swift
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/check-style.sh"
          }
        ]
      }
    ]
  }
}
```

### 插件 hooks

[插件](https://code.claude.com/docs/zh-CN/plugins) 可以提供与您的用户和项目 hooks 无缝集成的 hooks。启用插件时，插件 hooks 会自动与您的配置合并。 **插件 hooks 的工作原理**：

- 插件 hooks 在插件的 `hooks/hooks.json` 文件或由 `hooks` 字段的自定义路径指定的文件中定义。
- 启用插件时，其 hooks 与用户和项目 hooks 合并
- 来自不同来源的多个 hooks 可以响应同一事件
- 插件 hooks 使用 `${CLAUDE_PLUGIN_ROOT}` 环境变量来引用插件文件

**示例插件 hook 配置**：

```bash
{
  "description": "自动代码格式化",
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/format.sh",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

**插件的环境变量**：

- `${CLAUDE_PLUGIN_ROOT}`：插件目录的绝对路径
- `${CLAUDE_PROJECT_DIR}`：项目根目录（与项目 hooks 相同）
- 所有标准环境变量都可用

有关创建插件 hooks 的详细信息，请参阅 [插件组件参考](https://code.claude.com/docs/zh-CN/plugins-reference#hooks)。

除了 bash 命令 hooks（`type: "command"`），Claude Code 还支持基于提示的 hooks（`type: "prompt"`），它们使用 LLM 来评估是否允许或阻止操作。基于提示的 hooks 目前仅支持 `Stop` 和 `SubagentStop` hooks，其中它们启用智能的、上下文感知的决策。

### 基于提示的 hooks 如何工作

基于提示的 hooks 不执行 bash 命令，而是：

1.  将 hook 输入和您的提示发送给快速 LLM (Haiku)
2.  LLM 使用包含决策的结构化 JSON 进行响应
3.  Claude Code 自动处理决策

### 配置

```bash
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "评估 Claude 是否应该停止：$ARGUMENTS。检查所有任务是否完成。"
          }
        ]
      }
    ]
  }
}
```

**字段：**

- `type`：必须是 `"prompt"`
- `prompt`：要发送给 LLM 的提示文本
  - 使用 `$ARGUMENTS` 作为 hook 输入 JSON 的占位符
  - 如果 `$ARGUMENTS` 不存在，输入 JSON 会附加到提示后面
- `timeout`：（可选）超时时间（以秒为单位）（默认：30 秒）

### 响应模式

LLM 必须使用包含以下内容的 JSON 进行响应：

```cpp
{
  "decision": "approve" | "block",
  "reason": "决策的解释",
  "continue": false,  // 可选：完全停止 Claude
  "stopReason": "显示给用户的消息",  // 可选：自定义停止消息
  "systemMessage": "警告或上下文"  // 可选：显示给用户
}
```

**响应字段：**

- `decision`：`"approve"` 允许操作，`"block"` 阻止操作
- `reason`：当决策为 `"block"` 时显示给 Claude 的解释
- `continue`：（可选）如果为 `false`，完全停止 Claude 的执行
- `stopReason`：（可选）当 `continue` 为 false 时显示的消息
- `systemMessage`：（可选）显示给用户的附加消息

### 支持的 hook 事件

基于提示的 hooks 适用于任何 hook 事件，但对以下最有用：

- **Stop**：智能决定 Claude 是否应该继续工作
- **SubagentStop**：评估子代理是否已完成其任务
- **UserPromptSubmit**：使用 LLM 协助验证用户提示
- **PreToolUse**：做出上下文感知的权限决策

### 示例：智能 Stop hook

```swift
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "您正在评估 Claude 是否应该停止工作。上下文：$ARGUMENTS\n\n分析对话并确定：\n1. 所有用户请求的任务是否完成\n2. 是否需要解决任何错误\n3. 是否需要后续工作\n\n使用 JSON 响应：{\"decision\": \"approve\" 或 \"block\", \"reason\": \"您的解释\"}",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

### 示例：带有自定义逻辑的 SubagentStop

```swift
{
  "hooks": {
    "SubagentStop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "评估此子代理是否应该停止。输入：$ARGUMENTS\n\n检查：\n- 子代理是否完成了其分配的任务\n- 是否发生了需要修复的错误\n- 是否需要额外的上下文收集\n\n返回：{\"decision\": \"approve\" 或 \"block\", \"reason\": \"解释\"}"
          }
        ]
      }
    ]
  }
}
```

### 与 bash 命令 hooks 的比较

| 功能           | Bash 命令 Hooks  | 基于提示的 Hooks |
| -------------- | ---------------- | ---------------- |
| **执行**       | 运行 bash 脚本   | 查询 LLM         |
| **决策逻辑**   | 您在代码中实现   | LLM 评估上下文   |
| **设置复杂性** | 需要脚本文件     | 仅配置提示       |
| **上下文感知** | 受脚本逻辑限制   | 自然语言理解     |
| **性能**       | 快速（本地执行） | 较慢（API 调用） |
| **用例**       | 确定性规则       | 上下文感知的决策 |

### 最佳实践

- **在提示中具体说明**：清楚地说明您希望 LLM 评估的内容
- **包括决策标准**：列出 LLM 应考虑的因素
- **测试您的提示**：验证 LLM 为您的用例做出正确的决策
- **设置适当的超时**：默认为 30 秒，如果需要可调整
- **用于复杂决策**：Bash hooks 更适合简单的、确定性的规则

有关创建插件 hooks 的详细信息，请参阅 [插件组件参考](https://code.claude.com/docs/zh-CN/plugins-reference#hooks)。

## Hook 事件

### PreToolUse

在 Claude 创建工具参数之后和处理工具调用之前运行。 **常见匹配器：**

- `Task` - 子代理任务（请参阅 [子代理文档](https://code.claude.com/docs/zh-CN/sub-agents)）
- `Bash` - Shell 命令
- `Glob` - 文件模式匹配
- `Grep` - 内容搜索
- `Read` - 文件读取
- `Edit` - 文件编辑
- `Write` - 文件写入
- `WebFetch`、`WebSearch` - Web 操作

### PostToolUse

在工具成功完成后立即运行。 识别与 PreToolUse 相同的匹配器值。

### Notification

在 Claude Code 发送通知时运行。通知在以下情况下发送：

1.  Claude 需要您的权限来使用工具。示例：“Claude 需要您的权限来使用 Bash”
2.  提示输入已空闲至少 60 秒。“Claude 正在等待您的输入”

### UserPromptSubmit

在用户提交提示时运行，在 Claude 处理之前。这允许您根据提示/对话添加额外上下文、验证提示或阻止某些类型的提示。

### Stop

在主 Claude Code 代理完成响应时运行。如果停止是由于用户中断而发生的，则不运行。

### SubagentStop

在 Claude Code 子代理（Task 工具调用）完成响应时运行。

### PreCompact

在 Claude Code 即将运行压缩操作之前运行。 **匹配器：**

- `manual` - 从 `/compact` 调用
- `auto` - 从自动压缩调用（由于上下文窗口已满）

### SessionStart

在 Claude Code 启动新会话或恢复现有会话时运行（目前在后台启动新会话）。用于加载开发上下文，如现有问题或代码库的最近更改、安装依赖项或设置环境变量。 **匹配器：**

- `startup` - 从启动调用
- `resume` - 从 `--resume`、`--continue` 或 `/resume` 调用
- `clear` - 从 `/clear` 调用
- `compact` - 从自动或手动压缩调用。

#### 持久化环境变量

SessionStart hooks 可以访问 `CLAUDE_ENV_FILE` 环境变量，该变量提供一个文件路径，您可以在其中为后续 bash 命令持久化环境变量。 **示例：设置单个环境变量**

```bash
#!/bin/bash

if [ -n "$CLAUDE_ENV_FILE" ]; then
  echo 'export NODE_ENV=production' >> "$CLAUDE_ENV_FILE"
  echo 'export API_KEY=your-api-key' >> "$CLAUDE_ENV_FILE"
  echo 'export PATH="$PATH:./node_modules/.bin"' >> "$CLAUDE_ENV_FILE"
fi

exit 0
```

**示例：持久化 hook 中的所有环境更改** 当您的设置修改环境时（例如 `nvm use`），通过对环境进行差异比较来捕获和持久化所有更改：

```bash
#!/bin/bash

ENV_BEFORE=$(export -p | sort)

# 运行修改环境的设置命令
source ~/.nvm/nvm.sh
nvm use 20

if [ -n "$CLAUDE_ENV_FILE" ]; then
  ENV_AFTER=$(export -p | sort)
  comm -13 <(echo "$ENV_BEFORE") <(echo "$ENV_AFTER") >> "$CLAUDE_ENV_FILE"
fi

exit 0
```

写入此文件的任何变量都将在会话期间 Claude Code 执行的所有后续 bash 命令中可用。

### SessionEnd

在 Claude Code 会话结束时运行。用于清理任务、记录会话统计信息或保存会话状态。 hook 输入中的 `reason` 字段将是以下之一：

- `clear` - 使用 /clear 命令清除的会话
- `logout` - 用户已登出
- `prompt_input_exit` - 用户在提示输入可见时退出
- `other` - 其他退出原因

## Hook 输入

Hooks 通过 stdin 接收包含会话信息和事件特定数据的 JSON 数据：

```csharp
{
  // 常见字段
  session_id: string
  transcript_path: string  // 对话 JSON 的路径
  cwd: string              // 调用 hook 时的当前工作目录
  permission_mode: string  // 当前权限模式："default"、"plan"、"acceptEdits" 或 "bypassPermissions"

  // 事件特定字段
  hook_event_name: string
  ...
}
```

### PreToolUse 输入

`tool_input` 的确切模式取决于工具。

```json
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "PreToolUse",
  "tool_name": "Write",
  "tool_input": {
    "file_path": "/path/to/file.txt",
    "content": "file content"
  }
}
```

### PostToolUse 输入

`tool_input` 和 `tool_response` 的确切模式取决于工具。

```json
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "PostToolUse",
  "tool_name": "Write",
  "tool_input": {
    "file_path": "/path/to/file.txt",
    "content": "file content"
  },
  "tool_response": {
    "filePath": "/path/to/file.txt",
    "success": true
  }
}
```

### Notification 输入

```json
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "Notification",
  "message": "Task completed successfully"
}
```

### UserPromptSubmit 输入

```json
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "UserPromptSubmit",
  "prompt": "Write a function to calculate the factorial of a number"
}
```

### Stop 和 SubagentStop 输入

当 Claude Code 已经作为 stop hook 的结果继续时，`stop_hook_active` 为 true。检查此值或处理记录以防止 Claude Code 无限运行。

```json
{
  "session_id": "abc123",
  "transcript_path": "~/.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "permission_mode": "default",
  "hook_event_name": "Stop",
  "stop_hook_active": true
}
```

### PreCompact 输入

对于 `manual`，`custom_instructions` 来自用户传入 `/compact` 的内容。对于 `auto`，`custom_instructions` 为空。

```json
{
  "session_id": "abc123",
  "transcript_path": "~/.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "permission_mode": "default",
  "hook_event_name": "PreCompact",
  "trigger": "manual",
  "custom_instructions": ""
}
```

### SessionStart 输入

```json
{
  "session_id": "abc123",
  "transcript_path": "~/.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "permission_mode": "default",
  "hook_event_name": "SessionStart",
  "source": "startup"
}
```

### SessionEnd 输入

```json
{
  "session_id": "abc123",
  "transcript_path": "~/.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "SessionEnd",
  "reason": "exit"
}
```

## Hook 输出

Hooks 有两种方式将输出返回给 Claude Code。输出传达是否阻止以及应显示给 Claude 和用户的任何反馈。

### 简单：退出代码

Hooks 通过退出代码、stdout 和 stderr 传达状态：

- **退出代码 0**：成功。`stdout` 在记录模式 (CTRL-R) 中显示给用户，除了 `UserPromptSubmit` 和 `SessionStart`，其中 stdout 被添加到上下文中。
- **退出代码 2**：阻止错误。`stderr` 被反馈给 Claude 自动处理。请参阅下面的每个 hook 事件行为。
- **其他退出代码**：非阻止错误。`stderr` 显示给用户，执行继续。

#### 退出代码 2 行为

| Hook 事件          | 行为                                        |
| ------------------ | ------------------------------------------- |
| `PreToolUse`       | 阻止工具调用，向 Claude 显示 stderr         |
| `PostToolUse`      | 向 Claude 显示 stderr（工具已运行）         |
| `Notification`     | 不适用，仅向用户显示 stderr                 |
| `UserPromptSubmit` | 阻止提示处理，清除提示，仅向用户显示 stderr |
| `Stop`             | 阻止停止，向 Claude 显示 stderr             |
| `SubagentStop`     | 阻止停止，向 Claude 子代理显示 stderr       |
| `PreCompact`       | 不适用，仅向用户显示 stderr                 |
| `SessionStart`     | 不适用，仅向用户显示 stderr                 |
| `SessionEnd`       | 不适用，仅向用户显示 stderr                 |

### 高级：JSON 输出

Hooks 可以在 `stdout` 中返回结构化 JSON 以获得更复杂的控制：

#### 常见 JSON 字段

所有 hook 类型都可以包括这些可选字段：

```json
{
  "continue": true, // Claude 在 hook 执行后是否应继续（默认：true）
  "stopReason": "string", // 当 continue 为 false 时显示的消息

  "suppressOutput": true, // 从记录模式中隐藏 stdout（默认：false）
  "systemMessage": "string" // 可选的警告消息显示给用户
}
```

如果 `continue` 为 false，Claude 在 hooks 运行后停止处理。

- 对于 `PreToolUse`，这与 `"permissionDecision": "deny"` 不同，后者仅阻止特定工具调用并向 Claude 提供自动反馈。
- 对于 `PostToolUse`，这与 `"decision": "block"` 不同，后者向 Claude 提供自动反馈。
- 对于 `UserPromptSubmit`，这阻止提示被处理。
- 对于 `Stop` 和 `SubagentStop`，这优先于任何 `"decision": "block"` 输出。
- 在所有情况下，`"continue" = false` 优先于任何 `"decision": "block"` 输出。

`stopReason` 伴随 `continue` 显示给用户的原因，不显示给 Claude。

#### `PreToolUse` 决策控制

`PreToolUse` hooks 可以控制工具调用是否继续。

- `"allow"` 绕过权限系统。`permissionDecisionReason` 显示给用户但不显示给 Claude。
- `"deny"` 阻止工具调用执行。`permissionDecisionReason` 显示给 Claude。
- `"ask"` 要求用户在 UI 中确认工具调用。`permissionDecisionReason` 显示给用户但不显示给 Claude。

此外，hooks 可以在执行前使用 `updatedInput` 修改工具输入：

- `updatedInput` 允许您在工具执行前修改工具的输入参数。这是一个 `Record<string, unknown>` 对象，包含您想要更改或添加的字段。
- 这在 `"permissionDecision": "allow"` 时最有用，以修改和批准工具调用。

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow"
    "permissionDecisionReason": "我的原因在这里",
    "updatedInput": {
      "field_to_modify": "new value"
    }
  }
}
```

#### `PostToolUse` 决策控制

`PostToolUse` hooks 可以在工具执行后向 Claude 提供反馈。

- `"block"` 自动提示 Claude 使用 `reason`。
- `undefined` 不做任何事。`reason` 被忽略。
- `"hookSpecificOutput.additionalContext"` 为 Claude 添加要考虑的上下文。

```javascript
{
  "decision": "block" | undefined,
  "reason": "决策的解释",
  "hookSpecificOutput": {
    "hookEventName": "PostToolUse",
    "additionalContext": "Claude 要考虑的附加信息"
  }
}
```

#### `UserPromptSubmit` 决策控制

`UserPromptSubmit` hooks 可以控制用户提示是否被处理。

- `"block"` 阻止提示被处理。提交的提示从上下文中清除。`"reason"` 显示给用户但不添加到上下文中。
- `undefined` 允许提示正常进行。`"reason"` 被忽略。
- `"hookSpecificOutput.additionalContext"` 如果未被阻止，将字符串添加到上下文中。

```javascript
{
  "decision": "block" | undefined,
  "reason": "决策的解释",
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "我的附加上下文在这里"
  }
}
```

#### `Stop`/`SubagentStop` 决策控制

`Stop` 和 `SubagentStop` hooks 可以控制 Claude 是否必须继续。

- `"block"` 阻止 Claude 停止。您必须填充 `reason` 以便 Claude 知道如何继续。
- `undefined` 允许 Claude 停止。`reason` 被忽略。

```javascript
{
  "decision": "block" | undefined,
  "reason": "当 Claude 被阻止停止时必须提供"
}
```

#### `SessionStart` 决策控制

`SessionStart` hooks 允许您在会话开始时加载上下文。

- `"hookSpecificOutput.additionalContext"` 将字符串添加到上下文中。
- 多个 hooks 的 `additionalContext` 值被连接。

```json
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "我的附加上下文在这里"
  }
}
```

#### `SessionEnd` 决策控制

`SessionEnd` hooks 在会话结束时运行。它们无法阻止会话终止，但可以执行清理任务。

#### 退出代码示例：Bash 命令验证

```python
#!/usr/bin/env python3
import json
import re
import sys

# 将验证规则定义为 (regex 模式, 消息) 元组列表
VALIDATION_RULES = [
    (
        r"\bgrep\b(?!.*\|)",
        "使用 'rg'（ripgrep）而不是 'grep' 以获得更好的性能和功能",
    ),
    (
        r"\bfind\s+\S+\s+-name\b",
        "使用 'rg --files | rg pattern' 或 'rg --files -g pattern' 而不是 'find -name' 以获得更好的性能",
    ),
]


def validate_command(command: str) -> list[str]:
    issues = []
    for pattern, message in VALIDATION_RULES:
        if re.search(pattern, command):
            issues.append(message)
    return issues


try:
    input_data = json.load(sys.stdin)
except json.JSONDecodeError as e:
    print(f"错误：无效的 JSON 输入：{e}", file=sys.stderr)
    sys.exit(1)

tool_name = input_data.get("tool_name", "")
tool_input = input_data.get("tool_input", {})
command = tool_input.get("command", "")

if tool_name != "Bash" or not command:
    sys.exit(1)

# 验证命令
issues = validate_command(command)

if issues:
    for message in issues:
        print(f"• {message}", file=sys.stderr)
    # 退出代码 2 阻止工具调用并向 Claude 显示 stderr
    sys.exit(2)
```

#### JSON 输出示例：UserPromptSubmit 添加上下文和验证

```python
#!/usr/bin/env python3
import json
import sys
import re
import datetime

# 从 stdin 加载输入
try:
    input_data = json.load(sys.stdin)
except json.JSONDecodeError as e:
    print(f"错误：无效的 JSON 输入：{e}", file=sys.stderr)
    sys.exit(1)

prompt = input_data.get("prompt", "")

# 检查敏感模式
sensitive_patterns = [
    (r"(?i)\b(password|secret|key|token)\s*[:=]", "提示包含潜在的机密"),
]

for pattern, message in sensitive_patterns:
    if re.search(pattern, prompt):
        # 使用 JSON 输出以特定原因阻止
        output = {
            "decision": "block",
            "reason": f"安全策略违规：{message}。请重新表述您的请求，不包含敏感信息。"
        }
        print(json.dumps(output))
        sys.exit(0)

# 将当前时间添加到上下文
context = f"当前时间：{datetime.datetime.now()}"
print(context)

"""
以下也是等效的：
print(json.dumps({
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": context,
  },
}))
"""

# 允许提示继续进行附加上下文
sys.exit(0)
```

#### JSON 输出示例：带有批准的 PreToolUse

```python
#!/usr/bin/env python3
import json
import sys

# 从 stdin 加载输入
try:
    input_data = json.load(sys.stdin)
except json.JSONDecodeError as e:
    print(f"错误：无效的 JSON 输入：{e}", file=sys.stderr)
    sys.exit(1)

tool_name = input_data.get("tool_name", "")
tool_input = input_data.get("tool_input", {})

# 示例：自动批准文档文件的文件读取
if tool_name == "Read":
    file_path = tool_input.get("file_path", "")
    if file_path.endswith((".md", ".mdx", ".txt", ".json")):
        # 使用 JSON 输出自动批准工具调用
        output = {
            "decision": "approve",
            "reason": "文档文件自动批准",
            "suppressOutput": True  # 不在记录模式中显示
        }
        print(json.dumps(output))
        sys.exit(0)

# 对于其他情况，让正常权限流程继续
sys.exit(0)
```

## 使用 MCP 工具

Claude Code hooks 与 [Model Context Protocol (MCP) 工具](https://code.claude.com/docs/zh-CN/mcp) 无缝协作。当 MCP 服务器提供工具时，它们会以特殊命名模式出现，您可以在 hooks 中匹配。

### MCP 工具命名

MCP 工具遵循模式 `mcp__<server>__<tool>`，例如：

- `mcp__memory__create_entities` - Memory 服务器的创建实体工具
- `mcp__filesystem__read_file` - Filesystem 服务器的读取文件工具
- `mcp__github__search_repositories` - GitHub 服务器的搜索工具

### 为 MCP 工具配置 Hooks

您可以针对特定 MCP 工具或整个 MCP 服务器：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "mcp__memory__.*",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Memory operation initiated' >> ~/mcp-operations.log"
          }
        ]
      },
      {
        "matcher": "mcp__.*__write.*",
        "hooks": [
          {
            "type": "command",
            "command": "/home/user/scripts/validate-mcp-write.py"
          }
        ]
      }
    ]
  }
}
```

## 示例

## 安全考虑

### 免责声明

**自行承担风险使用**：Claude Code hooks 在您的系统上自动执行任意 shell 命令。通过使用 hooks，您承认：

- 您对配置的命令单独负责
- Hooks 可以修改、删除或访问您的用户帐户可以访问的任何文件
- 恶意或编写不当的 hooks 可能导致数据丢失或系统损坏
- Anthropic 不提供任何保证，对因 hook 使用而产生的任何损害不承担任何责任
- 您应在生产使用前在安全环境中彻底测试 hooks

在将任何 hook 命令添加到您的配置之前，始终审查并理解它们。

### 安全最佳实践

以下是编写更安全 hooks 的一些关键实践：

1.  **验证和清理输入** - 永远不要盲目信任输入数据
2.  **始终引用 shell 变量** - 使用 `"$VAR"` 而不是 `$VAR`
3.  **阻止路径遍历** - 检查文件路径中的 `..`
4.  **使用绝对路径** - 为脚本指定完整路径（对项目路径使用 “$CLAUDE_PROJECT_DIR”）
5.  **跳过敏感文件** - 避免 `.env`、`.git/`、密钥等

### 配置安全

对设置文件中 hooks 的直接编辑不会立即生效。Claude Code：

1.  在启动时捕获 hooks 的快照
2.  在整个会话中使用此快照
3.  如果 hooks 被外部修改，发出警告
4.  需要在 `/hooks` 菜单中审查更改才能应用

这可防止恶意 hook 修改影响您的当前会话。

## Hook 执行详情

- **超时**：默认 60 秒执行限制，每个命令可配置。
  - 单个命令的超时不影响其他命令。
- **并行化**：所有匹配的 hooks 并行运行
- **去重**：多个相同的 hook 命令自动去重
- **环境**：在当前目录中运行，使用 Claude Code 的环境
  - `CLAUDE_PROJECT_DIR` 环境变量可用，包含项目根目录的绝对路径（Claude Code 启动的位置）
  - `CLAUDE_CODE_REMOTE` 环境变量指示 hook 是在远程（web）环境 (`"true"`) 还是本地 CLI 环境（未设置或为空）中运行。使用此变量根据执行上下文运行不同的逻辑。
- **输入**：通过 stdin 的 JSON
- **输出**：
  - PreToolUse/PostToolUse/Stop/SubagentStop：进度显示在记录中 (Ctrl-R)
  - Notification/SessionEnd：仅记录到调试 (`--debug`)
  - UserPromptSubmit/SessionStart：stdout 添加为 Claude 的上下文

## 调试

### 基本故障排除

如果您的 hooks 不工作：

1.  **检查配置** - 运行 `/hooks` 查看您的 hook 是否已注册
2.  **验证语法** - 确保您的 JSON 设置有效
3.  **测试命令** - 首先手动运行 hook 命令
4.  **检查权限** - 确保脚本可执行
5.  **查看日志** - 使用 `claude --debug` 查看 hook 执行详情

常见问题：

- **引号未转义** - 在 JSON 字符串中使用 `\"`
- **错误的匹配器** - 检查工具名称精确匹配（区分大小写）
- **找不到命令** - 为脚本使用完整路径

### 高级调试

对于复杂的 hook 问题：

1.  **检查 hook 执行** - 使用 `claude --debug` 查看详细的 hook 执行
2.  **验证 JSON 模式** - 使用外部工具测试 hook 输入/输出
3.  **检查环境变量** - 验证 Claude Code 的环境是否正确
4.  **测试边界情况** - 尝试使用不寻常的文件路径或输入的 hooks
5.  **监控系统资源** - 在 hook 执行期间检查资源耗尽
6.  **使用结构化日志** - 在 hook 脚本中实现日志记录

### 调试输出示例

使用 `claude --debug` 查看 hook 执行详情：

```csharp
[DEBUG] 为 PostToolUse:Write 执行 hooks
[DEBUG] 获取 PostToolUse 的匹配 hook 命令，查询：Write
[DEBUG] 在设置中找到 1 个 hook 匹配器
[DEBUG] 为查询 "Write" 匹配了 1 个 hooks
[DEBUG] 找到 1 个 hook 命令要执行
[DEBUG] 执行 hook 命令：<您的命令> 超时 60000ms
[DEBUG] Hook 命令完成，状态 0：<您的 stdout>
```

进度消息显示在记录模式 (Ctrl-R) 中：

- 哪个 hook 正在运行
- 正在执行的命令
- 成功/失败状态
- 输出或错误消息
