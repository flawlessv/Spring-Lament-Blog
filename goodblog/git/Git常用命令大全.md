---
title: Git常用命令大全
slug: gitsk0hl6
excerpt: - - -
published: true
featured: false
category: frontend
publishedAt: 2024-01-01T00:00:00.000Z
readingTime: 13
---

---

---

- --：“[已提交（committed）](https://link.juejin.cn/?target=http%3A%2F%2Fwkevin.github.io%2FGitChat%2Fgitchat.html%23%25E4%25BF%25AE%25E6%2594%25B9%25E5%25AE%258C%25E4%25BA%2586%25E4%25B8%25BA%25E4%25BB%2580%25E4%25B9%2588%25E4%25B8%258D%25E6%2598%25AF%25E7%259B%25B4%25E6%258E%25A5%25E6%258F%2590%25E4%25BA%25A4%25E8%2580%258C%25E6%2598%25AF-git-add "http://wkevin.github.io/GitChat/gitchat.html#%E4%BF%AE%E6%94%B9%E5%AE%8C%E4%BA%86%E4%B8%BA%E4%BB%80%E4%B9%88%E4%B8%8D%E6%98%AF%E7%9B%B4%E6%8E%A5%E6%8F%90%E4%BA%A4%E8%80%8C%E6%98%AF-git-add")”，已提交相当于`Unmodified`未修改状态。

---

date: 2023-12-09
title: "Git常用命令大全git"
id: git
recommend: false

---

# 常用 Git 命令指南

工作里习惯了通过 Fork（app）使用 Git，这两个月的时间里开始熟悉 Git 的命令行客户端。虽然命令行在视觉上不如 UI 直观，但命令行可以保持双手持续输入不离开键盘，熟悉命令行也更利于寻找最适合自己的 GUI。

另外，界面的直观指的是个人使用上的直观。界面有琳琅满目的信息，鼠标有四面八方的方向，当某个人不熟悉界面的时候，我只能当面告诉他如何执行这些 git 指令：“点这里，这里，这里，往上一点，点顶部菜单栏左侧第二个按钮”，这不如命令行直观。

下面的内容包括了 Git 常用的命令，以及各命令或详或简但有必要的解释说明，其中也包括了很多相关的引用链接用于扩展阅读。

## 推送和拉取

推送：

```
# 推送远程，并设置当前分支的 upstream 为 main，设置之后每次推送当前分支只需要 git push 即可
git push -u origin main

# 推送远程至 upstream，如果没有设置，在 git 2.0 之前，所有同名分支被推送，git 2.0 之后，报错
git push

# 强制推送
git push -f

# 推送至远程，但是设置远程分支名称
git push origin hehe:haha

```

拉取：

```
git checkout -b <local-branch> origin/<remote-branch> # 拉取远程指定分支并检出

```

`git push`的默认行为：默认行为根据 git 配置里的`push.default`的值决定，在 git 2.0 之前的默认值是`matching`，之后的是`simple`，所以在 2.0 之后如果没有设置上游分支 upstream 就会报错。

`push.default`的可选值：

- nothing，禁止`git push`，必须显式指定推送分支，比如`git push origin master`；
- current，把本地分支推送至远程，远程分支名和本地分支名相同；
- upstream，推送到 upstream 上；
- tracking，同上一个`upstream`，不推荐使用；
- simple，推送到 upstream 上，但是要保证 upstream 的分支名和本地分支名相同；
- matching，推送所有的本地和远程相同名称的分支。

设置`local`（仓库）级别的默认推送行为：

```
git config push.default nothing

```

相关链接：

- [Git push与pull的默认行为](https://link.juejin.cn/?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000002783245 "https://segmentfault.com/a/1190000002783245")：解释了什么是`upstream`、`downstream`；
- [`push.default`](https://link.juejin.cn/?target=https%3A%2F%2Fgit-scm.com%2Fdocs%2Fgit-config%23Documentation%2Fgit-config.txt-pushdefault "https://git-scm.com/docs/git-config#Documentation/git-config.txt-pushdefault")：社区文档的解释；
- [What is the difference between 'git pull' and 'git fetch'?](https://link.juejin.cn/?target=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F292357%2Fwhat-is-the-difference-between-git-pull-and-git-fetch "https://stackoverflow.com/questions/292357/what-is-the-difference-between-git-pull-and-git-fetch")：`git pull`和`git fetch`的区别，`git pull = git fetch + git merge FETCH_HEAD`。

## 分支

查看分支：

```
# 查看所有分支
git branch -a

# 查看本地分支
git branch

# 查看远程分支
git branch -r

```

删除分支：

```
# 删除本地分支（删除不了未合并过的分支）
git branch -d feature-album

# 删除未合并过的本地分支
git branch -D feature-album # 大写的 D

# 删除远程分支
git push origin --delete feature-album # 第一种方法
git push origin :refs/branch/feature-album # 第二种方法，这种方法适用在，分支名和标签名相同时，执行第一种方法会冲突报错，则使用这个方法，因为第一种方法也可以用来删除标签

```

检出远程分支：

```
git checkout -b <local-branch> origin/<remote-branch> # 拉取远程指定分支并检出

```

重命名分支（本地）：

```
# 重命名当前分支
git branch -m <new_name> # -m 是 --move 短格式

# 重命名指定分支
git branch -m <old_name> <new_name>

# 在大小写无感的文件系统中重命名分支
git branch -M <New_Name> # 如果不是用 -M，会报错 fatal: 一个分支名 'new_name' 已经存在

```

## 克隆

```
git clone git@github.com:wswmsword/git-learning.git

```

克隆所有分支，并切换到指定分支：

```
git clone -b main git@github.com:wswmsword/git-learning.git # 克隆所有分支，并切换到 main

```

克隆指定分支：

```
git clone -b main --single-branch git@github.com:wswmsword/git-learning.git # 克隆 main

```

克隆指定文件夹（git 2.25+ (Q1 2020)）：

```
mkdir git-sparse-checkout && cd git-sparse-checkout # 创建并进入文件夹
git init -q # 静默初始化
git remote add origin git@github.com:wswmsword/git-learning.git
git sparse-checkout set assets # 设置指定文件夹，文件夹路径为 assets
git pull origin main
ls # assets
git sparse-checkout disable # 关闭 sparse-checkout

```

旧版本的 git 克隆指定文件夹：

```
mkdir git-sparse-checkout-old && cd git-sparse-checkout-old
git init -q
git remote add origin git@github.com:wswmsword/git-learning.git
git config --global core.sparseCheckout true
echo "assets" >> .git/info/sparse-checkout
git pull origin main

```

相关链接：

- [How to disable sparse checkout after enabled?](https://link.juejin.cn/?target=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F36190800%2Fhow-to-disable-sparse-checkout-after-enabled "https://stackoverflow.com/questions/36190800/how-to-disable-sparse-checkout-after-enabled")：打开稀疏检出后如何关闭？回答中有使用老版本的 git 关闭答案。回答中提到了一个脚本。
- [sparse_checkout.sh](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Ftrilinos%2FTrilinos%2Fblob%2Fmaster%2Fsparse_checkout.sh "https://github.com/trilinos/Trilinos/blob/master/sparse_checkout.sh")：第一条中提到的脚本。
- [sparse-checkout](https://link.juejin.cn/?target=https%3A%2F%2Fgit-scm.com%2Fdocs%2Fgit-sparse-checkout "https://git-scm.com/docs/git-sparse-checkout")：git 的稀疏检出社区文档。

## 提交

暂存：

```
git add . # 暂存所有改动文件
git add -e <filename> # 把一个文件里的部分行移至暂存，暂存一部分
git add -p <filename> # 交互式，执行后将输出选项供选择，选择 e 可以暂存一部分
git add -u # 除未跟踪的文件外，把所有文件暂存
git add --ignore-removal . # 除已删除的文件外，暂存所有的文件

```

提交：

```
# 提交，添加信息
git commit -m "junior commit"

# 提交指定文件（这里的文件是 file-abc）
git commit file-abc -m "add single file"

# 提交，打开默认编辑器编辑提交信息
git commit

# 暂存已跟踪的文件，同时提交（省略了 git add 命令，但是这里只能暂存已跟踪文件）
git commit -am "junior commit"

# 提交，打开默认编辑器编辑提交信息，包含 diff 信息
git commit -v

# 提交，允许空提交信息
git commit --allow-empty-message

# 修改上一次提交
git commit --amend -m "better message was committed"

# 打开默认编辑器，修改上次提交信息
git commit --amend

# 修改上次提交的邮箱
git commit --amend --author "New Authorname <authoremail@mydomain.com>"

```

检出某一条提交记录：

```
git checkout <commit-hash>

```

`git add -A`、`git add .`、`git add -u`的区别（Git 2.x）：

| 命令（Git 2.x）            | 新文件 | 修改的文件 | 删除的文件 | 描述                                         |
| :------------------------- | :----- | :--------- | :--------- | :------------------------------------------- |
| git add -A                 | √      | √          | √          | 暂存所有（新的、修改的、删除的）文件         |
| git add .                  | √      | √          | √          | 暂存所有（新的、修改的、删除的）文件         |
| git add -u                 | ×      | √          | √          | 暂存修改的和删除的文件，不暂存未跟踪的新文件 |
| git add --ignore-removal . | √      | √          | ×          | 暂存新文件和修改的文件，不暂存删除的文件     |

在 Git 2.0 之前的版本，`git add .`不能暂存已删除的文件。

相关链接：

- [Git 2.0, git add -A is default](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fgit%2Fgit%2Fblob%2Fmaster%2FDocumentation%2FRelNotes%2F2.0.0.txt%23L32-L36 "https://github.com/git/git/blob/master/Documentation/RelNotes/2.0.0.txt#L32-L36")：git 源码里的文档，提到了`git add <path>`在 Git 2.0 版本之后，执行的效果和`git add -A <path>`相同；
- [What's the difference between `git add .` and `git add -u`?](https://link.juejin.cn/?target=https%3A%2F%2Fstackoverflow.com%2Fa%2F2190440 "https://stackoverflow.com/a/2190440")。
- [git add .与git add -A的区别(版本不同时候的区别)](https://link.juejin.cn/?target=https%3A%2F%2Fblog.csdn.net%2Fmy466879168%2Farticle%2Fdetails%2F107584358 "https://blog.csdn.net/my466879168/article/details/107584358")：1.x 和 2.x 版本之间 add 命令的区别。

## 合并

```
# 指定分支合并到当前分支
git merge feature-album

# 安全合并
git merge --no-ff --no-commit my-branch # --no-commit 不自动提交，--no-ff 不使用 fast-forward（快进）

# 合并的时候把一个分支合并成一条记录
git merge --squash feature-album

# 合并分支不提交记录
git merge feature-album --no-commit

# 终止合并（解决冲突的阶段）
git merge --abort

```

合并其它分支的一个文件：

```
git checkout --patch testing-merge-file features/album/audio-formats # 合并 testing-merge-file 分支的 features/album/audio-formats 文件

```

执行完上面的命令后进入优选项的交互界面，选择 e（manually edit the current hunk），进行文件的冲突编辑，最后保存，文件会在暂存区内。

如果命令中不加`--patch`，执行完命令的行为是当前分支的文件被指定分支的文件覆盖：

```
git checkout testing-merge-file features/album/audio-formats # 当前分支的文件 features/album/audio-formats 被 testing-merge-file 分支的覆盖

```

关于`git merge <branch>`在`fast-forward`情况下和`git rebase <branch>`的区别：

目标分支超过主分支，并且主分支没有新的提交记录，

```
            *E-*F-*G-*H-*I    BRANCH
           /
*A-*B-*C-*D                   MAIN

```

，`fast-forward`和`git rebase`合并的效果一样，

```
*A-*B-*C-*D-*E-*F-*G-*H-*I MAIN | BRANCH

```

，当主分支有了新的提交（J、K），

```
            *E-*F-*G-*H-*I    BRANCH
           /
*A-*B-*C-*D-*J-*K             MAIN

```

，就无法使用`fast-forward`，合并之后必须有一个单独的合并节点，但是`git rebase`仍然可以合并，并且能保持提交线的整洁，

```
*A-*B-*C-*D-*J-*K-*E'-*F'-*G'-*H'-*I'             MAIN | BRANCH

```

，有冲突的节点因为解决冲突会生成新的`commit-id`，有相同提交的记录会被目标分支的节点覆盖，`rebase`的节点也不一定是连续的，可能会穿插到主分支已经提交的节点中（按提交先后）。

关于三方合并：

```
            master
             |
*C0-*C1-*C2-*C4
          \
           *C3-*C5
                |
               iss53

```

在这样的分支结构中，要把`iss53`合并到`master`，要使用`C4`、`C5`和公共祖先`C2`，这三个节点做一个三方合并。

三方合并有利于自动合并：例如，节点 C2 有文件 F 包含内容

```
一
二


```

，节点 C4 的文件 F 包含内容

```

二


```

，节点 C5 的文件 F 包含内容

```
一
二
三

```

，现在把`iss53`合并至`master`，因为三方合并，文件 F 的内容变成了

```

二
三

```

，因为 C4 在 C2 的基础上清空了第一行，C5 在 C2 的基础上填补了第三行，C2、C4、C5 都有第二行，所以合并的结果是清空第一行、保留第二行和填补第三行，这其中需要公共祖先 C2 的参与。

提示：当合并解决完冲突后，修改提交信息，“添加一些细节给未来检视这个合并的读者一些帮助，告诉他们你是如何解决合并冲突的，以及理由是什么”。

相关链接：

- [合并 (版本控制)](<https://link.juejin.cn/?target=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2F%25E5%2590%2588%25E5%25B9%25B6_(%25E7%2589%2588%25E6%259C%25AC%25E6%258E%25A7%25E5%2588%25B6)> "https://zh.wikipedia.org/wiki/%E5%90%88%E5%B9%B6_(%E7%89%88%E6%9C%AC%E6%8E%A7%E5%88%B6)")：维基的合并解释，包括三方合并；
- [怎么理解Git里的 "three-way merge" ？ - Lazykid的回答 - 知乎](https://link.juejin.cn/?target=https%3A%2F%2Fwww.zhihu.com%2Fquestion%2F30200228%2Fanswer%2F866309494 "https://www.zhihu.com/question/30200228/answer/866309494")：三方合并解释；
- [How to merge specific files from Git branches](https://link.juejin.cn/?target=https%3A%2F%2Fstackoverflow.com%2Fa%2F33168094 "https://stackoverflow.com/a/33168094")：stackoverflow 的推荐回答；
- [3.2 Git 分支 - 分支的新建与合并](https://link.juejin.cn/?target=https%3A%2F%2Fgit-scm.com%2Fbook%2Fzh%2Fv2%2FGit-%25E5%2588%2586%25E6%2594%25AF-%25E5%2588%2586%25E6%2594%25AF%25E7%259A%2584%25E6%2596%25B0%25E5%25BB%25BA%25E4%25B8%258E%25E5%2590%2588%25E5%25B9%25B6 "https://git-scm.com/book/zh/v2/Git-%E5%88%86%E6%94%AF-%E5%88%86%E6%94%AF%E7%9A%84%E6%96%B0%E5%BB%BA%E4%B8%8E%E5%90%88%E5%B9%B6")：社区文档；
- [Git Merge Fast-Forward vs Git Rebase](https://link.juejin.cn/?target=https%3A%2F%2Fstackoverflow.com%2Fa%2F70627815 "https://stackoverflow.com/a/70627815")：StackOverflow 上关于`fast-forward`和`rebase`区别的答案。

## 变基 rebase

> 首先要提一下 rebase 的意思，我擅自的直譯是「重新 (re-) 定義某個 branch 的參考基準 (base)」。把這個意思先記起來，比較容易理解 rebase 的運作原理。就好比移花接木那樣（稼接），把某個樹枝接到別的樹枝。——[Git-rebase 小筆記](https://link.juejin.cn/?target=https%3A%2F%2Fblog.yorkxin.org%2Fposts%2Fgit-rebase.html "https://blog.yorkxin.org/posts/git-rebase.html")

利用变基合并几条提交记录：

```
git rebase -i <commit_id_start> <commit_id_end> # 前开后闭

```

下面是利用变基合并 5 条记录的例子：

合并`22bafc6`以上的记录至`4f4a863`共 5 条，执行上面的命令后（这里是`git rebase -i 22bafc6 4f4a863`），默认编辑器将打开类似下面的文件：

```
pick 478a9ab add album/history
pick 63e6dd5 add album/length
pick 0d72816 add album/tracks
pick d49335e add album/audio-formats
pick 4f4a863 add album/types

# 变基 22bafc6..4f4a863 到 22bafc6（5 个提交）
#
# 命令:
# p, pick <提交> = 使用提交
# r, reword <提交> = 使用提交，但编辑提交说明
# e, edit <提交> = 使用提交，但停止以便在 shell 中修补提交
# s, squash <提交> = 使用提交，但挤压到前一个提交
# f, fixup [-C | -c] <提交> = 类似于 "squash"，但只保留前一个提交
#                    的提交说明，除非使用了 -C 参数，此情况下则只
#                    保留本提交说明。使用 -c 和 -C 类似，但会打开
#                    编辑器修改提交说明
# x, exec <命令> = 使用 shell 运行命令（此行剩余部分）
# b, break = 在此处停止（使用 'git rebase --continue' 继续变基）
# d, drop <提交> = 删除提交
# l, label <label> = 为当前 HEAD 打上标记
# t, reset <label> = 重置 HEAD 到该标记
# m, merge [-C <commit> | -c <commit>] <label> [# <oneline>]
# .       创建一个合并提交，并使用原始的合并提交说明（如果没有指定
# .       原始提交，使用注释部分的 oneline 作为提交说明）。使用
# .       -c <提交> 可以编辑提交说明。
#
# 可以对这些行重新排序，将从上至下执行。
#
# 如果您在这里删除一行，对应的提交将会丢失。
#
# 然而，如果您删除全部内容，变基操作将会终止。
#

```

编辑，将前 2-5 行的`pick`改为`s`（s 代表上面注释里的 squash），表示这 4 条记录将合并到第一条记录中，最后保存：

```
pick 478a9ab add album/history
s 63e6dd5 add album/length
s 0d72816 add album/tracks
s d49335e add album/audio-formats
s 4f4a863 add album/types

# ...省略

```

然后，默认编辑器会进入第二个文件，用于修改合并这 5 条记录的提交信息。

进行编辑，在第一行添加提交信息（`add album features`），最后保存：

```
add album features
# 这是一个 5 个提交的组合。
# 这是第一个提交说明：

add album/history

# 这是提交说明 #2：

add album/length

# 这是提交说明 #3：

add album/tracks

# 这是提交说明 #4：

add album/audio-formats

# 这是提交说明 #5：

add album/types

# ...省略

```

完成上面的步骤之后，就生成了一条记录，这条记录包含了原分支从`22bafc6`到`4f4a863`的 5 条记录，git 的`HEAD`（头指针）会指向这条提交记录上。但是现在，这条记录不属于任何分支，所以一旦切换分支，这条记录就会丢失。

如果要把这条记录合回原分支：

```
git checkout -b rebased-album-features # 从 HEAD 检出分支
git checkout feature-album # 检出原分支（feature-album）
git reset --hard 22bafc6 # 回滚到五条合并命令前（注意：操作将清空工作区和暂存区）
git rebase rebased-album-features

```

![git rebase -i](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/80b874d31c1b4793ad1b2e01abe5c349~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.image?)

---

变基代替合并：

```
git rebase feature-album # 分支 feature-album 变基到当前分支

```

相关链接：

- [“git 小白求助，怎样优雅的回滚过去某次错误的 merge，并保留 merge 之后 commit 的改动”](https://link.juejin.cn/?target=https%3A%2F%2Fwww.v2ex.com%2Ft%2F883095 "https://www.v2ex.com/t/883095")；
- [Git-rebase 小筆記](https://link.juejin.cn/?target=https%3A%2F%2Fblog.yorkxin.org%2Fposts%2Fgit-rebase.html "https://blog.yorkxin.org/posts/git-rebase.html")。

## 文件的四种状态

`Untracked`、`Staged`、`Unmodified`、`Modified`

- Untracked（未跟踪）
  - 第一次新建的文件，没有`git add`过的文件，或者`git rm --cached`过的文件；
- Staged（暂存）
  - `git add`过的文件都是`staged`状态；
- Unmodified（未修改）
  - `git commit`后的文件是未修改状态；
- Modified（已修改）
  - `git commit`之后，对文件进行修改，当前为已修改状态。

也有文档解释中多出第五种状态---：“[已提交（committed）](https://link.juejin.cn/?target=http%3A%2F%2Fwkevin.github.io%2FGitChat%2Fgitchat.html%23%25E4%25BF%25AE%25E6%2594%25B9%25E5%25AE%258C%25E4%25BA%2586%25E4%25B8%25BA%25E4%25BB%2580%25E4%25B9%2588%25E4%25B8%258D%25E6%2598%25AF%25E7%259B%25B4%25E6%258E%25A5%25E6%258F%2590%25E4%25BA%25A4%25E8%2580%258C%25E6%2598%25AF-git-add "http://wkevin.github.io/GitChat/gitchat.html#%E4%BF%AE%E6%94%B9%E5%AE%8C%E4%BA%86%E4%B8%BA%E4%BB%80%E4%B9%88%E4%B8%8D%E6%98%AF%E7%9B%B4%E6%8E%A5%E6%8F%90%E4%BA%A4%E8%80%8C%E6%98%AF-git-add")”，已提交相当于`Unmodified`未修改状态。

## 日志

简洁日志，包括短 id 和提交信息：“`git log --oneline`”。

图形形式的提交记录，包括短 id，提交信息，相对时间，作者名称：

```
git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
# 这一段命令很长，为了方便，后面介绍了用别名代替这条命令的方法
# --abbrev-commit 的意思是，展示缩写的 commit_id，abbreviation

```

![git log --graph](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a097e324a2145928b118cf26f657bd9~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.image?)

用关键字过滤日志：

```
git log --all --grep="microsoft" # 查询包含“microsoft”的提交记录
git log --all --oneline --grep="microsoft" # 查询包含“microsoft”的提交记录，查询结果只包含 8 位 hash 和提交信息

```

使用`reflog`查看操作历史（`reflog`是本地的，无法通过`git pull`得到）：

```
git reflog

```

```
# 查看某一个文件的提交记录
git log -p <file> # -p 查看具体的 diff

# 展示所有的提交记录，例如在某个分支需要查看最新的提交信息时，可以使用这条命令
git log --oneline --all # 参数 --all 表示展示所有提交记录

# 查看指定分支的提交记录
git log --oneline <branch_name> # 这条命令会展示包括合并分支的所有细节提交记录，可以用选项 --first-parent 来只展示合并节点，方便阅读

# 查看指定分支的提交记录（合并分支的提交记录只选择展示最后的合并节点）
git log --oneline --first-parent <branch_name>

```

`git log`其它配置的命令：

```
git log -p [<file-name> | <commit>]# 显示差异
git log -g # 查看所有提交记录，包括 amend 的
git log --stat # 显示文件更改列表
git log --pretty=oneline # 一行显示提交信息
git log --pretty=short
git log --pretty=medium
git log --pretty=full
git log --pretty=fuller
git log --pretty=reference
git log --pretty=email
git log --pretty=raw
git reflog # 更多的记录
git log --oneline # 一行显示，更紧凑，哈希更短
git log --graph
git log --graph --oneline # 紧凑，短 commit-id
git log --pretty="%C(yellow) Hash: %h %C(blue)Date: %ad %C(red) Message: %s " --date=human
git log --pretty="%C(yellow) Hash: %h %C(blue)Date: %ad %C(red) Message: %s " --date=short
git log --relative-date # 相对时间
git shortlog # 按作者，只展示注释日志
git log --author=wswmsword # 只看某人（wswmsword）的提交
git log --pretty=format:'%h %ad %an %s' --date=local # hash、日期、作者、信息，短格式的日期

```

`format` 的参数：

- %h：commit hash
- %ai: author date
- %an: author name
- %ci: commit date
- %cn: commit name
- %s: log message

前面提到的图形形式的提交记录命令很长，如果常用，为它设置别名会更方便：

```
git config --global alias.gg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"

```

，这样设置后再执行命令`git gg`就相当于执行了`git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit`。

相关链接：

- [Pretty Git branch graphs](https://link.juejin.cn/?target=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F1057564%2Fpretty-git-branch-graphs "https://stackoverflow.com/questions/1057564/pretty-git-branch-graphs")。

## 忽略文件

有两种忽略文件或文件夹的方法，一，编辑项目内的`.git/info/exclude`文件，在文件里添加需要忽略的文件或文件夹，二，在项目里添加`.gitignore`文件，在文件里添加需要忽略的文件或文件夹。

第一种编辑`.git/info/exclude`的方法适合忽略偏个人的、不普遍的文件。例如，如果项目中每位开发者的开发工具不同，而有的开发工具会生成各自的配置文件，这样的配置文件可能不适合放在`.gitignore`中，否则多一个不同的开发工具就会多一条忽略记录。

第二种创建`.gitignore`文件的方法适合忽略通用的文件。例如`*.log`之类的日志文件。`.gitignore`可以被创建在不同的文件夹里，同时也会被当作项目的一部分，被 Git 跟踪管理。

创建`.gitignore`文件，在其中加入要忽略的文件或文件夹。

```
.DS_Store

```

相关链接：

- [Git常用命令整理八(忽略文件)](https://link.juejin.cn/?target=http%3A%2F%2Fniliu.me%2Farticles%2F2841.html "http://niliu.me/articles/2841.html")；
- “[When would you use .git/info/exclude instead of .gitignore to exclude files?](https://link.juejin.cn/?target=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F22906851%2Fwhen-would-you-use-git-info-exclude-instead-of-gitignore-to-exclude-files "https://stackoverflow.com/questions/22906851/when-would-you-use-git-info-exclude-instead-of-gitignore-to-exclude-files")”。

## 比较差异

```
# 对比暂存区差异
git diff --staged

# 对比工作区差异
git diff

# 和上一次提交对比
git diff HEAD~

```

## diff 工具

- 下载 diff 前端，这里是 [Meld](https://link.juejin.cn/?target=http%3A%2F%2Fmeldmerge.org%2F "http://meldmerge.org/")（其它 diff 工具：[Beyond Compare](https://link.juejin.cn/?target=https%3A%2F%2Fwww.scootersoftware.com%2F "https://www.scootersoftware.com/")、[Araxis Merge](https://link.juejin.cn/?target=https%3A%2F%2Fwww.araxis.com%2F "https://www.araxis.com/")、[DiffMerge](https://link.juejin.cn/?target=http%3A%2F%2Fwww.sourcegear.com%2Fdiffmerge%2Fdownloads.php "http://www.sourcegear.com/diffmerge/downloads.php")）
- 添加配置，编辑`~/.gitconfig`

```
[diff]
  tool = meld
[difftool]
  prompt = false
[difftool "meld"]
  trustExitCode = true
  cmd = open -W -a Meld --args \"$LOCAL\" \"$PWD/$REMOTE\"
[merge]
  tool = meld
[mergetool]
  prompt = false
[mergetool "meld"]
  trustExitCode = true
  cmd = open -W -a Meld --args --auto-merge \"$PWD/$LOCAL\" \"$PWD/$BASE\" \"$PWD/$REMOTE\" --output=\"$PWD/$MERGED\"

```

这样设置后，执行`git difftool`打开 diff 工具进行文件比较。

## 补丁

生成一个补丁文件，自己或者分享其他人使用，举例：

```
git diff HEAD~ HEAD > patch-abc # 上次提交和倒数第二次提交的变更，生成补丁

```

这是生成的补丁文件，名称`patch-abc`：

```
diff --git a/.gitignore b/.gitignore
new file mode 100644
index 0000000..5ca0973
--- /dev/null
+++ b/.gitignore
@@ -0,0 +1,2 @@
+.DS_Store
+

```

```
git checkout HEAD~ # 把头移动到倒数第二次提交
git apply --check patch-abc # 检查能不能添加补丁
git apply patch-abc # 添加补丁，如果不能添加会提示失败

```

## 标签

标签分为“附注标签”和“轻量标签”，附注标签包含很多信息，例如标签的作者、邮箱、日期时间等，而轻量标签只是简单的引用，是指向标签所在 commit 的指针。

```
# 查看本地标签
git tag

# 查看远程标签
git ls-remote --tags origin

# 特定模式（通配符）查找标签
git tag -l "chill-v*"

# 打标签（附注标签，包含标签作者、邮箱等信息，annotated tag）
git tag -a chill-tag -m "truly hot" # 如果添加标签信息，只有 -m 参数的时候，不加 -a，生成的标签同样是附注标签

# 打标签（轻量标签，commit 的指针，lightweight tag）
git tag hot-day # 当前 commit 生成名为 hot-day 的标签

# 给之前的 commit 打标签
git tag -a old-tag "all those years ago" <commit_id>

# 推送所有本地标签
git push origin --tags

# 推送指定标签
git push origin more-tag # 推送名为 more-tag 的标签

# 删除本地标签
git tag -d more-tag

# 删除远程标签
git push origin --delete more-tag # 第一种方法
git push origin :refs/tags/more-tag # 第二种方法，这种方法适用在，分支名和标签名相同时，执行第一种方法会冲突报错，则使用这个方法

# 检出标签
git checkout hot-day

# 查看标签的详细信息
git show hot-day

# 找到删除的标签所在的 commit
git fsck --unreachable | grep tag

```

点击查看[开源项目 React 创建的所有标签](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Ffacebook%2Freact%2Ftags "https://github.com/facebook/react/tags")。

## 贮藏

```
# 查看贮藏列表
git stash list

# 添加贮藏，添加信息
git stash push -m "stash then go the other branch to fix bug" # 不添加信息，直接执行 git stash push

# 删除贮藏
git stash drop stash@{0} # 删除贮藏 stash@{0}，stash@{0} 代表贮藏的编号，所有贮藏编号使用 git stash list 查看，如果不指定 stash@{0} 将删除最近的贮藏

# 应用贮藏
git stash apply stash@{0} # 不指定 stash@{0}，即直接执行 git stash apply 将应用最顶部（最近添加的）贮藏

# 推出贮藏（应用并删除最顶部贮藏）
git stash pop

# 添加贮藏（包括未跟踪文件）
git stash -u # -u 即 --include-untracked，`git stash` == `git stash push`，如果要添加信息，添加 -m

# 交互式添加贮藏（看到 diff，给选项进行选择是否添加贮藏）
git stash --patch

# 切新分支并应用贮藏
git stash branch <branch-name>

# 查看贮藏内容
git stash show -p # -p 显示详细信息

# 清除未跟踪文件（交互式 -i）
git clean -d -i

# ?
git stash apply --index # ?

```

旧版本的`git stash save`从 Git2.16.0 起被弃用，点击[查看](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fgit%2Fgit%2Fblob%2F2512f15446149235156528dafbe75930c712b29e%2FDocumentation%2FRelNotes%2F2.16.0.txt%23L34 "https://github.com/git/git/blob/2512f15446149235156528dafbe75930c712b29e/Documentation/RelNotes/2.16.0.txt#L34")。

相关链接：“[What's the difference between git stash save and git stash push?](https://link.juejin.cn/?target=https%3A%2F%2Fstackoverflow.com%2Fa%2F71040797 "https://stackoverflow.com/a/71040797")”。

## 遴选

```
# 遴选一条记录
git cherry-pick <commit-hash>
# 遴选多条记录（不连续）
git cherry-pick <commit-hash-a> <commit-hash-b>
# 遴选连续的多条记录（前开后闭）
git cherry-pick <commit-hash-a>...<commit-hash-c>
# 添加配置项 -n，遴选不产生提交记录，只更新工作去与暂存区
git cherry-pick -n <commit-hash>

```

什么是遴选：在下面的分支图里，如果 MAIN 分支需要 BRANCH 分支的节点`H`的改动，可以通过`遴选`把节点`H`添加到节点`E`的后面。

```
            *F-*G-*H-*I          BRANCH
           /
*A-*B-*C-*D-*E                   MAIN

```

从 BRANCH 分支遴选节点`H`至主分支：

```
            *F-*G-*H-*I          BRANCH
           /
*A-*B-*C-*D-*E-*H'               MAIN

```

相关链接：

- [git cherry-pick 教程](https://link.juejin.cn/?target=https%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2020%2F04%2Fgit-cherry-pick.html "https://www.ruanyifeng.com/blog/2020/04/git-cherry-pick.html")。

## 回滚、撤销、重置

`git reset`：

```
git reset HEAD@{1} # HEAD@{1} 指的是执行`git reflog`后看到的记录 id，HEAD@{1} 是倒数第二条，HEAD@{0} 是倒数第一条，以此类推
git reset --soft <commit-hash> # 回退至 commit-hash 处，commit-hash 和当前的差异被放在暂存区
git reset # 所有暂存区的文件回到工作区
git reset --keep <commit-hash> # ?
git reset --merge <commit-hash> # ?

```

`git revert`：

```
git revert <commit-id> # 反转并提交
git revert -n <commit-id> # 反转，不提交，需要继续执行 git revert --continue，或者终止反转，git revert --abort
git revert -n <commit-id-start>..<commit-id-end> # 前开后闭，反转几个（一段）提交
git revert HEAD@{1} # 反转最近提交

```

撤销某个文件至指定 commit 时的状态：

```
git checkout <commit-hash> -- <path/to/file>

```

关于`git reset`中的`soft`、`mixed`和`hard`：

- `--soft`：当前（还没`reset`）工作区和暂存区的改动不变，还在原位，`reset`之后有了差异，差异在暂存区中；
- `--mixed`：默认类型，`reset`前后所有改动都移到工作区中，包括原来在暂存区的，也移到工作区中；
- `--hard`：清空工作区和暂存区的改动，直接将 HEAD 指向`reset`的指向，使用时要注意。

关于工作区、暂存区、History：工作区修改，`add`至暂存区，`commit`至 History。

一些名词：

- 工作区：Working directory，Working Copy；
- 暂存区：Index，索引，Staging area，Stage/Index；
- History：HEAD 指的地方，提交记录的地方，Repository。

相关链接：

- [What's the difference between git reset --mixed, --soft, and --hard?](https://link.juejin.cn/?target=https%3A%2F%2Fstackoverflow.com%2Fa%2F50022436 "https://stackoverflow.com/a/50022436")
- [常用 Git 命令清单-九、撤销](https://link.juejin.cn/?target=https%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2015%2F12%2Fgit-cheat-sheet.html "https://www.ruanyifeng.com/blog/2015/12/git-cheat-sheet.html")

## 责怪

```
git blame <file_name> # 查看文件每一行的修改记录，包括作者、日期和内容
git blame -L 6,9 <file_name> # 指定行数范围查看文件的修改记录
git blame -enl -L 6,9 <file_name> # 组合查询，包括邮箱，行数，完整哈希

```

类似 VSCode 上安装插件 GitLens 之后的效果，鼠标点击某一行后，会在那一行后面出现最近一次该行的提交信息，有时候会把这个信息当成代码注释。

GitLens 第 26 行的`git blame -L 26,26 .internal/baseUniq.js`的效果：

!['git blame' in VSCode with GitLens: line 26](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4b1ec7c8e284564b855166c4e482440~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.image?)

## 配置

查看配置：

```
git config --global --list # 查看配置表
git config --global --get user.name # 查看用户名（global 级别）
git config --global --get user.email # 查看用户邮箱（global 级别）

```

修改用户名和邮箱：

```
git config user.name "wswmsword" # 设置用户名（local 级别）
git config user.email "cjzjzzz@gmail.com" # 设置邮箱（local 级别）

```

配置文件的级别：`system`、`global`、`local`。

配置默认编辑器：

```
# 常用编辑器：emacs / nano / vim / vi
git config --global core.editor emacs

```

编辑配置文件：

```
git config -e # 等价 vim .git/config
# 可加 --global，--system

```

设置文件大小写敏感：

```
git config --global core.ignorecase false # git 默认忽略大小写

```

## 别名

设置命令的别名：

```
git config --global alias.haha  "status -sb" # 相当于 git status -sb
git config --global alias.ci  "commit" # 相当于 git commit

```

删除命令的别名：删除`.git/config`里对应别名所在行，如果是全局的别名，删除`~/.gitconfig`里对应别名所在行，或者：

```
git config --global --unset alias.haha # unset

```

自定义简短 log msg：

```
git config --global --replace-all alias.lg "log --pretty=format:'%h %ad %an %s' --date=local"

```

## 子模块

```
git submodule add https://github.com/wswmsword/git-submodule lyrics # 添加一个子模块，路径是 ./lyrics
git pull --recurse-submodules # 递归子模块拉取
git config submodule.recurse true
git submodule update --init # git pull 后拉取子模块内容

```

```
git submodule add ./submarines # 本地仓库添加子模块
git submodule init
git submodule update
git submodule update --remote # 更新子模块至远程最新的提交记录

```

```
git submodule foreach "<git command>" # 对每个子模块执行 git 命令

```

```
git clone --recursive https://github.com/wswmsword/git-learning # 克隆项目，递归克隆子项目

```

删除子模块：

```
# step 1
git rm submarines # 删除文件夹 submarines（submarines 是子模块仓库）
# step 2
rm -rf .git/modules/submarines
# step 3
vim .git/config # 删除 config 文件里的 submodule 配置，形如下面这一段
# [submodule "submarines"]
#     active = true
#     url = https://github.com/xxxxxxx.git

```

相关链接：

- [How to git submodule tutorial](https://link.juejin.cn/?target=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DZYq3NJnO08U "https://www.youtube.com/watch?v=ZYq3NJnO08U")—— YouTube 视频；
- [Git子模块](https://link.juejin.cn/?target=https%3A%2F%2Fblog.csdn.net%2Fweixin_37015703%2Farticle%2Fdetails%2F123978159 "https://blog.csdn.net/weixin_37015703/article/details/123978159")—— CSDN 文章，提到了子模块更新父模块为更新的情况；
- [7.11 Git 工具 - 子模块](https://link.juejin.cn/?target=https%3A%2F%2Fgit-scm.com%2Fbook%2Fzh%2Fv2%2FGit-%25E5%25B7%25A5%25E5%2585%25B7-%25E5%25AD%2590%25E6%25A8%25A1%25E5%259D%2597 "https://git-scm.com/book/zh/v2/Git-%E5%B7%A5%E5%85%B7-%E5%AD%90%E6%A8%A1%E5%9D%97")—— Git 社区文档。

## 二分查找

使用`git bisect`命令，用二分法找到第一条出错的提交记录。

```
git bisect start <节点> <祖先节点>
# 例如，git bisect start HEAD 4d83cfc

# 如果代码没有错误，就进行标记 good，git 接下来会向后代继续查找
git bisect good

# 如果代码出现了错误，就进行标记 bad，git 接下来会向祖先继续查找
git bisect bad

# 退出查找
git bisect reset

```

在最后一步标记后，git 会提示我们“<commit_id> is the first bad commit”。

相关链接：

- [Bisectercise](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fbradleyboy%2Fbisectercise "https://github.com/bradleyboy/bisectercise")——Github 仓库，克隆下来用于练习“git bisect”；
- [git bisect 命令教程](https://link.juejin.cn/?target=http%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2018%2F12%2Fgit-bisect.html "http://www.ruanyifeng.com/blog/2018/12/git-bisect.html")；
- [git-bisect](https://link.juejin.cn/?target=https%3A%2F%2Fgit-scm.com%2Fdocs%2Fgit-bisect "https://git-scm.com/docs/git-bisect")——社区文档。

## GUI

- [magit](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fmagit%2Fmagit "https://github.com/magit/magit")：Emacs git 客户端
- [fork](https://link.juejin.cn/?target=https%3A%2F%2Fgit-fork.com%2F "https://git-fork.com/")：Mac git 客户端，简洁，方便，反应快
- [lazygit](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fjesseduffield%2Flazygit "https://github.com/jesseduffield/lazygit")：命令行 git 客户端

## 修改文件名称的大小写

```
git mv SONG song2
git mv song2 song
git add .
git commit -m "rename 'song'"

```

两个相同名称的文件夹：

如果通过`git config --global core.ignorecase false`把文件名设置为大小写敏感后，修改本地文件夹`song`为`Song`，然后上传，远程仓库将存在两个名称相同、大小写不同的（song 和 Song）文件夹（git version 2.34.1, macOS 12.5 (21G72)）。

相关链接：

- [被文件名大小写的问题搞晕了](https://link.juejin.cn/?target=https%3A%2F%2Fwww.v2ex.com%2Ft%2F862453 "https://www.v2ex.com/t/862453")：V2EX 上关于 Git 文件名大小写修改的讨论。

## 其它

[`git show`](https://link.juejin.cn/?target=https%3A%2F%2Fgit-scm.com%2Fdocs%2Fgit-show "https://git-scm.com/docs/git-show")，显示最近提交的信息，与之相关的其它命令：

```
git show <commit>
git show --raw <commit> # 查看提交文件列表
git show <commit> <file> # 查看提交记录的某文件 diff
git show HEAD^ # 上次提交
git show HEAD@{n} # 倒数第 n 次提交
git show <commit>:<file> # 查看一次提交的一个文件的变化
git show <branch> # 查看一个分支最近的一次提交
git show <branch>@{n} # 一个分支的倒数第 n 次提交

```

`git restore --staged <file>`取消暂存。

Github 新创建仓库的 Git 拉取提示：

```
echo "# git-learning" >> README.md # 创建一个文件，往里面加入文本
git init # 初始化 git
git add README.md
git commit -m "first commit"
git branch -M main # 重命名默认分支名称
git remote add origin git@github.com:wswmsword/git-learning.git
git push -u origin main

```

获取提交的数量：

```
git rev-list --count HEAD
git rev-list --count HEAD --since="Dec 3 2015"  --before="Jan 3 2016" # 一段时间
git shortlog -s
git shortlog -s --all # -all 所有分支

```

切换上一次的分支：

```
git checkout - # 只需添加一个短杠，其它命令兴许也能用

```

查看文件的 SHA1 值：

```
git ls-files --stage # 查看所有文件的 SHA1 值
git hash-data <file-name> # 查看单文件的 SHA1 值

```

### git rm

`git rm <file>`，撤销跟踪，并且删除指定文件。如果加上`-r`参数（`git rm -r <file>`），则删除文件夹。

`git rm --cached <file>`，撤销跟踪，保留工作区的文件内容。`git rm -f <file>`，强制删除文件。

不是所有的文件都需要 git 跟踪，例如项目编译之后的产包。如果产包因为误操作导致被跟踪了，就使用`git rm`命令来取消跟踪，并把产包添加到`.gitignore`来忽略跟踪。已跟踪的文件再添加到`.gitignore`中不会生效。

相关链接：

- [git忽略已经被提交的文件](https://link.juejin.cn/?target=https%3A%2F%2Fsegmentfault.com%2Fq%2F1010000000430426%2Fa-1020000017179994 "https://segmentfault.com/q/1010000000430426/a-1020000017179994")——segmentfault 的答案，除了使用`git rm --cached`还提供了其它方法取消跟踪已跟踪的文件。

### git remote

```
git remote -v # 显示所有远程仓库
git remote show origin # 显示某个远程仓库的信息
git remote add <name> <url> # 添加远程版本库
git remote rm <name> # 删除远程仓库
git remote rename <old_name> <name> # 修改仓库名

```
