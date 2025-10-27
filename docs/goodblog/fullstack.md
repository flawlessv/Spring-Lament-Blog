---
created: 2025-10-22T19:47:28 (UTC +08:00)
tags:
  [
    NestJS,
    前端,
    后端中文技术社区,
    前端开发社区,
    前端技术交流,
    前端框架教程,
    JavaScript 学习资源,
    CSS 技巧与最佳实践,
    HTML5 最新动态,
    前端工程师职业发展,
    开源前端项目,
    前端技术趋势,
  ]
source: https://juejin.cn/post/7407260232664186930
author: 菠萝的蜜
---

# NestJS 🧑🍳  厨子必修课（一）：后端的本质NestJS 🧑🍳 厨子必修第一课（后端的本质）。如果前端 - 掘金

> ## Excerpt
>
> NestJS 🧑🍳 厨子必修第一课（后端的本质）。如果前端是盘丝洞，那么后端就是地基，稳固可靠的石壁才能承载绚烂多彩的敦煌壁画。---

## theme: fancy

1.  前言

前段时间看完马伯庸的《食南之志》，就想要做一个厨子。一个好厨子不能只会端菜，更要会做菜，于是就有此系列——NestJS 厨子必

---

## 1\. 前言

前段时间看完马伯庸的《食南之志》，就想要做一个厨子。一个好厨子不能只会端菜，更要会做菜，于是就有此系列——NestJS 厨子必修课。

这一篇，笔者并不打算讲实际的代码开发，而是由生活中的实际场景来理解后端开发过程，转变前端固有思维，先观察全局，然后在此基础上进入细节。

整个系列暂时规划如下：

1.  后端的本质
2.  搞定 CRUD
3.  搞定数据库（Prisma + 共享模块）
4.  搞定登录注册（Auth 模块 + JWT + 路由守卫）
5.  搞定 API 文档（Swagger）
6.  搞定 API 部署（多环境 + docker-compose）

笔者觉得如果你不想变成“bug 路由器”，不想听那些不专业的技术人员鬼扯 👻，关注专栏就对了。

如果前端可以比喻为错综复杂的盘丝洞，充满了各种用户界面和交互细节，那么后端则可以比作是稳固的地基或支撑结构。后端是应用程序的服务器端，负责处理业务逻辑、数据库管理、服务器通信等，是整个应用架构的支撑，确保前端能够稳定运行。就像建筑的地基一样，后端需要稳固可靠，以支撑前端的复杂多变。

![敦煌飞天壁画.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/f9ae672926f1489cb8fedbf2ebd19b58~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761660480&x-signature=jwgf7cJMwGEiMPDLAgusWSwIIYA%3D)

![悬空寺.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/1d6b05e0a3bf47ceb5d85f2491d91281~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761660480&x-signature=QVrGGBzcGmVqbNX8Xq6%2FDdQNg%2BU%3D)

欢迎加入[技术交流群](https://juejin.cn/user/2154698521972423/pins "https://juejin.cn/user/2154698521972423/pins")。

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/dd5e4b8be907402d9d882517ff6a0e0c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761660480&x-signature=5H%2F6Qlln7R4ZpvGzQbhEbHcgiSA%3D)

