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
title: "Git常用命令大全"
id: git
recommend: false
coverImage: https://youke1.picui.cn/s1/2025/10/21/68f748ac05973.jpg
---

# Git 常用命令速查指南

本文整理了日常开发中最常用的 Git 命令，按使用场景分类，便于快速查阅。

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

# 强制推送
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

## 6. 撤销与回滚

### 6.1. 撤销工作区修改

```bash
# 撤销工作区修改
git checkout -- <file-name>

# 撤销所有工作区修改
git checkout -- .
```

### 6.2. 撤销暂存区修改

```bash
# 从暂存区移除文件
git reset <file-name>

# 清空暂存区
git reset
```

### 6.3. 回滚提交

```bash
# 软回滚（保留修改）
git reset --soft <commit-hash>

# 混合回滚（默认）
git reset --mixed <commit-hash>

# 硬回滚（删除修改）
git reset --hard <commit-hash>

# 撤销指定提交
git revert <commit-hash>
```

## 7. 贮藏与清理

### 7.1. 贮藏操作

```bash
# 贮藏当前修改
git stash

# 贮藏并添加描述
git stash push -m "描述信息"

# 查看贮藏列表
git stash list

# 应用贮藏
git stash apply

# 应用并删除贮藏
git stash pop

# 删除贮藏
git stash drop
```

### 7.2. 清理工作区

```bash
# 清理未跟踪文件
git clean -fd

# 交互式清理
git clean -i
```

## 8. 标签管理

```bash
# 查看标签
git tag

# 创建轻量标签
git tag <tag-name>

# 创建附注标签
git tag -a <tag-name> -m "标签信息"

# 推送标签
git push origin <tag-name>

# 推送所有标签
git push origin --tags

# 删除标签
git tag -d <tag-name>

# 删除远程标签
git push origin --delete <tag-name>
```

## 9. 配置与别名

### 9.1. 配置管理

```bash
# 查看配置
git config --list

# 设置用户名
git config user.name "用户名"

# 设置邮箱
git config user.email "邮箱"

# 设置默认编辑器
git config core.editor vim
```

### 9.2. 常用别名

```bash
# 设置别名
git config --global alias.st "status -sb"
git config --global alias.ci "commit"
git config --global alias.co "checkout"
git config --global alias.br "branch"
```

## 10. 实用技巧

### 10.1. 文件追踪

```bash
# 查看文件每一行的修改历史
git blame <file-name>

# 查找包含关键字的提交
git log --all --grep="关键字"
```

### 10.2. 选择性合并

```bash
# 合并指定提交
git cherry-pick <commit-hash>

# 合并指定文件
git checkout <branch-name> -- <file-path>
```

## 总结

本文涵盖了 Git 日常开发中最常用的命令，建议根据实际使用频率重点掌握：

- **高频命令**: `git status`, `git add`, `git commit`, `git push`, `git pull`, `git checkout`
- **中频命令**: `git branch`, `git merge`, `git log`, `git diff`, `git stash`
- **低频命令**: `git rebase`, `git reset`, `git tag`, `git cherry-pick`

掌握这些命令能够满足 90% 以上的日常开发需求。对于更高级的功能，建议在实际需要时查阅官方文档。
