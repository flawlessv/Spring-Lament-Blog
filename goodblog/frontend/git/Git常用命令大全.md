---
title: Git常用命令大全
slug: gitsk0hl6
published: true
featured: false
category: 前端
publishedAt: 2024-01-01T00:00:00.000Z
readingTime: 8
tags:
  - git
date: 2023-12-09
id: git
recommend: false
coverImage: https://haowallpaper.com/link/common/file/previewFileImg/16835107832188288
---

# Git 常用命令速查指南

本文整理了日常开发中最常用的 Git 命令，按使用场景分类，便于快速查阅。每个命令都配有实际使用示例和说明。

## 1. 基础操作

### 1.1. 仓库初始化与克隆

```bash
# 初始化新仓库
git init

# 克隆远程仓库
git clone <repository-url>

# 克隆指定分支
git clone -b <branch-name> <repository-url>
```

### 1.2. 状态查看

```bash
# 查看工作区状态
git status

# 简洁状态显示
git status -sb

# 查看文件变更详情
git diff

# 查看暂存区变更
git diff --staged

# 查看特定文件的变更
git diff <file-name>
```

### 1.3. 配置管理

```bash
# 查看全局配置
git config --global --list

# 设置用户名
git config --global user.name "Your Name"

# 设置邮箱
git config --global user.email "your.email@example.com"

# 设置默认编辑器
git config --global core.editor "code --wait"
```

## 2. 分支管理

### 2.1. 分支操作

```bash
# 查看所有分支
git branch -a

# 查看本地分支
git branch

# 创建新分支
git branch <branch-name>

# 切换分支
git checkout <branch-name>

# 创建并切换分支
git checkout -b <branch-name>

# 删除本地分支
git branch -d <branch-name>

# 强制删除未合并分支
git branch -D <branch-name>

# 重命名分支
git branch -m <new-name>
```

### 2.2. 远程分支

```bash
# 查看远程分支
git branch -r

# 拉取远程分支到本地
git checkout -b <local-branch> origin/<remote-branch>

# 删除远程分支
git push origin --delete <branch-name>

# 推送本地分支到远程
git push -u origin <branch-name>
```

## 3. 提交管理

### 3.1. 暂存与提交

```bash
# 暂存所有文件
git add .

# 暂存指定文件
git add <file-name>

# 交互式暂存
git add -p

# 提交变更
git commit -m "提交信息"

# 暂存并提交已跟踪文件
git commit -am "提交信息"

# 修改上次提交
git commit --amend

# 修改上次提交信息
git commit --amend -m "新的提交信息"
```

### 3.2. 提交历史

```bash
# 查看提交历史
git log

# 简洁历史显示
git log --oneline

# 图形化历史
git log --graph --oneline

# 查看文件历史
git log -p <file-name>

# 查看操作记录
git reflog
```

## 4. 远程操作

### 4.1. 推送与拉取

```bash
# 推送当前分支
git push

# 推送指定分支
git push origin <branch-name>

# 强制推送（谨慎使用）
git push -f

# 拉取远程更新
git pull

# 拉取但不合并
git fetch
```

### 4.2. 远程仓库管理

```bash
# 查看远程仓库
git remote -v

# 添加远程仓库
git remote add <name> <url>

# 移除远程仓库
git remote remove <name>
```

## 5. 合并与变基

### 5.1. 合并分支

```bash
# 合并指定分支到当前分支
git merge <branch-name>

# 安全合并（不自动提交）
git merge --no-commit <branch-name>

# 压缩合并
git merge --squash <branch-name>

# 终止合并
git merge --abort

# 使用特定合并策略
git merge --strategy-option theirs <branch-name>
```

### 5.2. 变基操作

```bash
# 变基到指定分支
git rebase <branch-name>

# 交互式变基
git rebase -i <commit-hash>

# 终止变基
git rebase --abort
```

## 6. 撤销与重置

### 6.1. 撤销操作

