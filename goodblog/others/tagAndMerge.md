---
categories: Node.js
date: 2025-02-20
title: 如何实现一键合并分支并打Tag的自动化工具
recommend: true
id: auto-merge-tag-tool
---

## 背景介绍

在日常的软件开发工作中，我们经常需要将功能分支合并到不同的环境分支（如测试环境、预发布环境），同时还需要为每次发布创建相应的标签。这个过程如果手动操作，不仅繁琐易错，还容易遗漏关键步骤。

为了解决这个痛点，我们开发了一个自动化工具 `mergeAndTag.mjs`，它能够一键完成分支合并、标签创建和代码推送的整个流程，极大地提高了开发效率和发布的准确性。

## 工具功能特点

### 核心功能

- **自动分支合并**：将当前分支自动合并到指定的环境分支
- **智能标签创建**：根据环境和应用自动生成标准化的Tag
- **工作区保护**：自动保存和恢复未提交的工作区修改
- **交互式操作**：提供直观的环境和应用选择界面
- **自动推送**：完成合并后自动推送代码到远程仓库
- **安全机制**：操作前确认、出错时自动回滚

### 技术亮点

- 使用 ES6 模块化开发
- 集成 inquirer 提供友好的交互界面
- 支持自定义分支映射配置
- 完善的错误处理和回滚机制
- 实时命令输出显示

## 执行流程

以下是工具的完整执行流程图：

![一键合并分支并打Tag工具流程图](/images/others/image.png)

从流程图可以看出，整个过程包括以下关键步骤：

1. **开始执行**：启动脚本
2. **交互式选择**：配置环境和应用选择
3. **确认操作信息**：用户确认发布信息
4. **获取远程更新**：执行 `git fetch`
5. **保存工作区修改**：执行 `git stash`
6. **推送当前分支**：执行 `git push`
7. **切换到目标分支**：切换到环境分支
8. **合并源分支**：执行分支合并操作
9. **判断合并内容**：检查是否有新的合并内容
10. **创建标签**：如果有新内容则创建Tag，否则跳过
11. **切换回源分支**：返回到原始分支
12. **恢复工作区修改**：执行 `git stash pop`
13. **操作完成**：成功结束流程

## 使用前提条件

在使用该工具之前，需要确保以下依赖已经安装：

```bash
# 安装必要的依赖包
npm install inquirer @mi/workflow-tag @mi/workflow-utils
```

### 依赖说明

- **inquirer**：提供交互式命令行界面
- **@mi/workflow-tag**：内部标签管理工具
- **@mi/workflow-utils**：内部工作流工具集

## 详细使用指南

### 基本使用步骤

1. **切换到源分支**

   ```bash
   git checkout feature/your-feature-branch
   ```

2. **运行合并脚本**

   ```bash
   node scripts/mergeAndTag.mjs
   ```

3. **选择目标环境**
   - `test (黄区)`：测试环境
   - `pre (红区)`：预发布环境

4. **选择应用类型**
   - `main`：主应用
   - `r`：R应用
   - `r2`：R2应用

5. **确认操作信息**
   系统会显示详细的操作信息供确认：

   ```
   确认以下发布信息?
   源分支: feature/your-feature-branch
   目标分支: feature/new-biz-test
   发布环境: test
   发布应用: r2
   ```

6. **等待自动执行**
   脚本会自动完成所有Git操作和标签创建

### 配置说明

工具通过 `BRANCH_CONFIG` 配置不同环境的分支映射关系：

```javascript
const BRANCH_CONFIG = {
  test: {
    branch: "feature/new-biz-test",
    tagPrefix: dftTagPrefixMap.test,
  },
  pre: {
    branch: "feature/main-new-pre",
    tagPrefix: dftTagPrefixMap.pre,
  },
};
```

标签命名规则：`{环境前缀}-mipoc-{应用}-{日期}`

## 核心代码实现

### 交互式配置选择

