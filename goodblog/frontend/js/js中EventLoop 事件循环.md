---
title: js中EventLoop 事件循环
slug: jseve8314vv
excerpt: 什么是事件循环？
published: true
featured: false
category: frontend
publishedAt: 2024-03-15T00:00:00.000Z
readingTime: 1
---

#### 什么是事件循环？

- 同步和异步任务分别进入不同的执行"场所"，同步的进入主线程，异步的进入 Event Table 并注册函数。
- 当指定的事情完成时，Event Table 会将这个函数移入 Event Queue。
- 主线程内的任务执行完毕为空，会去 Event Queue 读取对应的函数，进入主线程执行。
- 上述过程会不断重复，也就是常说的 Event Loop(事件循环)。
- js 引擎存在 monitoring process 进程，会持续不断的检查主线程执行栈是否为空，一旦为空，就会去 Event Queue 那里检查是否有等待被调用的函数。

#### 什么是宏任务和微任务

在 JavaScript 中，任务分为宏任务（Macro Task）和微任务（Micro Task），它们的执行顺序是不同的。

常见的宏任务和微任务如下：

- 宏任务：包括但不限于以下几种：
- 脚本（整体代码）
- `setTimeout` 和 `setInterval`
- I/O 操作
- UI rendering
  微任务：包括但不限于以下几种：
- `Promise.then(`) 和 `Promise.catch()`
- `process.nextTick` (Node.js 环境中)
- `MutationObserver`(监视对 DOM 树所做更改)

不同类型的任务会进入对应的 Event Queue，比如`setTimeout`和`setInterval`会进入相同的 Event Queue。

事件循环的顺序，决定 js 代码的执行顺序。进入整体代码(宏任务)后，开始第一次循环。接着执行所有的微任务。然后再次从宏任务开始，找到其中一个任务队列执行完毕，再执行所有的微任务。

```js
setTimeout(function () {
  console.log("setTimeout");
});

new Promise(function (resolve) {
  console.log("promise");
}).then(function () {
  console.log("then");
});

console.log("console");
```

- 这段代码作为宏任务，进入主线程。
- 先遇到`setTimeout`，那么将其回调函数注册后分发到宏任务 Event Queue。(注册过程与上同，下文不再描述)
- 接下来遇到了`Promise`，`new Promise`立即执行，`then`函数分发到微任务 Event Queue。
- 遇到`console.log()`，立即执行。
- 好啦，整体代码 script 作为第一个宏任务执行结束，看看有哪些微任务？我们发现了`then`在微任务 Event Queue 里面，执行。
- ok，第一轮事件循环结束了，我们开始第二轮循环，当然要从宏任务 Event Queue 开始。我们发现了宏任务 Event Queue 中`setTimeout`对应的回调函数，立即执行。
- 结束。

事件循环，宏任务，微任务的关系如图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/11/21/15fdcea13361a1ec~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.image)
