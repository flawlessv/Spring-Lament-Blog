---
created: 2025-11-13T09:39:27 (UTC +08:00)
tags: []
source: https://code.claude.com/docs/zh-CN/skills#agent-skills
author:
---

# Agent Skills - Claude Code Docs

> ## Excerpt
>
> 在 Claude Code 中创建、管理和共享 Skills 以扩展 Claude 的功能。

---

本指南展示了如何在 Claude Code 中创建、使用和管理 Agent Skills。Skills 是模块化功能，通过包含说明、脚本和资源的有组织的文件夹来扩展 Claude 的功能。

## 前置条件

- Claude Code 版本 1.0 或更高版本
- 对 [Claude Code](https://code.claude.com/docs/zh-CN/quickstart) 的基本熟悉

Agent Skills 将专业知识打包成可发现的功能。每个 Skill 包含一个 `SKILL.md` 文件，其中包含 Claude 在相关时读取的说明，以及可选的支持文件，如脚本和模板。 **Skills 如何被调用**：Skills 是**模型调用的**——Claude 根据您的请求和 Skill 的描述自主决定何时使用它们。这与斜杠命令不同，斜杠命令是**用户调用的**（您显式输入 `/command` 来触发它们）。 **优势**：

- 为您的特定工作流扩展 Claude 的功能
- 通过 git 在您的团队中共享专业知识
- 减少重复提示
- 为复杂任务组合多个 Skills

在 [Agent Skills 概述](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview) 中了解更多信息。

## 创建 Skill

Skills 存储为包含 `SKILL.md` 文件的目录。

### 个人 Skills

个人 Skills 在您的所有项目中都可用。将它们存储在 `~/.claude/skills/` 中：

```perl
mkdir -p ~/.claude/skills/my-skill-name
```

**使用个人 Skills 的场景**：

- 您的个人工作流和偏好
- 您正在开发的实验性 Skills
- 个人生产力工具

### 项目 Skills

项目 Skills 与您的团队共享。将它们存储在项目中的 `.claude/skills/` 中：

```bash
mkdir -p .claude/skills/my-skill-name
```

**使用项目 Skills 的场景**：

- 团队工作流和约定
- 项目特定的专业知识
- 共享的实用程序和脚本

项目 Skills 被检入 git 并自动对团队成员可用。

### 插件 Skills

Skills 也可以来自 [Claude Code 插件](https://code.claude.com/docs/zh-CN/plugins)。插件可能捆绑了在安装插件时自动可用的 Skills。这些 Skills 的工作方式与个人和项目 Skills 相同。

## 编写 SKILL.md

创建一个带有 YAML frontmatter 和 Markdown 内容的 `SKILL.md` 文件：

```yaml
---
name: your-skill-name
description: Brief description of what this Skill does and when to use it
---

# Your Skill Name

## Instructions
Provide clear, step-by-step guidance for Claude.

## Examples
Show concrete examples of using this Skill.
```

**字段要求**：

- `name`：必须仅使用小写字母、数字和连字符（最多 64 个字符）
- `description`：Skill 的简要描述及其使用时机（最多 1024 个字符）

`description` 字段对于 Claude 发现何时使用您的 Skill 至关重要。它应该包括 Skill 的功能和 Claude 应该何时使用它。 有关完整的编写指导（包括验证规则），请参阅 [最佳实践指南](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices)。

## 添加支持文件

在 SKILL.md 旁边创建其他文件：

```cpp
my-skill/
├── SKILL.md (required)
├── reference.md (optional documentation)
├── examples.md (optional examples)
├── scripts/
│   └── helper.py (optional utility)
└── templates/
    └── template.txt (optional template)
```

从 SKILL.md 引用这些文件：

````go
For advanced usage, see [reference.md](reference.md).

Run the helper script:
```bash
python scripts/helper.py input.txt
````

````

Claude 仅在需要时读取这些文件，使用渐进式披露来有效管理上下文。

使用 `allowed-tools` frontmatter 字段来限制当 Skill 处于活动状态时 Claude 可以使用哪些工具：

```yaml
---
name: safe-file-reader
description: Read files without making changes. Use when you need read-only file access.
allowed-tools: Read, Grep, Glob
---

# Safe File Reader

This Skill provides read-only file access.

## Instructions
1. Use Read to view file contents
2. Use Grep to search within files
3. Use Glob to find files by pattern
````

当此 Skill 处于活动状态时，Claude 只能使用指定的工具（Read、Grep、Glob），无需请求权限。这对以下情况很有用：

- 不应修改文件的只读 Skills
- 范围有限的 Skills（例如，仅数据分析，无文件写入）
- 安全敏感的工作流，您希望限制功能

如果未指定 `allowed-tools`，Claude 将按照标准权限模型要求权限来使用工具。

## 查看可用的 Skills

Skills 由 Claude 从三个来源自动发现：

- 个人 Skills：`~/.claude/skills/`
- 项目 Skills：`.claude/skills/`
- 插件 Skills：与已安装的插件捆绑

**要查看所有可用的 Skills**，直接询问 Claude：

```sql
What Skills are available?
```

或

```css
List all available Skills
```

这将显示来自所有来源的所有 Skills，包括插件 Skills。 **要检查特定的 Skill**，您也可以检查文件系统：

```bash
# List personal Skills
ls ~/.claude/skills/

# List project Skills (if in a project directory)
ls .claude/skills/

# View a specific Skill's content
cat ~/.claude/skills/my-skill/SKILL.md
```

## 测试 Skill

创建 Skill 后，通过提出与您的描述相匹配的问题来测试它。 **示例**：如果您的描述提到”PDF 文件”：

```vbnet
Can you help me extract text from this PDF?
```

Claude 自主决定是否使用您的 Skill（如果它与请求匹配）——您无需显式调用它。Skill 根据您问题的上下文自动激活。

## 调试 Skill

如果 Claude 不使用您的 Skill，请检查这些常见问题：

### 使描述更具体

**太模糊**：

```vbnet
description: Helps with documents
```

**具体**：

```sql
description: Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.
```

在描述中包括 Skill 的功能和使用时机。

### 验证文件路径

**个人 Skills**：`~/.claude/skills/skill-name/SKILL.md` **项目 Skills**：`.claude/skills/skill-name/SKILL.md` 检查文件是否存在：

```bash
# Personal
ls ~/.claude/skills/my-skill/SKILL.md

# Project
ls .claude/skills/my-skill/SKILL.md
```

### 检查 YAML 语法

无效的 YAML 会阻止 Skill 加载。验证 frontmatter：

```bash
cat SKILL.md | head -n 10
```

确保：

- 第 1 行有开头的 `---`
- Markdown 内容前有结尾的 `---`
- 有效的 YAML 语法（无制表符，正确的缩进）

### 查看错误

使用调试模式运行 Claude Code 以查看 Skill 加载错误：

## 与您的团队共享 Skills

**推荐方法**：通过 [插件](https://code.claude.com/docs/zh-CN/plugins) 分发 Skills。 通过插件共享 Skills：

1.  创建一个在 `skills/` 目录中包含 Skills 的插件
2.  将插件添加到市场
3.  团队成员安装插件

有关完整说明，请参阅 [将 Skills 添加到您的插件](https://code.claude.com/docs/zh-CN/plugins#add-skills-to-your-plugin)。 您也可以直接通过项目存储库共享 Skills：

### 第 1 步：将 Skill 添加到您的项目

创建项目 Skill：

```bash
mkdir -p .claude/skills/team-skill
# Create SKILL.md
```

### 第 2 步：提交到 git

```sql
git add .claude/skills/
git commit -m "Add team Skill for PDF processing"
git push
```

### 第 3 步：团队成员自动获得 Skills

当团队成员拉取最新更改时，Skills 立即可用：

```graphql
git pull
claude  # Skills are now available
```

## 更新 Skill

直接编辑 SKILL.md：

```perl
# Personal Skill
code ~/.claude/skills/my-skill/SKILL.md

# Project Skill
code .claude/skills/my-skill/SKILL.md
```

更改在您下次启动 Claude Code 时生效。如果 Claude Code 已在运行，请重新启动它以加载更新。

## 删除 Skill

删除 Skill 目录：

```bash
# Personal
rm -rf ~/.claude/skills/my-skill

# Project
rm -rf .claude/skills/my-skill
git commit -m "Remove unused Skill"
```

## 最佳实践

### 保持 Skills 专注

一个 Skill 应该解决一个功能： **专注**：

- “PDF 表单填充”
- “Excel 数据分析”
- “Git 提交消息”

**太宽泛**：

- “文档处理”（分成单独的 Skills）
- “数据工具”（按数据类型或操作分割）

### 编写清晰的描述

通过在描述中包含特定触发器来帮助 Claude 发现何时使用 Skills： **清晰**：

```python
description: Analyze Excel spreadsheets, create pivot tables, and generate charts. Use when working with Excel files, spreadsheets, or analyzing tabular data in .xlsx format.
```

**模糊**：

### 与您的团队一起测试

让队友使用 Skills 并提供反馈：

- Skill 是否在预期时激活？
- 说明是否清晰？
- 是否有缺失的示例或边界情况？

### 记录 Skill 版本

您可以在 SKILL.md 内容中记录 Skill 版本以跟踪随时间的变化。添加版本历史部分：

```markdown
# My Skill

## Version History

- v2.0.0 (2025-10-01): Breaking changes to API
- v1.1.0 (2025-09-15): Added new features
- v1.0.0 (2025-09-01): Initial release
```

这有助于团队成员了解版本之间的变化。

## 故障排除

### Claude 不使用我的 Skill

**症状**：您提出相关问题，但 Claude 不使用您的 Skill。 **检查**：描述是否足够具体？ 模糊的描述会使发现变得困难。包括 Skill 的功能和使用时机，以及用户会提到的关键术语。 **太通用**：

```vbnet
description: Helps with data
```

**具体**：

```sql
description: Analyze Excel spreadsheets, generate pivot tables, create charts. Use when working with Excel files, spreadsheets, or .xlsx files.
```

**检查**：YAML 是否有效？ 运行验证以检查语法错误：

```bash
# View frontmatter
cat .claude/skills/my-skill/SKILL.md | head -n 15

# Check for common issues
# - Missing opening or closing ---
# - Tabs instead of spaces
# - Unquoted strings with special characters
```

**检查**：Skill 是否在正确的位置？

```bash
# Personal Skills
ls ~/.claude/skills/*/SKILL.md

# Project Skills
ls .claude/skills/*/SKILL.md
```

### Skill 有错误

**症状**：Skill 加载但无法正常工作。 **检查**：依赖项是否可用？ Claude 将在需要时自动安装所需的依赖项（或要求权限安装它们）。 **检查**：脚本是否有执行权限？

```bash
chmod +x .claude/skills/my-skill/scripts/*.py
```

**检查**：文件路径是否正确？ 在所有路径中使用正斜杠（Unix 风格）： **正确**：`scripts/helper.py` **错误**：`scripts\helper.py`（Windows 风格）

### 多个 Skills 冲突

**症状**：Claude 使用了错误的 Skill 或似乎在相似的 Skills 之间感到困惑。 **在描述中要具体**：通过在描述中使用不同的触发术语来帮助 Claude 选择正确的 Skill。 而不是：

```makefile
# Skill 1
description: For data analysis

# Skill 2
description: For analyzing data
```

使用：

```perl
# Skill 1
description: Analyze sales data in Excel files and CRM exports. Use for sales reports, pipeline analysis, and revenue tracking.

# Skill 2
description: Analyze log files and system metrics data. Use for performance monitoring, debugging, and system diagnostics.
```

## 示例

### 简单 Skill（单个文件）

```objectivec
commit-helper/
└── SKILL.md
```

```yaml
---
name: generating-commit-messages
description: Generates clear commit messages from git diffs. Use when writing commit messages or reviewing staged changes.
---

# Generating Commit Messages

## Instructions

1. Run `git diff --staged` to see changes
2. I'll suggest a commit message with:
   - Summary under 50 characters
   - Detailed description
   - Affected components

## Best practices

- Use present tense
- Explain what and why, not how
```

### 具有工具权限的 Skill

```css
code-reviewer/
└── SKILL.md
```

```yaml
---
name: code-reviewer
description: Review code for best practices and potential issues. Use when reviewing code, checking PRs, or analyzing code quality.
allowed-tools: Read, Grep, Glob
---

# Code Reviewer

## Review checklist

1. Code organization and structure
2. Error handling
3. Performance considerations
4. Security concerns
5. Test coverage

## Instructions

1. Read the target files using Read tool
2. Search for patterns using Grep
3. Find related files using Glob
4. Provide detailed feedback on code quality
```

### 多文件 Skill

```objectivec
pdf-processing/
├── SKILL.md
├── FORMS.md
├── REFERENCE.md
└── scripts/
    ├── fill_form.py
    └── validate.py
```

**SKILL.md**：

````yaml
---
name: pdf-processing
description: Extract text, fill forms, merge PDFs. Use when working with PDF files, forms, or document extraction. Requires pypdf and pdfplumber packages.
---

# PDF Processing

## Quick start

Extract text:
```python
import pdfplumber
with pdfplumber.open("doc.pdf") as pdf:
    text = pdf.pages[0].extract_text()
````

For form filling, see [FORMS.md](FORMS.md).
For detailed API reference, see [REFERENCE.md](REFERENCE.md).

## Requirements

Packages must be installed in your environment:

```bash
pip install pypdf pdfplumber
```

```

Claude 仅在需要时加载其他文件。

## 后续步骤
```
