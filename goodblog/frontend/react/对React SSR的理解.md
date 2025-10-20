---
title: 对React SSR的理解
slug: reactgdaxcs
excerpt: 什么是React SSR
published: true
featured: false
category: happy-life
publishedAt: 2023-08-18T00:00:00.000Z
readingTime: 1
---

### 什么是React SSR

服务端渲染是数据与模版组成的html，即 HTML = 数据 ＋ 模版。将组件或页面通过服务器生成html字符串，再发送到浏览器，最后将静态标记"混合"为客户端上完全交互的应用程序。页面没使用服务渲染，当请求页面时，返回的body里为空，之后执行js将html结构注入到body里，结合css显示出来;

**SSR的优势：**

- 对SEO友好
- 所有的模版、图片等资源都存在服务器端
- 一个html返回所有数据
- 减少HTTP请求
- 响应快、用户体验好、首屏渲染快

**1）更利于SEO**

不同爬虫工作原理类似，只会爬取源码，不会执行网站的任何脚本使用了React或者其它MVVM框架之后，页面大多数DOM元素都是在客户端根据js动态生成，可供爬虫抓取分析的内容大大减少。另外，浏览器爬虫不会等待我们的数据完成之后再去抓取页面数据。服务端渲染返回给客户端的是已经获取了异步数据并执行JavaScript脚本的最终HTML，网络爬中就可以抓取到完整页面的信息。

**2）更利于首屏渲染**

首屏的渲染是node发送过来的html字符串，并不依赖于js文件了，这就会使用户更快的看到页面的内容。尤其是针对大型单页应用，打包后文件体积比较大，普通客户端渲染加载所有所需文件时间较长，首页就会有一个很长的白屏等待时间。

**SSR的局限：**

**1）服务端压力较大**

本来是通过客户端完成渲染，现在统一到服务端node服务去做。尤其是高并发访问的情况，会大量占用服务端CPU资源;

**2）开发条件受限**

在服务端渲染中，只会执行到componentDidMount之前的生命周期钩子，因此项目引用的第三方的库也不可用其它生命周期钩子，这对引用库的选择产生了很大的限制;

**3）学习成本相对较高** 除了对webpack、MVVM框架要熟悉，还需要掌握node、 Koa2等相关技术。相对于客户端渲染，项目构建、部署过程更加复杂。

**时间耗时比较：**

**1）数据请求**

由服务端请求首屏数据，而不是客户端请求首屏数据，这是"快"的一个主要原因。服务端在内网进行请求，数据响应速度快。客户端在不同网络环境进行数据请求，且外网http请求开销大，导致时间差

- 客户端数据请求

![51612599334_.pic.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4df605c1333247919058d218a38779f0~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.image)

- 服务端数据请求

![61612599340_.pic.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d7c77623c784e6db840253132df5a35~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.image) **2）html渲染** 服务端渲染是先向后端服务器请求数据，然后生成完整首屏 html返回给浏览器；而客户端渲染是等js代码下载、加载、解析完成后再请求数据渲染，等待的过程页面是什么都没有的，就是用户看到的白屏。就是服务端渲染不需要等待js代码下载完成并请求数据，就可以返回一个已有完整数据的首屏页面。

- 非ssr html渲染

![31612599269_.pic.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2493e474a224b51b0ae7b86756c11af~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.image)

- ssr html渲染

![41612599275_.pic.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d8f003d0d274b3c9da0cc4741b0c364~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.image)
