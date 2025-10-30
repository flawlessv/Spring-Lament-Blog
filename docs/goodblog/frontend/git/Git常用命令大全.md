---
title: Git常用命令大全
slug: gitsk0hl6
published: true
featured: false
category: 前端
publishedAt: 2025-10-22
readingTime: 6
tags:
  - git
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
# 查看文件变更详情
git diff
```

### 1.3. 配置管理

```bash
# 查看全局配置
git config --global --list

# 设置用户名
git config --global user.name "Your Name"

# 设置邮箱
git config --global user.email "your.email@example.com"

```

## 2. 分支管理

### 2.1. 分支操作

```bash
# 查看所有分支
git branch -a

# 创建新分支
git branch <branch-name>

# 切换分支
git checkout <branch-name>

# 创建并切换分支
git checkout -b <branch-name>

# 删除本地分支
git branch -d <branch-name>

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


# 提交变更
git commit -m "提交信息"

# 修改上次提交
git commit --amend

# 修改上次提交信息
git commit --amend -m "新的提交信息"
```

### 3.2. 提交历史

```bash
# 查看提交历史
git log

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
# 合并指定分支
git merge <branch-name>

# 压缩合并
git merge --squash <branch-name>

# 中止合并
git merge --abort
```

### 5.2. 变基操作

```bash
# 变基到指定分支
git rebase <branch-name>

# 交互式变基
git rebase -i <commit-hash>

# 中止变基
git rebase --abort
```

## 6. 撤销与重置

### 6.1. 撤销操作

```bash
# 撤销工作区修改
git checkout -- <file-name>

# 撤销暂存
git reset HEAD <file-name>

# 撤销最近一次提交
git reset --soft HEAD~1

# 撤销提交并删除修改
git reset --hard HEAD~1
```

### 6.2. 重置操作

```bash
# 软重置（保留修改）
git reset --soft <commit-hash>

# 硬重置（删除所有修改）
git reset --hard <commit-hash>
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

```bash
# 暂存当前修改
git stash

# 查看暂存列表
git stash list

# 应用最新暂存
git stash apply

# 应用并删除暂存
git stash pop

# 清空所有暂存
git stash clear
```

## 9. 精选提交（Cherry-pick）

Cherry-pick 用于将特定的提交应用到当前分支。

```bash
# 应用单个提交
git cherry-pick <commit-hash>

# 应用多个提交
git cherry-pick <commit-hash-1> <commit-hash-2>

# 应用提交范围
git cherry-pick <start-commit>..<end-commit>

# 继续 cherry-pick（解决冲突后）
git cherry-pick --continue

# 中止 cherry-pick
git cherry-pick --abort
```

## 10. 配置与别名

```bash
# 设置用户名和邮箱
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 设置默认推送行为
git config --global push.default simple

# 设置别名
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status

# 查看别名列表
git config --global --get-regexp alias
```

## 11. 总结

本文涵盖了Git日常开发中最常用的命令，从基础操作到高级技巧都有涉及。记住这些命令可以帮助你：

- 提高版本控制效率
- 避免常见错误
- 更好地管理项目历史
- 与团队协作更加顺畅

建议将常用命令设置为别名，并定期练习使用，以熟练掌握Git的强大功能。
