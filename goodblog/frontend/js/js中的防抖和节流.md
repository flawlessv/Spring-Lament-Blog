---
categories: JS
tags:
  - JavaScript
date: 2023-02-02T00:00:00.000Z
title: js中的防抖和节流
recommend: false
id: js6ccpia
---

在`JavaScript`中，防抖`（Debouncing）`和节流`（Throttling`）是常见的两种性能优化技术，它们可以提高`Web`应用程序的性能，避免过多地触发事件或请求。

防抖：防抖指的是在短时间内多次触发同一函数时，只执行最后一次并忽略前面的所有调用。适用场景如下：
页面滚动、窗口大小调整等需要频繁进行操作的场景
输入框输入搜索关键词时，连续输入太快导致频繁发出网络请求的问题
防抖可以通过`setTimeout()`函数来实现，在每次事件被触发时取消之前的定时器并重新设置一个新的定时器。例如：

```js
function debounce(callback, delay) {
  let timerId = null;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timerId);
    timerId = setTimeout(function () {
      callback.apply(context, args);
    }, delay);
  };
}
document.addEventListener(
  "scroll",
  debounce(function () {
    // 滚动事件处理代码
  }, 100)
);
```

节流：节流指的是限制函数的执行频率，即每隔一定期间仅执行一次。适用场景如下：
页面滚动时，连续触发`scroll`事件，但如果每次都执行事件处理函数会造成页面卡顿
鼠标不断点击导致在短时间内多次触发事件，需要限制点击响应的频率
节流可以使用`setTimeout()`或`时间戳`函数来实现。例如：

```js
// 使用时间戳
function throttle(func, wait) {
  let preTime = 0;

  return function () {
    let nowTime = +new Date();
    let context = this;
    let args = arguments;

    if (nowTime - preTime > wait) {
      func.apply(context, args);
      preTime = nowTime;
    }
  };
}

// 定时器实现
function throttle(func, wait) {
  let timeout;

  return function () {
    let context = this;
    let args = arguments;

    if (!timeout) {
      timeout = setTimeout(function () {
        timeout = null;
        func.apply(context, args);
      }, wait);
    }
  };
}
```

需要注意的是，在实际应用中，防抖和节流都需要根据具体情况进行调整。防抖过程中如果延迟时间太长可能会导致响应不及时，而如果延迟时间太短又会造成反复触发。同样地，节流的时间间隔也需要根据业务需求和性能要求做出调整。