1.  [NestJS 🧑🍳  厨子必修课（一）：后端的本质](https://juejin.cn/post/7407260232664186930 "https://juejin.cn/post/7407260232664186930")
2.  [NestJS 🧑🍳 厨子必修课（二）：项目创建](https://juejin.cn/post/7408021285768445961 "https://juejin.cn/post/7408021285768445961")
3.  [NestJS 🧑🍳 厨子必修课（三）：控制器](https://juejin.cn/post/7408778862283096102 "https://juejin.cn/post/7408778862283096102")
4.  [NestJS 🧑🍳 厨子必修课（四）：服务类](https://juejin.cn/post/7416235834938212403 "https://juejin.cn/post/7416235834938212403")
5.  [NestJS 🧑🍳 厨子必修课（五）：Prisma 集成（上）](https://juejin.cn/post/7416908856868110374 "https://juejin.cn/post/7416908856868110374")
6.  [NestJS 🧑🍳 厨子必修课（六）：Prisma 集成（下）](https://juejin.cn/post/7418460243502792731 "https://juejin.cn/post/7418460243502792731")
7.  [NestJS 🧑🍳 厨子必修课（七）：管道](https://juejin.cn/post/7419887372463554601 "https://juejin.cn/post/7419887372463554601")
8.  [NestJS 🧑🍳 厨子必修课（八）：异常过滤器](https://juejin.cn/post/7420272008146239514 "https://juejin.cn/post/7420272008146239514")

在开始之前，要讲清楚的是 CRUD 究竟是什么？所有书上都会说：

- C：create 创建（增）
- R：read 读取（查）
- U：update 更新（改）
- D：delete 删除（删）

## 2\. 理解账房记录

让时间回到古代，我们来到一间账房，账房先生正抓耳挠腮，账本塞了满满一屋子。

账本显然用于记录商家往来的交易，上面记录着客人们各自在什么时候购买了什么东西、又买了多少、总共几钱等等。

### 2.1 入账

每次成交一笔记录时，账房先生总会在账本上记录一笔：

- 吴承恩《黑神话：悟空》标准版 x 1 ¥268 PC 2024.8.19
- 玉皇大帝 《黑神话：悟空》豪华版 x 1 ¥328 PC 2024.8.20

这就是入账，创建新的交易记录，对应的是 C，create，创建、新增。

### 2.2 查账

一个月过去了，掌柜的赚得金满钵满，账本记得又是密密麻麻，这时候掌柜的就要让主簿校对账本记录，他打开账本一看，便一目了然，这就是查账，就是 R，read，读取、查找。

仔细看，其实账本就是一个 excel 表格：

| id  | 姓名     | 名称               | 版本   | 数量 | 单价 | 总价 | 创建时间  | 更新时间  |
| --- | -------- | ------------------ | ------ | ---- | ---- | ---- | --------- | --------- |
| 1   | 吴承恩   | 《黑神话：悟空》   | 标准版 | 1    | 268  | 268  | 2024.8.19 | 2024.8.19 |
| 2   | 玉皇大帝 | 《黑神话：悟空》   | 豪华版 | 1    | 328  | 328  | 2024.8.20 | 2024.8.20 |
| 3   | 姬发     | 《黑神话：姜子牙》 | 豪华版 | 2    | 328  | 652  | 2030.8.21 | 2030.8.21 |

### 2.3 修账

有时候账本记录有误，就要重新记录，或是划掉原来的错误改正，这就是 U，update，更新、编辑、修改。如下方 id 为 2 的记录：

| id  | 姓名     | 名称               | 版本   | 数量 | 单价 | 总价 | 创建时间  | 更新时间  |
| --- | -------- | ------------------ | ------ | ---- | ---- | ---- | --------- | --------- |
| 1   | 吴承恩   | 《黑神话：悟空》   | 标准版 | 1    | 268  | 268  | 2024.8.19 | 2024.8.19 |
| 2   | 玉皇大帝 | 《黑神话：悟空》   | 豪华版 | 2    | 328  | 652  | 2024.8.20 | 2024.8.25 |
| 3   | 姬发     | 《黑神话：姜子牙》 | 豪华版 | 2    | 328  | 652  | 2030.8.21 | 2030.8.21 |

### 2.4 删账

偶尔翻到一条记录被划掉，这就是 D，delete，删除。如《黑神话：姜子牙》还没有发布，这条记录应该被删掉：

| id  | 姓名     | 名称             | 版本   | 数量 | 单价 | 总价 | 创建时间  | 更新时间  |
| --- | -------- | ---------------- | ------ | ---- | ---- | ---- | --------- | --------- |
| 1   | 吴承恩   | 《黑神话：悟空》 | 标准版 | 1    | 268  | 268  | 2024.8.19 | 2024.8.19 |
| 2   | 玉皇大帝 | 《黑神话：悟空》 | 豪华版 | 2    | 328  | 652  | 2024.8.20 | 2024.8.21 |

以上，这些记录排布在一起就形成了一张账单，有联系的账单之间将会建立索引，总之，账单聚集在一起就变成了账本，这间堆满账本的屋子就是账房。总结一下，账单相当于数据库中的数据表，账本对应不同环境下的数据库，而账房是不同的数据库系统。

## 3\. 总结

回到当下，在用户打开浏览器页面看到自己的订单记录时，实际上是通过 HTTP 协议发起请求，服务器根据当前路由的匹配规找到对应的控制器，从而执行一个方法，这个方法会对数据库做 CRUD 的某种操作，最后由服务器响应给前端，前端浏览器完成渲染，用户就看到了新的界面。

![前后端逻辑处理.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/72c88fa135844bdcb2965dbd8f92689c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761660480&x-signature=JA6QJnWg4DWMPh9y7a4Z28t92fk%3D)

所以，本质上整个业务流程就是一个账本管理的过程。说起来，现代的账房先生可比古时候轻松很多了。下一节将会进入到实际的代码开发中，看看如何创建一个项目。

---

created: 2025-10-22T19:47:36 (UTC +08:00)
tags: [NestJS,前端,后端中文技术社区,前端开发社区,前端技术交流,前端框架教程,JavaScript 学习资源,CSS 技巧与最佳实践,HTML5 最新动态,前端工程师职业发展,开源前端项目,前端技术趋势]
source: https://juejin.cn/post/7408021285768445961
author: 菠萝的蜜

---

# NestJS 🧑🍳 厨子必修课（二）：项目创建NestJS 🧑🍳 厨子必修第二课（项目创建）。以武林外传的故 - 掘金

> ## Excerpt
>
> NestJS 🧑🍳 厨子必修第二课（项目创建）。以武林外传的故事串联起整个业务流程，介绍了如何使用 NestJS 去创建和构建并运行一个项目，以及 NestJS 中的 src 文件构成。---

## theme: fancy

1.  前言

上篇以账房为例解释了后端的本质，现在进入到代码部分，看看如何使用 N

---

## 1\. 前言

上篇以账房为例解释了后端的本质，现在进入到代码部分，看看如何使用 NestJS 创建一个项目。

先来看个小故事，从感性角度继续理解流程：

有一天，邢捕头来同福客栈吃饭，看了看菜单，想要点个鱼香肉丝。佟掌柜就去安排下去了，白展堂把消息告诉了李大嘴，大嘴看了看食材库存还够，就开始忙活了，这边刀功飞快，又是热锅冷油……只听呲啦呲啦，片刻之间，白展堂就把菜端了上来，这往桌上一摆，邢捕头拿起筷子就大口吃了起来。顷间，吕秀才已经做好了账面记录，随后撕了一张票据给老邢。

记住这个故事，往下看：

- 同福客栈的菜单就是各路由
- 鱼香肉丝就是某一个路由
- 当邢捕头点了鱼香肉丝就是发送了一个 HTTP 请求
- 佟掌柜的安排（自然知道要去找谁：让老白去厨房找大嘴）就是 Controller（控制器，接收和处理请求）
- 真正懂炒菜业务的是大嘴，炒菜业务本身就是 Service（业务逻辑层），检查食材库存实际上就在和数据库交互
- 餐桌上有地方放筷子、有地方放醋碟，邢捕头低头的位置就是放碗的，这就是 View（视图模版）
- 炒完菜，邢捕头看到碗里的鱼香肉丝，（本来碗里没有鱼香肉丝到有鱼香肉丝）就是浏览器渲染页面，把请求的数据渲染了出来

如果从 B端、C端角度：

- 佟掌柜拿出菜单给老邢，老邢点菜（C 端）
- 炒菜当然要检查食材库存，所以对于大嘴来说厨房的库存就是一本账本（B 端）
- 炒完了端出来，秀才就知道这单成了，成交记录 +1（B 端）
- 邢捕头高高兴兴拿着票据回衙门报销（C 端）

欢迎加入[技术交流群](https://juejin.cn/user/2154698521972423/pins "https://juejin.cn/user/2154698521972423/pins")。

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/dd5e4b8be907402d9d882517ff6a0e0c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761694509&x-signature=YEJ0yCiJAE3ycPeJRk3Gg0m2vM4%3D)

1.  [NestJS 🧑🍳  厨子必修课（一）：后端的本质](https://juejin.cn/post/7407260232664186930 "https://juejin.cn/post/7407260232664186930")
2.  [NestJS 🧑🍳 厨子必修课（二）：项目创建](https://juejin.cn/post/7408021285768445961 "https://juejin.cn/post/7408021285768445961")
3.  [NestJS 🧑🍳 厨子必修课（三）：控制器](https://juejin.cn/post/7408778862283096102 "https://juejin.cn/post/7408778862283096102")
4.  [NestJS 🧑🍳 厨子必修课（四）：服务类](https://juejin.cn/post/7416235834938212403 "https://juejin.cn/post/7416235834938212403")
5.  [NestJS 🧑🍳 厨子必修课（五）：Prisma 集成（上）](https://juejin.cn/post/7416908856868110374 "https://juejin.cn/post/7416908856868110374")
6.  [NestJS 🧑🍳 厨子必修课（六）：Prisma 集成（下）](https://juejin.cn/post/7418460243502792731 "https://juejin.cn/post/7418460243502792731")
7.  [NestJS 🧑🍳 厨子必修课（七）：管道](https://juejin.cn/post/7419887372463554601 "https://juejin.cn/post/7419887372463554601")
8.  [NestJS 🧑🍳 厨子必修课（八）：异常过滤器](https://juejin.cn/post/7420272008146239514 "https://juejin.cn/post/7420272008146239514")

## 2\. 创建项目

现在使用 Nest 创建一个项目。

### 2.1 安装

```ruby
$ npm i -g @nestjs/cli
```

### 2.2 初始化项目

```cpp
# $ nest new [name]
$ nest new cook-api-1
```

cook-api-1 就是这个 Nest 项目的名字，随便起。

### 2.3 启动项目

```shell
$ cd cook-api-1
$ npm install
$ npm run start:dev
```

访问 [http://localhost:3000/](https://link.juejin.cn/?target=http%3A%2F%2Flocalhost%3A3000%2F "http://localhost:3000/") 可以看到 Hello World! 的画面。

![Hello World!.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/54e27c65b419406d96ab617a4fec02b0~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761694509&x-signature=ykFPVY30MsRaB24C1Iar3geSJ8g%3D)

### 2.4 打包构建

```ruby
$ npm run build
```

运行以上命令即可完成项目打包构建，并在项目目录下生成一个 dist 目录。

### 2.5 运行生产环境代码

有了 dist 产物，执行以下命令即可运行打包后的项目，这也是上线后的运行效果。

```r
$ npm run start:prod
```

⚠️ 注意：在 package.json 中的这条脚本命令是：`"start:prod": "node dist/main"` ，这表示说运行的入口文件是 dist 下的 main.js，如果是接入 prisma 等 ORM 工具，打包后的目录结构有所不同，这里是需要修改的。

## 3\. 约定大于配置

Nest 提供了一种“约定大于配置”的架构形式，它的意义在于减少配置，让开发者在规定区域编写代码，减轻开发压力和心智负担。

在 src 目录下有以下文件：

![src 目录文件.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/ffceca5da67643e99f3681757af75543~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761694509&x-signature=A%2Fk4jOc1V3KTEl0U%2BuyHelo87TU%3D)

- .controller.ts：处理 http 请求以及调用 service 层方法
- .service.ts：封装通用的业务逻辑、与数据层交互（数据库 CRUD 操作）、其他额外的第三方请求
- .module.ts：模块，注入控制器和服务

继续往下看可以发现每一组资源都对应了这三种文件，它们各自约好了在其中应该写什么内容，而不是自己去配置、去封装。就好像感冒了不会去吃咳嗽药一样。

## 4\. 总结

这篇博客以武林外传的故事串联起整个业务流程，另外还介绍了如何使用 NestJS 去创建和构建并运行一个项目，以及 NestJS 中的 src 文件构成。

本文收录于以下专栏

![cover](https://p26-juejin-sign.byteimg.com/tos-cn-i-k3u1fbpfcp/f60476322d8a42288f3f5c4cea750f89~tplv-k3u1fbpfcp-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761738416&x-signature=LLzGQGU%2BzSar3ZaRCEx8sLXES%2FA%3D)

讲解 NestJS 相关内容，教前端学会后端开发。如需转载请私信～

上一篇

NestJS 🧑🍳  厨子必修课（一）：后端的本质

下一篇

NestJS 🧑🍳 厨子必修课（三）：控制器

---

created: 2025-10-22T19:47:46 (UTC +08:00)
tags: [NestJS中文技术社区,前端开发社区,前端技术交流,前端框架教程,JavaScript 学习资源,CSS 技巧与最佳实践,HTML5 最新动态,前端工程师职业发展,开源前端项目,前端技术趋势]
source: https://juejin.cn/post/7408778862283096102
author: 菠萝的蜜

---

# NestJS 🧑🍳 厨子必修课（三）：控制器NestJS 🧑🍳 厨子必修第三课（控制器）。介绍了如何快速生成 - 掘金

> ## Excerpt
>
> NestJS 🧑🍳 厨子必修第三课（控制器）。介绍了如何快速生成一个资源，以及控制器相关的内容，最小限度快速实现一个接口。

---

## 1\. 前言

同福客栈应该有一个菜单供客人点餐，每一道菜都有自己的信息（比如配料是什么、价格多少），配料和价格可以调整，可以不提供这道菜。

简而言之，菜单就是一个资源，RESTful 风格的 API 接口如下：

- GET /menus 获取所有菜品
- GET /menus/:id 获取某个菜品详情
- POST /menus 添加新的菜品
- PATCH /menus/:id 修改菜品详情
- DELETE /menus/:id 删除某个菜品

欢迎加入[技术交流群](https://juejin.cn/user/2154698521972423/pins "https://juejin.cn/user/2154698521972423/pins")。

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/dd5e4b8be907402d9d882517ff6a0e0c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761552197&x-signature=8V4V%2F89eba3akXtRVL4bcHJFgHQ%3D)

1.  [NestJS 🧑🍳  厨子必修课（一）：后端的本质](https://juejin.cn/post/7407260232664186930 "https://juejin.cn/post/7407260232664186930")
2.  [NestJS 🧑🍳 厨子必修课（二）：项目创建](https://juejin.cn/post/7408021285768445961 "https://juejin.cn/post/7408021285768445961")
3.  [NestJS 🧑🍳 厨子必修课（三）：控制器](https://juejin.cn/post/7408778862283096102 "https://juejin.cn/post/7408778862283096102")
4.  [NestJS 🧑🍳 厨子必修课（四）：服务类](https://juejin.cn/post/7416235834938212403 "https://juejin.cn/post/7416235834938212403")
5.  [NestJS 🧑🍳 厨子必修课（五）：Prisma 集成（上）](https://juejin.cn/post/7416908856868110374 "https://juejin.cn/post/7416908856868110374")
6.  [NestJS 🧑🍳 厨子必修课（六）：Prisma 集成（下）](https://juejin.cn/post/7418460243502792731 "https://juejin.cn/post/7418460243502792731")
7.  [NestJS 🧑🍳 厨子必修课（七）：管道](https://juejin.cn/post/7419887372463554601 "https://juejin.cn/post/7419887372463554601")
8.  [NestJS 🧑🍳 厨子必修课（八）：异常过滤器](https://juejin.cn/post/7420272008146239514 "https://juejin.cn/post/7420272008146239514")

## 2\. 快速生成 menus 资源

通过以下命令快速生成一个有关 menus 资源的控制器文件：

```ruby
$ nest g resource menus
```

执行后会在 src 目录下生成一个有关 menus 资源的文件夹：

![menus 资源.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/3c59aefeeea74e93b7304bc6d1215d19~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761552197&x-signature=lnr%2BZP%2BNJAEted3O%2FSQJAkZvUGc%3D)

可以看到这组资源的构成与外层的 app 是类似的，都由 controller、service、module 文件构成。

先前说过“约定大于配置”，因此可以预见的是 controller 文件里应该写了 menus 相关的路由匹配以及对应执行的 service 方法，而 service 文件中包含了业务处理逻辑和具体响应给前端的内容，module 则负责如何组织它们。

## 3\. 控制器

打开 menus.controller.ts 文件可以看到已经自动生成了相关代码，整体结构如下：

```perl
// 引入相关依赖...

@Controller('menus')
export class MenusController {
  // 相关代码...
}
```

在 Nest 中使用了大量的装饰器语法，可以理解为\*\*“武器赋魔”，使之具备某种能力\*\*。

`@Controller` 用于将类 `MenusController` 标记为控制器，控制器是用于处理传入的 HTTP 请求的类。它定义了应用程序的路由，并根据不同的 HTTP 方法（如 `GET`、`POST`、`PUT`、`DELETE` 等）来处理请求。

`@Controller('menus')` 中的字符串参数 `'menus'` \*\*\*\*指定了控制器处理的基础路由路径，在这个例子中，所有与这个控制器相关的路由都会以 `/menus` 开头。

### 3.1 依赖注入

在控制器类 MenusController 中有如下代码：

```typescript
// 依赖注入
constructor(private readonly menusService: MenusService) {}

@Get()
findAll() {
  // 使用服务类实例方法
  return this.menusService.findAll();
}

// 其他代码...
```

在 Nest 中有两个很重要的概念：

- **控制反转（Inversion of Control，简称 IOC）**
- **依赖注入（Dependency Injection，简称 DI）**

`constructor(private readonly menusService: MenusService) {}` ：调用构造函数时，Nest 会通过 IOC 容器来自动实例化依赖项（这里指的是 `MenusService`：一个服务类，负责处理与菜单相关的业务逻辑），并自动将 `MenusService` 的实例注入到这个控制器类 `MenusController` 中。

这样一来，就能在控制类 `MenusController` 中通过 `this.menusService` 来调用 `MenusService` 中的实例方法了。

⚠️ 注意：通过 `private readonly` 声明，这个依赖只能在类内部使用，并且不能被修改。

依赖注入这种解耦设计不再需要将繁杂的业务逻辑写在控制器中，而是将依赖关系从内部转移到外部，这意味着可以根据需求自由添加或更换依赖项。

在这里可以说 `MenusController` 依赖 `MenusService`，`MenusService` 为 `MenusController` 的依赖项。

除了能够匹配到路由，下一步是要处理对应的 HTTP 请求（POST、GET、PATCH、DELETE）。

### 3.2 `@Post()`

```less
@Post()
create(@Body() createMenuDto: CreateMenuDto) {
  return this.menusService.create(createMenuDto);
}
```

- **`@Post()`**：这个装饰器标识此方法处理 POST 请求。通常用于创建新的资源。
- **`create(@Body() createMenuDto: CreateMenuDto)`**：这个方法接收一个 `createMenuDto` 参数，表示请求体中的数据。`@Body()` 装饰器从 HTTP 请求的 body 中提取数据，并将其转换为 `CreateMenuDto` 对象。**从这里可以看出：类中的方法是可以使用装饰器的，甚至是方法中的入参。**
- **`this.menusService.create(createMenuDto)`**：调用 `MenusService` 实例的 `create` 方法，将 `createMenuDto` 传递给它。`MenusService` 将负责处理实际的创建逻辑。

有了这段代码，掌柜的可以添加新的菜品了：

![POST请求.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/8c1e2f38b2b747b2adb6a72217f44cdd~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761552197&x-signature=b%2Fk0f4Ymft9zal%2BJ1ayFzjoIPFc%3D)

### 3.3 `@Get()`

```kotlin
@Get()
findAll() {
  return this.menusService.findAll();
}
```

- **`@Get()`**：这个装饰器标识此方法处理 GET 请求。通常用于获取资源的列表。
- **`findAll()`**：直接调用 `MenusService` 的 `findAll` 方法来获取所有菜单。

有了这段代码，客人们可以查看所有的菜品了：

![GET请求.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/4de80b6aea5a4cd2ab91984f08c33be6~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761552197&x-signature=p4%2FwU2D0hMgxp49Dwev4nMiZdMg%3D)

### 3.4 `@Get(':id')`

```less
@Get(':id')
findOne(@Param('id') id: string) {
  return this.menusService.findOne(+id);
}
```

- **`@Get(':id')`**：这个装饰器标识此方法处理 GET 请求，并且路径中带有一个 `id` 参数。`:id` 是一个路径参数，表示特定资源的标识符。
- **`findOne(@Param('id') id: string)`**：这个方法使用 `@Param('id')` 从请求路径中提取 `id` 参数，并将其转换为字符串类型传递给 `findOne` 方法。
- **`this.menusService.findOne(+id)`**：调用 `MenusService` 的 `findOne` 方法，传入的 `id` 参数前加上 `+` 表示将字符串 `id` 转换为数字。

有了这段代码，客人们可以查看某一道菜品的详情了：

![GET请求详情.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/f1922f53119344cba503250cb005577b~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761552197&x-signature=JaUMo0dqJWYxDfGV58WAE4IspSI%3D)

### 3.5 `@Patch(':id')`

```less
@Patch(':id')
update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
  return this.menusService.update(+id, updateMenuDto);
}
```

- **`@Patch(':id')`**：这个装饰器标识此方法处理 PATCH 请求。PATCH 请求通常用于更新部分资源。
- **`update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto)`**：该方法从请求路径中提取 `id` 参数，从请求体中提取更新数据 `updateMenuDto`。
- **`this.menusService.update(+id, updateMenuDto)`**：调用 `MenusService` 的 `update` 方法，更新指定 `id` 的菜单。

有了这段代码，掌柜的可以修改菜品信息了：

![PATCH请求.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/d86aa281cb4f443995763b5eefb1d3ee~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761552197&x-signature=RTXn%2BA8TvK7P6%2FzStwS7DICjQLM%3D)

### 3.6 `@Delete(':id')`

```less
@Delete(':id')
remove(@Param('id') id: string) {
  return this.menusService.remove(+id);
}
```

- **`@Delete(':id')`**：这个装饰器标识此方法处理 DELETE 请求，通常用于删除资源。
- **`remove(@Param('id') id: string)`**：从请求路径中提取 `id` 参数。
- **`this.menusService.remove(+id)`**：调用 `MenusService` 的 `remove` 方法，删除指定 `id` 的菜单。

有了这段代码，掌柜的可以删除菜品信息了：

![DELETE请求.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/a1bb1b9b67a04e69af0a35c3f0fee3b3~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761552197&x-signature=roSOlMHuKPpJMtR8Q78%2B%2B4UOTPQ%3D)

至此，可以说前言部分的 API 接口都已经完成了。

### 3.7 `@Query()`

通过 3.3 的代码就可以查看所有的菜品，但是有时候希望通过名称 name 和类型 category 去过滤菜单，这就要用到查询字符串的装饰器 `@Query` ，假设用户可以通过以下接口拿到过滤菜单：

- GET /menus/search?name=beef&category=Chinese

```less
// 新增的查询方法
@Get('search')
search(@Query('name') name: string, @Query('category') category: string) {
  return this.menusService.search({ name, category });
}
```

`@Get('search')` 装饰器将会匹配以 /menus/search 开头的路由。

⚠️ 注意：放在动态路由前面，防止被优先捕获。

对应的 menus.service.ts 中的 `search` 方法修改如下：

```typescript
@Injectable()
export class MenusService {
  // 模拟的菜单数据
  private menus = [
    {
      id: 1,
      name: "beef",
      category: "Chinese",
    },
    { id: 2, name: "pasta", category: "Italian" },
  ];

  search(filters: { name?: string; category?: string }) {
    return this.menus.filter(
      (menu) =>
        (!filters.name || menu.name.includes(filters.name)) &&
        (!filters.category || menu.category === filters.category)
    );
  }

  // 其他方法...
}
```

这样就可以分别从查询字符串中拿到 `name` 和 `category` 的值，并分别赋值给对应参数，再调用 `MenusService` 的 `search` 方法，找到指定 `name` 和 `category` 范围下的数据了。

现在，客人可以筛选菜品了：

![search条件查询.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/7fbff9dffe35448394cb7ae2bf657e51~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761552197&x-signature=ZBZPR6TiKfdYr2wQi3T1xN0NmR4%3D)

![search条件查询2.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/238f35811fe5426eb5d7bf1cc7ad2c2a~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761552197&x-signature=Wt2%2F3Jovc2DZQQH6qI1i9HRk4rI%3D)

## 4\. 总结

这篇博客介绍了如何快速生成一个资源，以及控制器相关的内容。结合装饰器，控制器类能够负责处理与菜单相关的 HTTP 请求。它利用 NestJS 提供的装饰器来标识每个方法处理的请求类型（GET、POST、PATCH、DELETE）以及路径参数。其他的各种装饰器将会在以后用到时才会出现。

业务逻辑部分通过依赖注入的方式委托给 `MenusService` 服务类来处理。这样使得控制器更加简洁，专注于路由处理和请求解析，而将具体的业务逻辑交由服务类负责。下一篇将讲解服务类的相关内容。

---

created: 2025-10-22T19:47:53 (UTC +08:00)
tags: [前端,NestJS,后端中文技术社区,前端开发社区,前端技术交流,前端框架教程,JavaScript 学习资源,CSS 技巧与最佳实践,HTML5 最新动态,前端工程师职业发展,开源前端项目,前端技术趋势]
source: https://juejin.cn/post/7416235834938212403
author: 菠萝的蜜

---

# NestJS 🧑🍳 厨子必修课（四）：服务类在 NestJS 应用架构中，控制器负责接收和处理 HTTP 请求，随 - 掘金

> ## Excerpt
>
> 在 NestJS 应用架构中，控制器负责接收和处理 HTTP 请求，随后将业务逻辑的处理工作委托给服务类。这些服务类通过依赖注入机制与控制器相连，确保了代码的松耦合和可维护性。---

## theme: fancy

1.  前言

之前使用控制器来实现 CRUD 的基本功能，本节将重点介绍 NestJS 中的服务类

---

## 1\. 前言

之前使用控制器来实现 CRUD 的基本功能，本节将重点介绍 NestJS 中的服务类（service 文件），它主要用于处理业务逻辑。一般来说，它将包含应用程序的核心功能，并负责与数据库、其他服务、外部 API 或是第三方库交互。

目前的代码结构如下：

![目录结构.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/0e4aed3d0daa4b25bcc33e9a7827b4b8~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761702280&x-signature=sAYLJnlOYMMZKXtMcHuvLFLuNL8%3D)

欢迎加入[技术交流群](https://juejin.cn/user/2154698521972423/pins "https://juejin.cn/user/2154698521972423/pins")。

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/dd5e4b8be907402d9d882517ff6a0e0c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761702280&x-signature=m4tWJTMmKBJ4dekUy9C0b%2B3Ew3o%3D)

1.  [NestJS 🧑🍳  厨子必修课（一）：后端的本质](https://juejin.cn/post/7407260232664186930 "https://juejin.cn/post/7407260232664186930")
2.  [NestJS 🧑🍳 厨子必修课（二）：项目创建](https://juejin.cn/post/7408021285768445961 "https://juejin.cn/post/7408021285768445961")
3.  [NestJS 🧑🍳 厨子必修课（三）：控制器](https://juejin.cn/post/7408778862283096102 "https://juejin.cn/post/7408778862283096102")
4.  [NestJS 🧑🍳 厨子必修课（四）：服务类](https://juejin.cn/post/7416235834938212403 "https://juejin.cn/post/7416235834938212403")
5.  [NestJS 🧑🍳 厨子必修课（五）：Prisma 集成（上）](https://juejin.cn/post/7416908856868110374 "https://juejin.cn/post/7416908856868110374")
6.  [NestJS 🧑🍳 厨子必修课（六）：Prisma 集成（下）](https://juejin.cn/post/7418460243502792731 "https://juejin.cn/post/7418460243502792731")
7.  [NestJS 🧑🍳 厨子必修课（七）：管道](https://juejin.cn/post/7419887372463554601 "https://juejin.cn/post/7419887372463554601")
8.  [NestJS 🧑🍳 厨子必修课（八）：异常过滤器](https://juejin.cn/post/7420272008146239514 "https://juejin.cn/post/7420272008146239514")

## 2\. 提供器

作为一个松耦合的设计来说，带有 `@Injectable` 装饰器的服务类作为依赖项（提供器）被注入到控制器中，使得控制类更为强大。

举个例子，在这层关系中，服务类属于（疫苗）提供者进行注入（💉），作为注入目标的控制类（人类）则是消费者，消费者功能增强了（人类具备病毒免疫力）。

### 2.1 服务类定义

menus.service.ts 的代码主体结构如下：

```perl
import { Injectable } from '@nestjs/common';
// ...

@Injectable()
export class MenusService {
  // ...
}
```

`@Injectable` 装饰器用于标记 `MenusService` 类为可注入的提供器，它告诉 NestJS 这个类可以作为一个提供器使用，并且可以被其他类（如控制器、服务、模块等）通过构造函数注入。

### 2.2 服务类注入

这样，它就可以在 `menu.controller.ts` 中的 `MenusController` 类中的构造函数中注入：

```typescript
// ...
import { MenusService } from "./menus.service";

@Controller("menus")
export class MenusController {
  constructor(private readonly menusService: MenusService) {}
  // CRUD 相关业务逻辑代码
}
```

于是，访问对应 api 接口就能调用服务类中的方法，进而返回数据给前端。

### 2.3 服务注册

整体来说，对菜单的 CRUD 是一项服务，它有提供者、消费者，自然也需要一个中心组织来管理它们，这就是 menus 目录下的 module 文件 —— menus.module.ts，在这里，我们把控制类和服务类注册上去：

```typescript
import { Module } from "@nestjs/common";
import { MenusService } from "./menus.service";
import { MenusController } from "./menus.controller";

@Module({
  controllers: [MenusController], // 控制器
  providers: [MenusService], // 提供器（服务）
})
export class MenusModule {}
```

`@Module` 装饰器用于定义 `MenusModule` 类为一个模块。模块是 NestJS 应用程序的基本构建块，用于组织和封装一组相关的组件（如提供器、控制器、导入的模块等）。上面就是一个有关 menus 的模块，它可以作为一个单元被导入导出。

除了 `controllers` 用于注册控制器、`providers` 用于注册提供器，`@Module` 中还有：

- `imports`：用于导入其他模块。通过导入模块，可以在当前模块中使用其他模块提供的服务。
- `exports`：用于导出提供器或模块，使它们可以被其他模块使用。

⚠️ 注意：如果不进行注册，这些依赖就不会得到解析。

## 3\. 主模块

app.module.ts 是主模块所在文件，这是整个系统的核心所在，可以看作是中央大脑。

![应用依赖.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/b367a42a027d486099e23906f4f9629a~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761702280&x-signature=Q940YS0FRR8KsIC3EJ%2F5wWLRou4%3D)

箭头表示导入方向，比如共享模块被导入到各个服务类中，各个服务类分别导入对应的功能模块中，功能模块导入主模块。共享模块将在以后提到。

### 3.1 menus 模块导入到主模块

menus 模块作为子模块需要导入到主模块 app.module.ts 中：

```typescript
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MenusModule } from "./menus/menus.module";

@Module({
  imports: [MenusModule], // 导入 MenusModule 模块
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

通过 `imports: [MenusModule]` 将 `MenusModule` 导入到主模块，这样 `AppModule` 可以使用 `MenusModule` 中定义的所有功能了。

### 3.2 main.ts 启动应用

main.ts 为整个应用的入口文件：

```javascript
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

在这里调用 `bootstrap` 方法：将主模块 `AppModule` 传入 NestJS 的工厂函数 `NestFactory.create` 方法就能创建一个 Nest 应用实例，最后将在 3000 端口启动。

## 4\. 总结

在 NestJS 应用架构中，控制器负责接收和处理 HTTP 请求，随后将业务逻辑的处理工作委托给服务类。这些服务类通过依赖注入机制与控制器相连，确保了代码的松耦合和可维护性。服务类随后在各自的模块中注册，并通过模块化结构向上聚合，直至达到应用的根模块。这种分层和模块化的策略构建了一个清晰、高效的服务架构，为应用程序的运行提供了坚实的基础。

---

created: 2025-10-22T19:48:00 (UTC +08:00)
tags: [前端,后端,NestJS中文技术社区,前端开发社区,前端技术交流,前端框架教程,JavaScript 学习资源,CSS 技巧与最佳实践,HTML5 最新动态,前端工程师职业发展,开源前端项目,前端技术趋势]
source: https://juejin.cn/post/7416908856868110374
author: 菠萝的蜜

---

# NestJS 🧑🍳 厨子必修课（五）：Prisma 集成（上）以 PostgreSQL 为例，介绍如何在 Nest - 掘金

> ## Excerpt
>
> 以 PostgreSQL 为例，介绍如何在 NestJS 中集成 Prisma ORM，包括：初始化 Prisma、配置数据库连接以及数据播种。---

## theme: fancy

1.  前言

在业务逻辑中，数据库操作是非常常见的一部分。前端应用中展示的数据通常都来源于数据库，通过数据库的读写操作，能够为用户

---

## 1\. 前言

在业务逻辑中，数据库操作是非常常见的一部分。前端应用中展示的数据通常都来源于数据库，通过数据库的读写操作，能够为用户提供所需的信息和功能。

Prisma 是一个现代化的 ORM 工具，简化了数据库操作，并提供了强类型支持和自动生成的数据库模型。现在将探讨如何将 Prisma 集成到项目中，并如何利用其功能来高效管理数据库。

Prisma 目前支持 PostgreSQL、MySQL、SQL Server、SQLite、MongoDB 和 CockroachDB。

这里我们以 PostgreSQL 为例。

欢迎加入[技术交流群](https://juejin.cn/user/2154698521972423/pins "https://juejin.cn/user/2154698521972423/pins")。

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/dd5e4b8be907402d9d882517ff6a0e0c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761693334&x-signature=eRIboaI1Lq8b6DcFbEKul5PDTlI%3D)

1.  [NestJS 🧑🍳  厨子必修课（一）：后端的本质](https://juejin.cn/post/7407260232664186930 "https://juejin.cn/post/7407260232664186930")
2.  [NestJS 🧑🍳 厨子必修课（二）：项目创建](https://juejin.cn/post/7408021285768445961 "https://juejin.cn/post/7408021285768445961")
3.  [NestJS 🧑🍳 厨子必修课（三）：控制器](https://juejin.cn/post/7408778862283096102 "https://juejin.cn/post/7408778862283096102")
4.  [NestJS 🧑🍳 厨子必修课（四）：服务类](https://juejin.cn/post/7416235834938212403 "https://juejin.cn/post/7416235834938212403")
5.  [NestJS 🧑🍳 厨子必修课（五）：Prisma 集成（上）](https://juejin.cn/post/7416908856868110374 "https://juejin.cn/post/7416908856868110374")
6.  [NestJS 🧑🍳 厨子必修课（六）：Prisma 集成（下）](https://juejin.cn/post/7418460243502792731 "https://juejin.cn/post/7418460243502792731")
7.  [NestJS 🧑🍳 厨子必修课（七）：管道](https://juejin.cn/post/7419887372463554601 "https://juejin.cn/post/7419887372463554601")
8.  [NestJS 🧑🍳 厨子必修课（八）：异常过滤器](https://juejin.cn/post/7420272008146239514 "https://juejin.cn/post/7420272008146239514")

## 2\. Prisma 初始化

### 2.1 安装 prisma

```
npm install prisma -D
```

### 2.2 初始化 prisma 设置

```csharp
npx prisma init
```

运行完成后，将会在根目录下生成 prisma 目录，里面有一个 schema.prisma 文件用于配置数据库连接和数据库模型，同时在根目录还生成了 .env 文件，用于编写环境变量。

### 2.3 安装 prisma 客户端

为了能够在 Nest 应用中与数据库进行交互，还要使用 Prisma Client，因此也要安装：

```bash
npm install @prisma/client
```

## 3\. 配置数据库连接

在连接之前需要启动一个数据库，这里使用 docker compose 来实现。

### 3.1 启动数据库实例

使用 docker compose 创建一个 PostgreSQL 的数据库实例：

```yaml
# docker-compose.yml

version: "3.8"
services:
  cook-api-1-postgres:
    container_name: cook-api-1-postgres
    image: postgres:14-alpine
    restart: always
    environment:
      - POSTGRES_USER=cook
      - POSTGRES_PASSWORD=cookpassword
    volumes:
      - cook-api-1-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  cook-api-1-data:
```

在终端输入以下命令：

```
docker compose up -d
```

![docker compose up -d.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/bd665bf03d5d48a3a5bb6a9cebf9ab4d~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761693334&x-signature=euJhtdFRbgceMtchQkDpGhtESe4%3D)

输入 `docker ps` 可以看到 cook-api-1-postgres 数据库实例正在运行：

![docker ps 的结果.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/c255abdbee6c42b79506681d8c1f5185~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761693334&x-signature=iceDYHfFKk02LbttwoDSSRYEEnE%3D)

### 3.2 配置数据库环境变量

在 prisma/schema.prisma 文件中配置 PostgreSQL 数据库连接。找到 datasource 部分并进行如下配置：

```bash
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

这表示 prisma 的数据源来自 postgresql，位置从 .env 文件中的 DATABASE_URL 变量中读取。

然后，在项目根目录下的 .env 文件中添加数据库连接 URL：

```ini
DATABASE_URL="postgresql://cook:cookpassword@localhost:5432/dev-db"
```

意思是连接到 localhost:5432 的 `dev-db` 数据库，用户名为 `cook`、密码为 `cookpassword`，这和 docker-compose.yml 中的变量是一致的，否则登录不进去。

### 3.3 生成模型与迁移

假设佟掌柜让秀才记录的用户信息如下：

![User 表 Excel 模拟.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/44af855c09a140cc91ca940919ee6fa3~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761693334&x-signature=%2BuAKpElxmEigcBsXwDfCaX%2BDq4Y%3D)

User 表 Excel 模拟

这些内容在数据库中是一张 User 表，我们需要在 schema.prisma 文件中定义这样的模型：

```kotlin
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
}
```

- `model User`：模型的名称为 User。
- `id`：这是一个整型（`Int`）字段，用来唯一标识每个用户。它被标记为`@id`，这意味着它是这个模型的主键。`@default(autoincrement())`表示每当创建一个新记录时，这个字段的值会自动递增。
- `email`：这是一个字符串类型（`String`）的字段，用来存储用户的电子邮件地址。`@unique`修饰符确保了每个用户的电子邮件地址是唯一的，即不允许有重复的电子邮件地址。
- `name`：这是一个可选的字符串字段，用来存储用户的名字。问号(`?`)表示这个字段**可以为空**。
- `createdAt`：这是一个日期时间类型的字段，用来记录用户创建的时间。`@default(now())`表示每当创建一个新用户时，这个字段会自动设置为当前的日期和时间。

⚠️ 注意：以上属于 Prisma 的模型定义方式，具体可参阅 Prisma 官网。

定义好的模型和数据库还没有关联，因此需要迁移数据库，这样数据库里才有 User 表。

迁移数据库：

```csharp
npx prisma migrate dev --name init
```

- `migrate`: 这是 Prisma CLI 的一个子命令，用于管理数据库迁移。数据库迁移是数据库架构变更的过程，它允许你将数据库模型的更改应用到实际的数据库中。
- `dev`: 这是迁移命令的一个选项，它告诉 Prisma 创建一个开发迁移。开发迁移通常用于本地开发环境，它们不会应用到生产数据库上，而是用于测试和开发目的。
- `--name init`: 这是命令的一个参数，用于给迁移命名。在这个例子中，迁移被命名为`init`，这通常表示这是一个初始化迁移，可能是为了设置数据库的初始状态。

![迁移数据库.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/be4ca88f72794e03b34ecb5d94a3a0dd~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761693334&x-signature=SP3Cx5Ovxl0YZp6tTz%2FRRK7GIRc%3D)

这个命令会根据当前模型生成 SQL 迁移文件，并自动应用到数据库中。现在数据库就和我们的 schema 文件同步完成了，还自动生成了 Prisma Client。

⚠️ 注意：我们也可以使用 `npx prisma generate` 来手动生成 Prisma Client。

通过 VSC 插件 SQLTools 连接数据库可以看到 User 表已经成功创建了：

![SQLTools 插件中查看数据库.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/70c2bdb1735d4c37a090561df79c214c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761693334&x-signature=6Lp94mxP1RZk4UNk8EZ5NogLGTE%3D)

## 4\. 数据播种

为了验证 Nest 应用能否成功集成了 Prisma，我们将通过 Prisma Client 进行数据播种，看能否与数据库交互。

### 4.1 可视化数据库

现在运行一下命令可以在 5555 端口看到数据库的内容：

```
npx prisma studio
```

打开后，User 表的记录数量为 0。

### 4.2 创建 seed 文件

首先在 prisma 目录下新建 seed.ts：

```php
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 删除现有的所有数据 (可选)
  await prisma.user.deleteMany();

  // 创建种子数据
  const users = await prisma.user.createMany({
    data: [
      {
        email: 'alice@example.com',
        name: 'Alice',
      },
      {
        email: 'bob@example.com',
        name: 'Bob',
      },
      {
        email: 'charlie@example.com',
        name: 'Charlie',
      },
    ],
  });

  console.log(`Seeded ${users.count} users`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

调用 prisma 客户端实例（`prisma`）批量创建 user 用户，这些数据将会真实地记录到数据库中，创建完成后断开数据库连接。

### 4.3 运行 seed 脚本

在 package.json 中加入脚本：

```bash
{
  "scripts": {
+   "seed": "ts-node prisma/seed.ts",
+   "studio": "prisma studio"
  }
}
```

然后运行：

```
npm run seed
```

![执行数据播种.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/63eb2e2db97a4a06954896669522a58c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761693334&x-signature=V3wLOAdiLwLAdsK0J3VVJexDPI0%3D)

接着运行：

```
npm run studio
```

![访问 prisma studio.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/eb7171e6ddb048c28c9fc257a90b33ce~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761693334&x-signature=VaNIMzo%2B9sxdOeeiWO3tgaZkjaY%3D)

可以看到 User 表中已经有内容了。（`id` 从 4 开始是因为笔者之前执行过一次了）

## 5\. 总结

通过本篇内容，大家已经学会了如何初始化 Prisma、配置数据库连接以及数据播种，此时 NestJS 已经可以和数据库交互了，在下篇中将会进一步介绍如何在业务逻辑处理中使用 Prisma 来解决实际问题。

---

created: 2025-10-22T19:48:07 (UTC +08:00)
tags: [前端,后端,NestJS中文技术社区,前端开发社区,前端技术交流,前端框架教程,JavaScript 学习资源,CSS 技巧与最佳实践,HTML5 最新动态,前端工程师职业发展,开源前端项目,前端技术趋势]
source: https://juejin.cn/post/7418460243502792731
author: 菠萝的蜜

---

# NestJS 🧑🍳 厨子必修课（六）：Prisma 集成（下）通过 Prisma 集成相关内容，全面掌握如何在 N - 掘金

> ## Excerpt
>
> 通过 Prisma 集成相关内容，全面掌握如何在 NestJS 中使用 Prisma 进行实际的数据库集成。---

## theme: fancy

1.  前言

上篇讲了如何集成 Prisma，那么如何在 NestJS 中把 Prisma 真正用起来呢？这篇告诉你答案。

欢迎加入技术交流群https://jue

---

## 1\. 前言

上篇讲了如何集成 Prisma，那么如何在 NestJS 中把 Prisma 真正用起来呢？这篇告诉你答案。

欢迎加入[技术交流群](https://juejin.cn/user/2154698521972423/pins "https://juejin.cn/user/2154698521972423/pins")。

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/dd5e4b8be907402d9d882517ff6a0e0c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761687106&x-signature=L26X0bzb3O1JxkXQmNsOfaUgq68%3D)

1.  [NestJS 🧑🍳  厨子必修课（一）：后端的本质](https://juejin.cn/post/7407260232664186930 "https://juejin.cn/post/7407260232664186930")
2.  [NestJS 🧑🍳 厨子必修课（二）：项目创建](https://juejin.cn/post/7408021285768445961 "https://juejin.cn/post/7408021285768445961")
3.  [NestJS 🧑🍳 厨子必修课（三）：控制器](https://juejin.cn/post/7408778862283096102 "https://juejin.cn/post/7408778862283096102")
4.  [NestJS 🧑🍳 厨子必修课（四）：服务类](https://juejin.cn/post/7416235834938212403 "https://juejin.cn/post/7416235834938212403")
5.  [NestJS 🧑🍳 厨子必修课（五）：Prisma 集成（上）](https://juejin.cn/post/7416908856868110374 "https://juejin.cn/post/7416908856868110374")
6.  [NestJS 🧑🍳 厨子必修课（六）：Prisma 集成（下）](https://juejin.cn/post/7418460243502792731 "https://juejin.cn/post/7418460243502792731")
7.  [NestJS 🧑🍳 厨子必修课（七）：管道](https://juejin.cn/post/7419887372463554601 "https://juejin.cn/post/7419887372463554601")
8.  [NestJS 🧑🍳 厨子必修课（八）：异常过滤器](https://juejin.cn/post/7420272008146239514 "https://juejin.cn/post/7420272008146239514")

## 2\. 共享 Prisma 服务

Prisma Client 在不同接口都会使用到，借助 NestJS 的依赖注入可以将其抽象为一个服务以共享给其他的模块或服务。

```
nest generate service prisma
```

![生成 prisma 服务类.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/760651634f3c4e03a3507447beea74b1~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761687106&x-signature=9ppI3FFzS1bZtIWp%2FE674ck8nQo%3D)

### 2.1 定义 Prisma 服务类

修改 prisma.service.ts 如下：

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

- `extends PrismaClient`：定义了一个名为 `PrismaService` 的类，它继承自 `PrismaClient`。这意味着 `PrismaService` 将拥有 Prisma Client 的所有方法和属性。
- `implements OnModuleInit, OnModuleDestroy`： 这一行指定 `PrismaService` 类实现了 `OnModuleInit` 和 `OnModuleDestroy` 接口。这意味着这个类将提供这两个接口定义的方法，这些方法将在模块的生命周期的特定时刻被调用。
  - `onModuleInit` 方法将在模块初始化时被调用，执行 Prisma Client 的 `$connect` 方法来建立数据库连接
  - `onModuleDestroy` 方法将在模块销毁时被调用，执行 Prisma Client 的`$disconnect`方法来关闭数据库连接。

另外，在 app.module.ts 的 `providers` 数组中自动注册了这个服务类，把这里的 `PrismaService` 移除。

### 2.2 注入与注册 Prisma 服务类

运行以下命令创建 users 资源：

```bash
nest g resource users
```

![生成 users 资源.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/36eb7e82dc43451b986c5161415942e8~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761687106&x-signature=RLtj7xdHjAZZso%2FW6wMLJO2KfLY%3D)

直接核心来到 users.service.ts 中注入 Prisma 服务类，使之可以真实地与数据库交互。

```typescript
+ import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
+  constructor(private readonly prisma: PrismaService) {}
}
```

但是！注意在NestJS中，模块的作用域决定了服务、控制器、守卫、拦截器等组件的可见性和可注入性。因此需要将 `PrismaService` 类注册进 user.module.ts 的 `providers` 中：

```perl
// ...
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  // ...
  providers: [UsersService, PrismaService],
})
export class UsersModule {}
```

这样，users 模块这个作用域下的服务就能使用 `PrismaService` 类了。

### 2.3 调用 Prisma Client 实例完成 CRUD

默认示例中返回了字符串，现在修改如下：

```kotlin
// ...

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
-   return 'This action adds a new user';
+   return this.prisma.user.create({
+      data: createUserDto,
+    });
  }

  findAll() {
-    return `This action returns all users`;
+    return this.prisma.user.findMany();
  }

  findOne(id: number) {
-    return `This action returns a #${id} user`;
+    return this.prisma.user.findUnique({
+      where: { id },
+    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
-    return `This action updates a #${id} user`;
+return this.prisma.user.update({
+      where: { id },
+      data: updateUserDto,
+    });
  }

  remove(id: number) {
-    return `This action removes a #${id} user`;
+return this.prisma.user.delete({
+      where: { id },
+    });
  }
}
```

`UsersService` 类中的 `create`、`findAll`、`findOne`、`update`、`remove` 分别实现了创建记录、读取记录、读取单个记录、更新记录、删除记录。

`this.prisma` 就是 Prisma Client 实例的引用，Prisma Client 是Prisma ORM的客户端库，它提供了与数据库交互的方法。

通过 `.user` 就能唤起 Prisma Client 中定义的模型引用，user 是模型的名称，它对应于数据库中的一个表。

- `this.prisma.user.create` 是 Prisma Client 提供的方法，用于在数据库中创建新的记录。`{ data: createUserDto }` 是一个对象，指定了要创建的数据。这里的 `data` 属性包含了用户的所有信息，这些信息将被插入到数据库中。
- `this.prisma.user.findMany` 用于查询数据库中的多条记录，返回一个包含所有用户记录的数组。
- `this.prisma.user.findUnique` 用于查找数据库中的一条特定记录。`{ where: { id } }` 是一个对象，指定了查找条件。这里的 `where` 属性定义了查找记录的条件，即 ID 必须与提供的 `id` 参数匹配。
- `this.prisma.user.update` 用于更新数据库中的记录。`{ where: { id }, data: updateUserDto }` 是一个对象，指定了更新的条件和数据。`where` 属性定义了要更新的记录的条件，而 `data` 属性包含了要更新的数据。
- `this.prisma.user.delete` 用于从数据库中删除一条记录。`{ where: { id } }` 是一个对象，指定了要删除的记录的条件。这里的 `where` 属性定义了要删除的记录的 ID。

值得注意的是 createUserDto 的类型 CreateUserDto 以及 updateUserDto 的类型 UpdateUserDto，这类 dto 文件用于**定义请求参数的类型**，例如创建和更新 user 时，需要接收的数据类型是已经决定的：

```typescript
// src/users/dto/create-user.dto.ts
export class CreateUserDto {
  name?: string;
  email: string;
  password: string;
}

// src/users/dto/update-user.dto.ts
import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {}
```

- `PartialType(CreateUserDto)` 是一个泛型调用，它将 `CreateUserDto` 中的所有字段转换为可选字段。这意味着在更新用户信息时，用户可以传递任何字段，也可以不传递任何字段，更加灵活。
- `extends PartialType(CreateUserDto)` 则表示 `UpdateUserDto` 继承自 `PartialType(CreateUserDto)`。

访问 [http://localhost:3000/users](https://link.juejin.cn/?target=http%3A%2F%2Flocalhost%3A3000%2Fusers "http://localhost:3000/users") 可以看到结果：

![获取所有用户.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/7573599a6c634c888df63cda34ea6226~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761687106&x-signature=cOjUAcYiKw0jozCBCO7yvfdstpY%3D)

## 3\. 高级查询

Prisma 还支持复杂的查询操作，如关联查询、分页、过滤等。

### 3.1 关联查询（**Relational Queries）**

每一个用户都有自己的订单记录，这是典型的 **one-to-many** 关联（一对多）关系：

![一对多关联关系.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/da09fe3524fe4b3b9ffce0d953382565~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761687106&x-signature=wKUTBDXUxt%2FPLS7hasDB%2BkqjlqU%3D)

上图中可以看出 User 表中的路人甲（`id` 为 1）拥有三笔订单，分别对应 Order 表中 `id` 为 1、2、4 的记录。

模型定义如下：

```kotlin
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  orders    Order[]
}

model Order {
  id        Int      @id @default(autoincrement())
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

在 User 模型定义中新增了两个字段：

- `updatedAt`：日期时间字段，记录用户记录最后一次更新的时间。它被标记为 `@updatedAt`，Prisma 会自动在每次更新用户记录时设置这个字段。
- `orders`：关系字段，表示用户和订单之间的关系。它是一个 `Order` 数组，意味着一个用户可以有多个订单。

新建的 Order 模型的 `userId` 和 `user` 需要说明：

- `userId`：整型字段，用作外键，引用 User 模型的 `id` 字段。它用于建立 User 和 Order 之间的关系。
- `user`：关系字段，表示订单和用户之间的关系。它被标记为 `@relation`，指定了关系的细节，包括使用的字段（`fields: [userId]`）和引用的字段（`references: [id]`）。这意味着每个订单都关联到一个用户，可以通过 `userId` 字段来访问。

⚠️ 注意：在 Prisma 中，关系字段用于定义模型间的逻辑关系，而不是存储实际的数据，因此并不会真实出现在数据表中。实际的关系是通过在相关模型的表中使用外键来实现的，比如上面的 `userId` 就是一个外键，它引用 User 模型的 `id` 字段。

每次修改好模型定义后，需要迁移数据库：

```csharp
npx prisma migrate dev --name add-orders
```

在执行后会有报错：

> Step 0 Added the required column `updatedAt` to the `User` table without a default value. There are 3 rows in this table, it is not possible to execute this step.
>
> You can use prisma migrate dev --create-only to create the migration file, and manually modify it to address the underlying issue(s). Then run prisma migrate dev to apply it and verify it works.

是说 User 表里本来没有 `updatedAt` 字段，需要一个默认值。同时它给出了解决办法，让我们使用 `prisma migrate dev --create-only` 来创建一个迁移文件，然后手动修改给 `updatedAt` 一个默认值，然后再运行 `prisma migrate dev` 才行。

在运行 `prisma migrate dev --name add-orders --create-only` 后生成了一个迁移文件：

![迁移文件.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/a028eb2ebd44426ba9d7ee5ec6f5865f~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761687106&x-signature=2SPHQLT26BR%2Fo8TX8qM5XcLNWQU%3D)

进入 migration.sql：

```sql
/*
  Warnings:

  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
```

在 Warings 部分提示要加上默认值：在 `ALTER TABLE` 所在行的最后追加 `DEFAULT CURRENT_TIMESTAMP`。表示 `updatedAt` 的默认值为当前时间戳。

修改完 sql 文件后运行：

```csharp
npx prisma migrate dev --name add-orders
```

这样就完成迁移了。

每次完成数据库迁移后，最好都执行一次 `npx prisma generate` 来更新 Prisma 客户端。

⚠️ 注意：在生产环境中进行这种更改时要格外小心，并确保在应用更改之前备份数据。

关联查询的目的是：获取用户信息的同时得到他的订单。

```typescript
// users.service.ts
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
+      include: {
+        orders: true,
+      },
    });
  }
}
```

`include`：这是一个包含选项对象，用于指定在查询时应该加载哪些关联数据。在这个例子中，`orders: true` 表示应该加载与找到的用户关联的所有订单。

访问 [http://localhost:3000/users/4](https://link.juejin.cn/?target=http%3A%2F%2Flocalhost%3A3000%2Fusers%2F4 "http://localhost:3000/users/4") 的结果：

![获取 id 为 4 的用户信息.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/b7beb7aa9cdc42fbbc7071b1bd38969e~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761687106&x-signature=t%2BDQfFeLniyeuKngsbr%2FSqU9yQE%3D)

### 3.2 分页（**Pagination）**

Prisma 提供了 `skip` 和 `take` 参数，用于实现分页功能。

前端需要传递页码 `pageNum` 和页面数据承载数量 `pageSize`：

```less
// users.controller.ts
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(
    @Query('pageNum') pageNum?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.usersService.findAll(pageNum, pageSize);
  }
}
```

```typescript
// users.service.ts
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(pageNum: number = 1, pageSize: number = 10) {
    pageNum = Math.max(1, pageNum);
    pageSize = Math.max(1, pageSize);

    const skip = (pageNum - 1) * pageSize;

    const [total, users] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.findMany({
        skip,
        take: pageSize,
        orderBy: {
          id: "asc",
        },
      }),
    ]);

    return {
      users,
      meta: {
        total,
        pageNum,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }
}
```

- `pageNum` 和 `pageSize` 是方法的参数，分别表示请求的页码和每页的记录数。它们都有默认值，`pageNum` 默认为 1，`pageSize` 默认为 10。
- `pageNum = Math.max(1, pageNum);` 和 `pageSize = Math.max(1, pageSize);`：这两行代码确保 `pageNum` 和 `pageSize` 的值至少为 1，防止出现负数或零的情况。
- `skip`：计算在分页查询中需要跳过的记录数。
- `const [total, users] = await Promise.all([ ... ]);`：使用 `Promise.all` 同时执行两个异步操作：计算总记录数和获取当前页的用户数据。
  - `total` 是数据库中用户记录的总数。
  - `users` 是当前页的用户数据。
- `this.prisma.user.count()`：调用 `PrismaService` 的 `count` 方法来获取用户表中的总记录数。
- `orderBy: { id: 'asc' }` 用于指定返回记录的排序方式，这里按照 `id` 字段升序排序。

[http://localhost:3000/users](https://link.juejin.cn/?target=http%3A%2F%2Flocalhost%3A3000%2Fusers "http://localhost:3000/users") 如图：

![分页查询所有用户.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/f374a0368e774e0c868998877252d0ed~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761687106&x-signature=dph%2BAc%2FszrA1ToaodbdnH4v5ICA%3D)

[http://localhost:3000/users?pageNum=1&pageSize=2](https://link.juejin.cn/?target=http%3A%2F%2Flocalhost%3A3000%2Fusers%3FpageNum%3D1%26pageSize%3D2 "http://localhost:3000/users?pageNum=1&pageSize=2") 如图：

![分页查询.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/9d2874382189412caf415d799a7dc2a3~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761687106&x-signature=bZPMV0CkBR8a48kkp69fYKW7TAA%3D)

### 3.3 过滤（**Filtering）**

在之前通过 id 能够过滤出满足要求的用户，现在看看更为高级的过滤方法。使用 where 实现模糊查询。

添加 /users/search 接口，前端需要传 `query` 过来：

```less
// users.controller.ts
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('search')
  search(@Query('query') query: string) {
    return this.usersService.searchUsers(query);
  }
}
```

添加模糊查询业务逻辑：

```php
// users.service.ts
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async searchUsers(query: string) {
    return this.prisma.user.findMany({
      where: {
        OR: [{ name: { contains: query } }, { email: { contains: query } }],
      },
    });
  }
}
```

- `query` 参数是用户输入的搜索字符串
- `where: { OR: [{ name: { contains: query } }, { email: { contains: query } }] }`：
  - `where` 属性定义了查询的过滤条件。
  - `OR` 是一个逻辑操作符，表示满足数组中任意一个条件的记录都应该被检索出来。
  - 第一个条件是 `name` 字段包含 `query` 字符串，使用了 `contains` 过滤器，表示搜索 `name` 字段中包含给定 `query` 字符串的用户。
  - 第二个条件是 `email` 字段包含 `query` 字符串，同样使用了 `contains` 过滤器，表示搜索 `email` 字段中包含给定 `query` 字符串的用户。

[http://localhost:3000/users/search?query=bo](https://link.juejin.cn/?target=http%3A%2F%2Flocalhost%3A3000%2Fusers%2Fsearch%3Fquery%3Dbo "http://localhost:3000/users/search?query=bo") 如图：

![模糊搜索.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/8c2a02f1043b4628a35cc27b538c7984~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761687106&x-signature=Bc%2BaJ2ZmhS3qZ8asWcqe3Alvk5Y%3D)

## 4\. 总结

通过 Prisma 集成相关内容，大家已经知道如何在 NestJS 中使用 Prisma 进行实际的数据库集成。掌握这些技能后，能够更高效地开发与数据库交互的功能模块，同时也提升了代码的可维护性和稳定性。

---

created: 2025-10-22T19:48:14 (UTC +08:00)
tags: [前端,后端,NestJS中文技术社区,前端开发社区,前端技术交流,前端框架教程,JavaScript 学习资源,CSS 技巧与最佳实践,HTML5 最新动态,前端工程师职业发展,开源前端项目,前端技术趋势]
source: https://juejin.cn/post/7419887372463554601
author: 菠萝的蜜

---

# NestJS 🧑🍳 厨子必修课（七）：管道在 NestJS 框架中利用管道（Pipes）对传入的请求参数执行验证和 - 掘金

> ## Excerpt
>
> 在 NestJS 框架中利用管道（Pipes）对传入的请求参数执行验证和转换。通过这种方式，管道增强了数据的安全性，通过自定义管道提供了高度的灵活性。

---

## 1\. 前言

在上一节中提到了 dto 文件，它用于定义请求参数的类型，这是对数据输入的一种验证保护，使其符合 API 规范。在 NestJS 中提供了管道的特性，允许路由处理器通过管道对**输入参数**进行验证或是转换：

- 验证：评估输入数据，如果有效，只需将其原样传递；否则抛出异常
- 转换：将输入数据转换为所需的形式（例如：从字符串到整数）

具体来说，管道将会在路由处理器的 `arguments` 上运行，Nest 在调用方法之前插入一个管道，管道接收指定给该方法的参数并对它们进行操作，然后使用验证或转换过的参数去调用路由处理程序。

⚠️ 注意：管道虽然类似于中间件，但是只负责处理输入参数！因此，提到管道的地方就要理解是要处理输入参数了。

假设有路由 /example，下面是验证管道的工作原理：

![验证管道工作原理.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/02e6edde0e0a46ff9db50f497d11cf69~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761399139&x-signature=EuJvJMCZLt4pLNKpjd5a3qri%2BXo%3D)

欢迎加入[技术交流群](https://juejin.cn/user/2154698521972423/pins "https://juejin.cn/user/2154698521972423/pins")。

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/dd5e4b8be907402d9d882517ff6a0e0c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761399139&x-signature=4Y2%2BOaV49LjeammJUwTraFtGFZM%3D)

1.  [NestJS 🧑🍳  厨子必修课（一）：后端的本质](https://juejin.cn/post/7407260232664186930 "https://juejin.cn/post/7407260232664186930")
2.  [NestJS 🧑🍳 厨子必修课（二）：项目创建](https://juejin.cn/post/7408021285768445961 "https://juejin.cn/post/7408021285768445961")
3.  [NestJS 🧑🍳 厨子必修课（三）：控制器](https://juejin.cn/post/7408778862283096102 "https://juejin.cn/post/7408778862283096102")
4.  [NestJS 🧑🍳 厨子必修课（四）：服务类](https://juejin.cn/post/7416235834938212403 "https://juejin.cn/post/7416235834938212403")
5.  [NestJS 🧑🍳 厨子必修课（五）：Prisma 集成（上）](https://juejin.cn/post/7416908856868110374 "https://juejin.cn/post/7416908856868110374")
6.  [NestJS 🧑🍳 厨子必修课（六）：Prisma 集成（下）](https://juejin.cn/post/7418460243502792731 "https://juejin.cn/post/7418460243502792731")
7.  [NestJS 🧑🍳 厨子必修课（七）：管道](https://juejin.cn/post/7419887372463554601 "https://juejin.cn/post/7419887372463554601")
8.  [NestJS 🧑🍳 厨子必修课（八）：异常过滤器](https://juejin.cn/post/7420272008146239514 "https://juejin.cn/post/7420272008146239514")

## 2\. 内置管道

NestJS 内置了一些常见的管道。

### 2.1 `ValidationPipe`

`ValidationPipe`：这是一个通用的管道，用于验证传入的数据。它可以与 `class-validator` 包一起使用，自动验证 DTO 对象的属性，确保它们符合定义的验证规则。

```typescript
import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { ValidationPipe } from "@nestjs/common";

@Controller("users")
export class UsersController {
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  createUser(@Body() createUserDto: CreateUserDto) {
    // 业务逻辑
  }
}
```

- `whitelist`：忽略 DTO 中未定义的属性。
- `forbidNonWhitelisted`：如果请求体中包含未定义的属性，抛出异常。

curl 请求示例：

```swift
curl -X POST http://localhost:3000/users \
-H "Content-Type: application/json" \
-d '{"name": "John Doe", "email": "john.doe@example.com", "password": "securepassword123"}'
```

### 2.2 `ParseIntPipe`

`ParseIntPipe`：将传入的字符串转换为整数，如果转换失败，它将返回一个错误。

```typescript
import { Controller, Get, Query, UsePipes } from "@nestjs/common";
import { ParseIntPipe } from "@nestjs/common";

@Controller("items")
export class ItemsController {
  @Get()
  getItems(@Query("page", ParseIntPipe) page: number) {
    // 业务逻辑，使用 page
  }
}
```

curl 请求示例：

```bash
curl -G http://localhost:3000/items?page=2
```

### 2.3 `ParseFloatPipe`

`ParseFloatPipe`：类似于 `ParseIntPipe`，但用于将字符串转换为浮点数。

```typescript
import { Controller, Get, Query, UsePipes } from "@nestjs/common";
import { ParseFloatPipe } from "@nestjs/common";

@Controller("orders")
export class OrdersController {
  @Get()
  getOrders(@Query("price", ParseFloatPipe) price: number) {
    // 业务逻辑，使用 price
  }
}
```

curl 请求示例：

```bash
curl -G http://localhost:3000/orders?price=19.99
```

### 2.4 `ParseBoolPipe`

`ParseBoolPipe`：将传入的值转换为布尔值，可以处理字符串（如 "true", "false", "1", "0"）和其他表示真值或假值的输入。

```typescript
import { Controller, Get, Query, UsePipes } from "@nestjs/common";
import { ParseBoolPipe } from "@nestjs/common";

@Controller("users")
export class UsersController {
  @Get()
  getUsers(@Query("isActive", ParseBoolPipe) isActive: boolean) {
    // 业务逻辑，使用 isActive
  }
}
```

curl 请求示例：

```bash
curl -G http://localhost:3000/users?isActive=true
```

### 2.5 `ParseArrayPipe`

`ParseArrayPipe`：将传入的字符串转换为数组。

```typescript
import { Controller, Get, Query, UsePipes } from "@nestjs/common";
import { ParseArrayPipe } from "@nestjs/common";

@Controller("products")
export class ProductsController {
  @Get()
  getProducts(
    @Query("categories", ParseArrayPipe({ items: ParseIntPipe }))
    categories: number[]
  ) {
    // 业务逻辑，使用 categories 数组
  }
}
```

curl 请求示例：

```bash
curl -G http://localhost:3000/products?categories=1,2,3
```

### 2.6 `ParseUUIDPipe`

`ParseUUIDPipe`：将传入的字符串转换为 UUID 对象，如果字符串不是有效的 UUID，它将返回一个错误。

```typescript
import { Controller, Get, Param, UsePipes } from "@nestjs/common";
import { ParseUUIDPipe } from "@nestjs/common";

@Controller("products")
export class ProductsController {
  @Get(":id")
  getProduct(@Param("id", ParseUUIDPipe) id: string) {
    // 业务逻辑，使用 id
  }
}
```

curl 请求示例：

```bash
curl -G http://localhost:3000/products/123e4567-e89b-12d3-a456-426614174000
```

### 2.7 `ParseEnumPipe`

`ParseEnumPipe`：将传入的字符串转换为枚举值。它需要一个枚举类作为参数，如果传入的值不是枚举中的有效成员，它将返回一个错误。

```typescript
import { Controller, Get, Query, UsePipes } from "@nestjs/common";
import { ParseEnumPipe } from "@nestjs/common";

enum Status {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending",
}

@Controller("statuses")
export class StatusesController {
  @Get()
  getStatuses(
    @Query("status", new ParseEnumPipe({ enum: Status })) status: Status
  ) {
    // 业务逻辑，使用 status
  }
}
```

curl 请求示例：

```bash
curl -G http://localhost:3000/statuses?status=active
```

### 2.8 `DefaultValuePipe`

`DefaultValuePipe`：用于为没有提供的数据设置默认值。它可以接受一个对象，其中定义了参数名和相应的默认值。

```typescript
import { Controller, Get, Query, UsePipes } from "@nestjs/common";
import { DefaultValuePipe } from "@nestjs/common";

@Controller("settings")
export class SettingsController {
  @Get()
  getSettings(@Query("limit", new DefaultValuePipe(10)) limit: number) {
    // 业务逻辑，使用 limit，默认值为 10
  }
}
```

curl 请求示例：

```bash
curl -G http://localhost:3000/settings?limit=5
```

### 2.9 `ParseFilePipe`

`ParseFilePipe`：用于处理上传的文件。它通常用于处理 `multipart/form-data` 请求中的文件上传。

```kotlin
import { Controller, Post, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('uploads')
export class UploadsController {
  @Post('profile')
  @UseInterceptors(FileInterceptor('file'))
  uploadProfile(@UploadedFile() file) {
    // 业务逻辑，处理上传的文件
  }
}
```

⚠️ 注意：`ParseFilePipe` 实际上是一个示例名称，NestJS 中用于处理文件上传的管道是 `FileInterceptor`。

curl 请求示例：

```bash
curl -X POST -F "file=@/path/to/profile/image.jpg" http://localhost:3000/uploads/profile
```

上面的内置管道都使用于**参数级别**，当然还可以用于以下级别：

- **全局应用**：所有传入请求都会经过指定的管道。
- **控制器级别**：特定控制器中的所有请求会应用到指定的管道。
- **路由处理程序级别**：仅应用于某个具体的路由处理函数。

可以看到是非常灵活的，但是一个成熟的项目推荐上全局应用，所有的请求都应该接受管道验证。另外，管道的执行顺序是在**路由处理程序**执行之前，因此可以确保传入的请求数据在进入业务逻辑之前已经过了验证和转换。

## 3\. `ValidationPipe`

`ValidationPipe` 验证管道提供了很多开箱即用的选项，不用我们自己手动去构建验证逻辑。现在，我们在全局应用验证管道。

`ValidationPipe` 需要搭配 `class-validator` 包中的装饰器来声明验证规则：

```cpp
npm install class-validator class-transformer
```

### 3.1 class-validator

`class-validator` 用于验证对象属性的装饰器库，能集成到任何基于类的框架中，如 NestJS。可以验证对象、数组甚至嵌套对象；支持各种验证规则，包括自定义规则；能够与 `class-transformer` 配合使用，以自动转换和验证数据。

### 3.2 class-transformer

`class-transformer` 是一个用于转换（序列化和反序列化）和复制对象的库，它可以与 `class-validator` 无缝集成。它允许将普通的 JavaScript 对象转换为类实例，并在转换过程中进行验证。支持对象的深度复制；可以与 `class-validator` 结合使用，以在转换过程中进行验证。

### 3.3 全局使用验证管道

简而言之，**`class-validator`** 专注于数据验证，提供了丰富的验证规则和装饰器；**`class-transformer`** 专注于数据转换，能够将普通对象转换为类的实例，并支持深度复制。

在入口文件中设置全局管道：

```javascript
// main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
+ import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
+   app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
```

### 3.4 添加验证规则

以 users 资源下的 dto 文件 create-user.dto.ts 为例，添加验证规则：

```kotlin
import { IsNotEmpty, MinLength, IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
```

`class-validator` 提供的装饰器很好理解：

- `@IsString()`：验证输入字段是否为字符串类型，如果不是，则验证失败。
- `@IsNotEmpty()`：验证字段是否已定义且不是空字符串。
- `@MinLength(3)`：确保字段长度至少为 3 个字符，否则验证失败。
- `@IsEmail()`：验证字段为一个有效的电子邮箱地址，它使用正则表达式来验证格式。

users.controller.ts 如下：

```less
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
```

在调用 this.usersService.create(createUserDto) 方法之前，由于全局使用了验证管道，因此会先对输入参数进行验证。

现在改写 users.service.ts 中创建用户的 `create` 方法如下：

```typescript
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException('邮箱已被注册');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        role: UserRole.USER,
      },
    });
  }
```

简单来说，会先去检查是否存在指定电子邮件地址的用户，如果存在就返回“邮箱已被注册”的异常提示；否则，使用 `bcrypt.hash` 方法来创建关于 `createUserDto.password` 的加密密码，最后返回创建完成的 `user` 实体数据。（创建的用户 `role` 为 `UserRole.USER`）

当前的 Prisma 模型文件已经发变化：

```kotlin
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
+   password  String
+   role      UserRole @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  orders    Order[]
}

model Order {
  id        Int      @id @default(autoincrement())
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

+ enum UserRole {
+   USER
+   ADMIN
+ }
```

User 模型多了 `password` 用于记录用户密码，`role` 用于记录用户角色。

### 3.5 测试一下验证管道是否有效

example1：首先输入一个正确的数据格式。

```swift
curl -X POST http://localhost:3000/users \
-H "Content-Type: application/json" \
-d '{"name": "John Doe", "email": "john.doe@example.com", "password": "securepassword123"}'
```

![example1 结果.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/33b7ed4779a443118182199e85dca22a~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761399139&x-signature=qOQx1UZFocJXa8%2B0%2FjMr6pk56yA%3D)

✅ 成功了。

example2：再输入一个错误的格式（email 格式是错误的，密码为空）。

```swift
curl -X POST http://localhost:3000/users \
-H "Content-Type: application/json" \
-d '{"name": "David King", "email": "john.doe", "password": ""}'
```

![example2 结果.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/a071ab53365442cf93be69fac9f663f1~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761399139&x-signature=HbiF6cgBcMmfwdCylX9%2BbTZrdbI%3D)

✅ 这是一个很好的预期。

example3：再使用第一个成功创建的用户的邮箱再次创建，看看是否会告诉我们有重复的。

```swift
curl -X POST http://localhost:3000/users \
-H "Content-Type: application/json" \
-d '{"name": "John Doe", "email": "john.doe@example.com", "password": "securepassword123"}'
```

![example3 结果.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/2b34d45de17e43cca6564171c8206e7e~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761399139&x-signature=2VL4Qx7HeFD37j8eEvrzeEHEGdI%3D)

✅ 符合预期，告诉我们邮箱已被注册。

example4：传递不必要的属性给路由处理器（在保证参数有效的前提下，试着多传递一个 `title` 属性）。

```swift
curl -X POST http://localhost:3000/users \
-H "Content-Type: application/json" \
-d '{"name": "Mike Poter", "email": "mike.poter@example.com", "password": "securepassword123","title":"多余的属性"}'
```

![example4 结果.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/96073ca086e7415f8656c158e80235ed~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761399139&x-signature=HXZ0geEeS4qJRPAGPyKYQGsM9yg%3D)

这就直接报出 500 的服务器错误了，虽然但是——不是很优雅。

### 3.6 删除不必要的属性

`ValidationPipe` 提供了选项 `whitelist: true` 来删除 DTO 中未定义的属性。

修改 main.ts：

```javascript
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  +app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(3000);
}
bootstrap();
```

现在再尝试 example5，结果如下：

![example5 结果.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/5a902f45f1e646e78ea064d041f0e3b0~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761399139&x-signature=NHfL8L78cBGrckC9%2BmKBF%2FX%2B6nw%3D)

✅ 正确。

如果想要更加严格地控制输入参数，比如 title 在 dto 文件中并未定义，应该报错。通过添加 `forbidNonWhitelisted: true` 选项来实现这种效果：

```javascript
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    +new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })
  );
  await app.listen(3000);
}
bootstrap();
```

![拦截多余属性然后报错.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/bb4be516701841d1a83689b4c248efae~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761399139&x-signature=PuvezCJiqFuQgSfefuhZP63Xkpo%3D)

✅ 从结果看，多余的 `title` 确实被检查出来了，新的 `user` 也不会被创建出来。

## 4\. 转换输入参数的数据类型

在内置管道章节已经列举了很多有关输入参数类型转换的示例，回到项目代码 users.controller.ts 中：

```less
@Get(':id')
findOne(@Param('id') id: string) {
  return this.usersService.findOne(+id);
}

@Patch(':id')
update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  return this.usersService.update(+id, updateUserDto);
}

@Delete(':id')
remove(@Param('id') id: string) {
  return this.usersService.remove(+id);
}
```

需要传递 `id` 的路由处理程序在调用服务类方法时都传递了 `+id` 以使 `id` 转换为数字类型，这是 JS 提供的自动转换特性，现在可以使用管道（`ParseIntPipe`）来实现自动转换：

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
+ ParseIntPipe,
} from '@nestjs/common';

// 其他引入...

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 其他路由处理器...

  @Get(':id')
+ findOne(@Param('id', ParseIntPipe) id: number) {
+   return this.usersService.findOne(id);
  }

  @Patch(':id')
+ update(
+   @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
+    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
+ remove(@Param('id', ParseIntPipe) id: number) {
+   return this.usersService.remove(id);
  }
}
```

## 5\. 自定义管道

先前在用户注册时，我们只对 email 做了检查，其实还要检查用户名是否唯一，我们用**自定义管道**来实现这个需求。

### 5.1 定义管道

在 users 目录下创建 pipes 目录，其下新建管道文件 unique-username.pipe.ts：

```typescript
import { Injectable, PipeTransform, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class UniqueUsernamePipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}

  async transform(value: string) {
    const user = await this.prisma.user.findFirst({
      where: { name: value },
    });

    if (user) {
      throw new BadRequestException("用户名已存在");
    }

    return value;
  }
}
```

自定义的 `UniqueUsernamePipe` 类实现了 `PipeTransform` 的接口，必须实现 `transform` 方法来履行 `PipeTransform` 的接口契约。`transform` 方法的参数 `value` 表示当前路由处理器接收的输入参数。

因此，上述代码首先使用 prisma 客户端实例去查找对应名称的用户，如果存在则抛出错误：“用户名已存在”，否则将输入参数返回出去。

### 5.2 使用管道

在 users.controller.ts 中使用定义好的自定义管道：

```typescript
+ import { UniqueUsernamePipe } from './pipes/unique-username.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(
+    @Body('name', UniqueUsernamePipe) name: string,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(createUserDto);
  }
}
```

curl 请求示例（`John Doe` 是 User 表中已经存在的对象）：

```swift
curl -X POST http://localhost:3000/users \
-H "Content-Type: application/json" \
-d '{"name": "John Doe", "email": "john.doe@example.com", "password": "securepassword123"}'
```

![自定义管道 UniqueUsernamePipe 使用结果.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/adf65f5d81a041a9b875bee548b40d8f~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761399139&x-signature=%2BFndZgpfrcYMtQd2qf5oVNjEQRc%3D)

✅ 管道起作用了！

## 6\. 总结

在本节中，我们探讨了如何在 NestJS 框架中利用管道（Pipes）对传入的请求参数执行验证和转换。通过这种方式，管道不仅增强了数据的安全性，确保了接收到的数据符合预期格式和标准，而且还通过自定义管道提供了高度的灵活性，使得对参数的校验可以根据具体业务需求进行定制。

---

created: 2025-10-22T19:48:21 (UTC +08:00)
tags: [前端,后端,NestJS中文技术社区,前端开发社区,前端技术交流,前端框架教程,JavaScript 学习资源,CSS 技巧与最佳实践,HTML5 最新动态,前端工程师职业发展,开源前端项目,前端技术趋势]
source: https://juejin.cn/post/7420272008146239514
author: 菠萝的蜜

---

# NestJS 🧑🍳 厨子必修课（八）：异常过滤器异常过滤器是 NestJS 提供的强大工具，用于捕获和处理应用中的 - 掘金

> ## Excerpt
>
> 异常过滤器是 NestJS 提供的强大工具，用于捕获和处理应用中的异常。通过自定义和全局应用过滤器，开发者可以确保异常处理的一致性，并提升应用的健壮性和用户体验。

---

## 1\. 前言

通过接口 GET /users/4 可以查询到 id 为 4 的用户信息，通过 GET /users/123 可以查询到 id 为 123 的用户信息，问题是数据库中并没有后者的数据，此时应该告诉前端没有这项数据。本篇将会讲解错误处理相关的内容，这将涉及到 NestJS 中的异常过滤器部分。

欢迎加入[技术交流群](https://juejin.cn/user/2154698521972423/pins "https://juejin.cn/user/2154698521972423/pins")。

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/dd5e4b8be907402d9d882517ff6a0e0c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761404663&x-signature=hG8NFDpaFxZwz7g46L82cW2a%2F4M%3D)

1.  [NestJS 🧑🍳  厨子必修课（一）：后端的本质](https://juejin.cn/post/7407260232664186930 "https://juejin.cn/post/7407260232664186930")
2.  [NestJS 🧑🍳 厨子必修课（二）：项目创建](https://juejin.cn/post/7408021285768445961 "https://juejin.cn/post/7408021285768445961")
3.  [NestJS 🧑🍳 厨子必修课（三）：控制器](https://juejin.cn/post/7408778862283096102 "https://juejin.cn/post/7408778862283096102")
4.  [NestJS 🧑🍳 厨子必修课（四）：服务类](https://juejin.cn/post/7416235834938212403 "https://juejin.cn/post/7416235834938212403")
5.  [NestJS 🧑🍳 厨子必修课（五）：Prisma 集成（上）](https://juejin.cn/post/7416908856868110374 "https://juejin.cn/post/7416908856868110374")
6.  [NestJS 🧑🍳 厨子必修课（六）：Prisma 集成（下）](https://juejin.cn/post/7418460243502792731 "https://juejin.cn/post/7418460243502792731")
7.  [NestJS 🧑🍳 厨子必修课（七）：管道](https://juejin.cn/post/7419887372463554601 "https://juejin.cn/post/7419887372463554601")
8.  [NestJS 🧑🍳 厨子必修课（八）：异常过滤器](https://juejin.cn/post/7420272008146239514 "https://juejin.cn/post/7420272008146239514")

## 2\. **`NotFoundException`**

通过 `NotFoundException` 实例直接抛出错误：

```typescript
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      // 关联
      include: {
        orders: true,
      },
    });
    if (!user) {
      throw new NotFoundException("用户不存在");
    }
    return user;
  }
}
```

这里做了防御性编程，如果没有查询到用户，使用 `throw new NotFoundException('用户不存在');` 抛出错误。

访问 [http://localhost:3000/users/123](https://link.juejin.cn/?target=http%3A%2F%2Flocalhost%3A3000%2Fusers%2F123 "http://localhost:3000/users/123") 后：

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/95555e32ab2b447f9cba9497a536ef70~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761404663&x-signature=Tb9uddZPz27yvvpe8RL5z7uebyM%3D)

返回的 JSON 对象由以下字段组成：

- `message`：描述具体错误信息，通常是一个字符串，解释错误的原因或背景。
- `error`：标识发生错误的类型或类别。通常为错误的名称或类别（如 “Bad Request” 或 “Unauthorized”）。
- `statusCode`：HTTP 状态码，以数字形式表示请求失败的类型。常见的状态码包括 400（Bad Request）、401（Unauthorized）、404（Not Found）等，用于反映请求的结果状态。

除了 `NotFoundException`，NestJS 中还提供了以下内置的 HTTP 异常：

1.  **BadRequestException (400 Bad Request)**

表示客户端发送的**请求有错误**，服务器无法处理。例如，参数缺失、无效输入等情况。

1.  **UnauthorizedException (401 Unauthorized)**

表示请求没有经过**身份验证或认证失败**。通常出现在访问需要身份验证的资源时，客户端没有提供有效的认证信息。

1.  **ForbiddenException (403 Forbidden)**

表示客户端的身份认证成功，但**没有权限访问**请求的资源。通常发生在权限不足时。

1.  **NotAcceptableException (406 Not Acceptable)**

表示服务器无法生成客户端可以接受的响应格式。通常出现在客户端的 Accept 头与服务器支持的响应格式不匹配时。

1.  **RequestTimeoutException (408 Request Timeout)**

表示客户端**请求超时**。服务器在等待请求时超过了设定的时间限制。

1.  **ConflictException (409 Conflict)**

表示请求与服务器的当前状态存在冲突。例如，创建资源时，资源已经存在。

1.  **GoneException (410 Gone)**

表示请求的资源已经永久不可用，并且不会再恢复。常用于删除的资源。

1.  **HttpVersionNotSupportedException (505 HTTP Version Not Supported)**

表示服务器不支持客户端请求的 HTTP 协议版本。

1.  **PayloadTooLargeException (413 Payload Too Large)**

表示客户端发送的数据体（如上传文件）超过了服务器允许的大小限制。

1.  **UnsupportedMediaTypeException (415 Unsupported Media Type)**

表示客户端请求的媒体类型不被服务器支持。例如，上传文件的格式不被接受。

1.  **UnprocessableEntityException (422 Unprocessable Entity)**

表示服务器理解客户端的请求内容，但由于语义错误而无法处理。例如，输入数据的格式正确但内容无效。

1.  **InternalServerErrorException (500 Internal Server Error)**

表示**服务器**在处理请求时遇到了**内部错误**。是一个通用的错误状态码，表示服务器无法处理请求。

1.  **NotImplementedException (501 Not Implemented)**

表示服务器不支持请求的方法。通常用于服务器不支持客户端请求的功能时。

1.  **ImATeapotException (418 I’m a teapot)**

这是一个愚人节玩笑性质的 HTTP 状态码，表示服务器拒绝酿茶的请求（参见 IETF RFC 2324）。常用于测试或幽默场景。

1.  **MethodNotAllowedException (405 Method Not Allowed)**

表示**请求的方法（如 GET、POST）在目标资源中不可用**。例如，资源只支持 GET 请求，而客户端使用了 POST。

1.  **BadGatewayException (502 Bad Gateway)**

表示服务器作为网关或代理时，从上游服务器接收到无效响应。

1.  **ServiceUnavailableException (503 Service Unavailable)**

表示服务器暂时无法处理请求，通常是因为过载或维护。

1.  **GatewayTimeoutException (504 Gateway Timeout)**

表示服务器作为网关或代理时，从上游服务器接收响应超时。

1.  **PreconditionFailedException (412 Precondition Failed)**

表示客户端发送的请求没有满足服务器的某些前置条件。例如，If-Match 头字段的条件不满足。

以上各种类型都可以从 `@nestjs/common` 包中导出使用，例如 `BadRequestException`：

```typescript
// app.controller.ts
import { BadRequestException } from "@nestjs/common";

@Controller()
export class UsersController {
  @Get("test-error")
  testError() {
    throw new BadRequestException("测试错误");
  }
}
```

![image 1.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/85bef1e602014f30b0e723a4e61b27b5~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761404663&x-signature=o4ztHkZLvV57TlPj%2FNa3xIYFXwg%3D)

## 3\. 自定义 HTTP 异常过滤器

### 3.1 方法1：实现 **`ExceptionFilter` 接口**

自定义的异常过滤器需要实现 `ExceptionFilter` 接口的 `catch` 方法：

```typescript
// src/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

在上面的示例中通过 `@Catch()` 装饰器\*\*指定要捕获的异常类型（\*\*只捕获 `HttpException`）。

`@Catch()` 装饰器也支持可以采用单个参数或逗号分隔的列表，这可以同时**为多种类型的异常设置过滤器**。

如果没有在 `@Catch()` 中指定异常类型，过滤器**将捕获所有异常类型**。这对于全局异常处理非常有用。

### 3.2 方法2：继承 `HttpException` 类

自定义的 `CustomHttpException` 类继承 `HttpException` 类：

```typescript
// src/custom-http-exception.filter.ts
import { HttpException } from "@nestjs/common";

export class CustomHttpException extends HttpException {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);
  }
}
```

使用 `CustomHttpException` 类实例抛出异常：

```typescript
// app.controller.ts

@Get('custom')
getCustom(){
  throw new CustomHttpException('后山乃禁地！', HttpStatus.FORBIDDEN)
}
```

![image 2.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/a9aa60c39eee4ec1b7664ff33be2300e~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761404663&x-signature=GR6kM2jfqdOrssI3wSIpmoUfVyk%3D)

## 4\. 绑定范围

过滤器可以绑定的范围有：

- HTTP 方法
- 控制器
- 全局范围

### 4.1 HTTP 方法

使用 `@UseFilters()` 装饰器可以使得过滤器只在指定 HTTP 方法下起作用：

```less
// users.controller.ts
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('custom')
  @UseFilters(new HttpExceptionFilter())
  // @UseFilters(HttpExceptionFilter)
  getCustom() {
    throw new HttpException(
      {
        status: HttpStatus.FORBIDDEN,
        message: '后山乃禁地！请速速离去！',
        error: 'Forbidden',
      },
      403,
    );
  }
}
```

装饰器中的参数既可以传递一个过滤器的实例（`new HttpExceptionFilter()`），也可以传递一个类（`HttpExceptionFilter`）。

![image 3.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/9d1dcb10d43e4a4bb590578f6447df9e~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761404663&x-signature=UnyRGsDx2dL2PJqX8j6ERxCLRog%3D)

### 4.2 控制器

也可以在指定的控制器下使用 `@UseFilters()` 装饰器：

```less
@controller ('users')
@UseFilters(HttpExceptionFilter)
export class UsersController {
  // ...
}
```

这样就不用给该控制器下的所有 HTTP 方法都添加装饰器了。

### 4.3 全局应用

使用 `app.useGlobalFilters()` 方法来注册全局异常过滤器：

```csharp
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(FuelStationModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}

bootstrap();
```

设置完成后，应用的所有控制器和方法都加上了过滤器，这样应用的任何地方抛出的异常都会被全局捕获，可以确保一致性和可控的错误响应格式。

但是这种方式并不能灵活地与依赖注入的特性相结合，NestJS 提供了另一种全局绑定过滤器的方式：

```perl
// app.module.ts

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
```

## **5\. 日志记录与异常过滤器**

### 5.1 **记录异常日志（**`Logger`**）**

通过 NestJS 的 `Logger` 服务记录异常详细信息，以便在应用崩溃时追踪问题。

```typescript
// http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // 获取请求上下文
    const response = ctx.getResponse<Response>(); // 获取响应对象
    const request = ctx.getRequest<Request>(); // 获取请求对象
    const status = exception.getStatus(); // 获取异常状态码

    const message = exception.message
      ? exception.message
      : `${status >= 500 ? "服务器错误（Service Error）" : "客户端错误（Client Error）"}`;

    const nowTime = new Date().getTime();

    const errorResponse = {
      data: {},
      message,
      code: -1,
      date: nowTime,
      path: request.url,
    };

    // 记录日志到控制台
    this.logger.error(
      `【${nowTime}】${status} ${request.method} ${request.url} query:${JSON.stringify(request.query)} params:${JSON.stringify(
        request.params
      )} body:${JSON.stringify(request.body)}`,
      JSON.stringify(errorResponse),
      HttpExceptionFilter.name
    );

    response.status(status).json(errorResponse);
  }
}
```

```less
// users.controller.ts
@Get('custom')
@UseFilters(new HttpExceptionFilter(new Logger('UsersController')))
getCustom() {
  throw new HttpException(
    {
      status: HttpStatus.FORBIDDEN,
      message: '后山乃禁地！请速速离去！',
      error: 'Forbidden',
    },
    403,
  );
}
```

![image 4.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/cb6e1175c3ed4eb39b18fce49b469e44~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6I-g6JCd55qE6Jyc:q75.awebp?rk3s=f64ab15b&x-expires=1761404663&x-signature=yaczYyj6zXK9sVsa9LxCYcLQgEQ%3D)

或是依赖注入现有日志服务（[nestjs-pino](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fiamolegga%2Fnestjs-pino "https://github.com/iamolegga/nestjs-pino")）：

```typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logService: LogService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    this.logService.logError(exception);
    // 处理异常
  }
}
```

### 5.2 **将错误信息发送到外部监控服务（如 Sentry）**

集成外部监控服务，如 Sentry，来捕获和分析错误日志：

```typescript
import * as Sentry from "@sentry/node";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    Sentry.captureException(exception);
    // 处理异常
  }
}
```

## 6\. 总结

异常过滤器是 NestJS 提供的强大工具，用于捕获和处理应用中的异常。通过自定义和全局应用过滤器，开发者可以确保异常处理的一致性，并提升应用的健壮性和用户体验。在复杂项目中，不同模块和服务可以使用不同的过滤器来处理特定场景下的异常。