```bash
# 撤销工作区修改
git checkout -- <file-name>

# 撤销所有工作区修改
git checkout -- .

# 撤销暂存区修改
git reset HEAD <file-name>

# 撤销所有暂存区修改
git reset HEAD

# 撤销最近一次提交
git reset --soft HEAD~1

# 撤销提交并删除修改
git reset --hard HEAD~1
```

### 6.2. 重置操作

```bash
# 软重置（保留修改）
git reset --soft <commit-hash>

# 混合重置（默认，保留工作区）
git reset --mixed <commit-hash>

# 硬重置（删除所有修改）
git reset --hard <commit-hash>

# 重置到远程分支状态
git reset --hard origin/<branch-name>
```

## 7. 标签管理

### 7.1. 标签操作

```bash
# 查看所有标签
git tag

# 创建轻量标签
git tag <tag-name>

# 创建带注释的标签
git tag -a <tag-name> -m "标签说明"

# 推送标签到远程
git push origin <tag-name>

# 推送所有标签
git push origin --tags

# 删除本地标签
git tag -d <tag-name>

# 删除远程标签
git push origin --delete <tag-name>
```

## 8. 暂存与清理

### 8.1. 暂存操作

```bash
# 暂存当前修改
git stash

# 暂存并添加说明
git stash push -m "暂存说明"

# 查看暂存列表
git stash list

# 应用最新暂存
git stash apply

# 应用指定暂存
git stash apply stash@{n}

# 应用并删除暂存
git stash pop

# 删除暂存
git stash drop stash@{n}

# 清空所有暂存
git stash clear
```

### 8.2. 清理操作

```bash
# 删除未跟踪文件
git clean -f

# 交互式删除未跟踪文件
git clean -i

# 删除未跟踪目录
git clean -fd

# 预览将要删除的文件
git clean -n
```

## 9. 子模块管理

### 9.1. 子模块操作

```bash
# 添加子模块
git submodule add <repository-url> <path>

# 初始化子模块
git submodule init

# 更新子模块
git submodule update

# 更新所有子模块
git submodule update --init --recursive

# 克隆包含子模块的仓库
git clone --recurse-submodules <repository-url>
```

## 10. 高级技巧

### 10.1. 二分查找

```bash
# 开始二分查找
git bisect start

# 标记错误提交
git bisect bad

# 标记正确提交
git bisect good <commit-hash>

# 结束二分查找
git bisect reset
```

### 10.2. 补丁操作

```bash
# 生成补丁
git format-patch <commit-range>

# 应用补丁
git am <patch-file>

# 检查补丁
git apply --check <patch-file>

# 应用补丁（不提交）
git apply <patch-file>
```

### 10.3. 工作流优化

```bash
# 设置默认推送行为
git config --global push.default simple

# 设置默认合并行为
git config --global pull.rebase true

# 设置别名
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status

# 查看别名列表
git config --global --get-regexp alias
```

## 11. 实用脚本与技巧

### 11.1. 常用别名设置

在 `~/.gitconfig` 文件中添加：

```ini
[alias]
  co = checkout
  br = branch
  ci = commit
  st = status
  unstage = reset HEAD --
  last = log -1 HEAD
  lg = log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
```

### 11.2. 批量操作脚本

```bash
# 批量删除已合并的分支
git branch --merged | grep -v "\*" | xargs -n 1 git branch -d

# 批量清理远程已删除的分支
git fetch --prune && git branch -r | awk '{print $1}' | egrep -v -f /dev/fd/0 <(git branch -vv | grep origin) | awk '{print $1}' | xargs git branch -d
```

## 12. 总结

本文涵盖了Git日常开发中最常用的命令，从基础操作到高级技巧都有涉及。记住这些命令可以帮助你：

- 提高版本控制效率
- 避免常见错误
- 更好地管理项目历史
- 与团队协作更加顺畅

建议将常用命令设置为别名，并定期练习使用，以熟练掌握Git的强大功能。