```javascript
async function promptConfig() {
  const sourceBranch = await getCurrentBranch();

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "env",
      message: "选择发布环境:",
      choices: [
        { name: "test (黄区)", value: "test" },
        { name: "pre (红区)", value: "pre" },
      ],
      default: "test",
    },
    {
      type: "list",
      name: "app",
      message: "选择要发布的应用:",
      choices: ["main", "r", "r2"],
      default: "r2",
    },
  ]);

  const targetBranch = BRANCH_CONFIG[answers.env].branch;

  const { confirmed } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmed",
      message: `确认以下发布信息?\n源分支: ${sourceBranch}\n目标分支: ${targetBranch}\n发布环境: ${answers.env}\n发布应用: ${answers.app}`,
    },
  ]);

  if (!confirmed) exit("操作已取消");

  return { sourceBranch, targetBranch, env: answers.env, app: answers.app };
}
```

### 命令执行封装

```javascript
function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, { shell: true });
    let output = "";

    process.stdout.on("data", (data) => {
      const str = data.toString();
      console.log(str);
      output += str;
    });

    process.stderr.on("data", (data) => console.error(data.toString()));

    process.on("close", (code) => {
      if (code === 0) resolve(output);
      else reject(new Error(`Command failed with code ${code}`));
    });
  });
}
```

### 标签创建逻辑

```javascript
async function createTag(targetBranch, env, app) {
  const tagPrefixMap = {
    [targetBranch]: BRANCH_CONFIG[env].tagPrefix,
  };

  await MiTag({
    tagPrefixMap,
    customFullPrefix({ prefix, curDate }) {
      return `${prefix}-mipoc-${app}-${curDate}`;
    },
  });
}
```

## 异常处理与安全机制

### 错误处理策略

1. **合并冲突处理**

   ```javascript
   try {
     const mergeOutput = await runCommand("git", [
       "merge",
       `origin/${sourceBranch}`,
     ]);
   } catch (error) {
     console.error("执行git操作失败:", error.message);
     console.log("正在回滚操作...");
     await runCommand("git", ["merge", "--abort"]);
     throw error;
   }
   ```

2. **工作区保护**

   ```javascript
   // 操作前保存工作区
   await runCommand('git', ['stash'])

   // 操作后恢复工作区
   finally {
     await runCommand('git', ['stash', 'pop'])
   }
   ```

3. **分支切换保护**
   ```javascript
   finally {
     console.log(`切换回 ${sourceBranch} 分支...`)
     await runCommand('git', ['checkout', sourceBranch])
   }
   ```

## 最佳实践建议

### 使用前检查

- 确保本地仓库状态干净
- 重要修改建议先提交
- 确认远程分支存在且可访问

### 操作规范

- 选择正确的目标环境
- 确认应用类型无误
- 仔细检查确认信息

### 故障排除

- **合并失败**：检查并解决代码冲突
- **标签创建失败**：确认标签权限和重名情况
- **分支不存在**：检查分支配置是否正确

## 扩展功能

### 自定义分支配置

可以根据项目需求修改 `BRANCH_CONFIG`：

```javascript
const BRANCH_CONFIG = {
  // 添加新环境
  staging: {
    branch: "feature/staging",
    tagPrefix: "staging",
  },
  // 修改现有环境
  test: {
    branch: "feature/your-test-branch",
    tagPrefix: "test",
  },
};
```

### 增加应用类型

在 `promptConfig` 函数中扩展应用选择：

```javascript
{
  type: 'list',
  name: 'app',
  message: '选择要发布的应用:',
  choices: ['main', 'r', 'r2', 'new-app'], // 添加新应用
  default: 'r2',
}
```

## 总结

这个一键合并分支并打Tag的自动化工具，通过标准化的流程和友好的交互界面，有效解决了手动操作容易出错的问题。它不仅提高了开发效率，还保证了发布流程的一致性和可靠性。

### 主要优势

- **提高效率**：一键完成复杂的Git操作流程
- **减少错误**：自动化减少人为操作失误
- **标准化**：统一的分支管理和标签命名规范
- **安全性**：完善的错误处理和回滚机制

### 学习资源

- [Git官方文档](https://git-scm.com/docs)
- [Node.js子进程文档](https://nodejs.org/api/child_process.html)
- [Inquirer.js文档](https://github.com/SBoudrias/Inquirer.js)

通过使用这个工具，开发团队可以更专注于代码开发本身，而不必担心繁琐的发布流程操作。
