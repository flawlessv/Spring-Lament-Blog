---
title: 深入理解SSE和WebSocket的区别与应用场景
slug: sse-websocket-diff
excerpt: 背景介绍
published: true
featured: false
category: 前端
publishedAt: 2025-07-30T00:00:00.000Z
readingTime: 4
coverImage: https://haowallpaper.com/link/common/file/previewFileImg/17640593740385664
---

## 1. 背景介绍

在现代Web开发中，实时数据推送已经成为不可或缺的功能。从股票价格更新到聊天应用，从实时监控到AI对话，都需要服务器能够主动向客户端推送数据。目前主流的实时通信技术包括SSE（Server-Sent Events）和WebSocket，它们各有特点，适用于不同的应用场景。

本文将深入探讨SSE和WebSocket的技术原理、区别对比以及实际应用场景，帮助开发者选择合适的技术方案。

## 2. 什么是SSE

SSE（Server-Sent Events）是一种用于实现服务器主动向客户端推送数据的技术，也被称为"事件流"（Event Stream）。它基于HTTP协议，利用了其长连接特性，在客户端与服务器之间建立一条持久化连接，并通过这条连接实现服务器向客户端的实时数据推送。

### 1.2.1. SSE的核心特点

- **基于HTTP协议**：使用标准的HTTP连接，无需额外的协议支持
- **单向通信**：只能从服务器向客户端推送数据
- **自动重连**：浏览器会自动处理连接断开和重连
- **事件驱动**：支持自定义事件类型和数据结构
- **简单易用**：使用标准的EventSource API

## 3. SSE技术的基本原理

SSE的工作原理相对简单，主要包含以下几个步骤：

1. **建立连接**：客户端向服务器发送一个GET请求，带有指定的header，表示可以接收事件流类型，并禁用任何的事件缓存。

2. **服务器响应**：服务器返回一个响应，带有指定的header，表示事件的媒体类型和编码，以及使用分块传输编码（chunked）来流式传输动态生成的内容。

3. **数据推送**：服务器在有数据更新时，向客户端发送一个或多个名称：值字段组成的事件，由单个换行符分隔。事件之间由两个换行符分隔。服务器可以发送事件数据、事件类型、事件ID和重试时间等字段。

4. **客户端处理**：客户端使用EventSource接口来创建一个对象，打开连接，并订阅onopen、onmessage和onerror等事件处理程序来处理连接状态和接收消息。

5. **连接管理**：客户端可以使用GET查询参数来传递数据给服务器，也可以使用close方法来关闭连接。

## 4. SSE和WebSocket的详细对比

SSE和WebSocket都是实现服务器向客户端实时推送数据的技术，但它们在多个方面存在显著差异。

### 1.4.1. 技术实现层面

| 特性           | SSE                          | WebSocket                                  |
| -------------- | ---------------------------- | ------------------------------------------ |
| **协议基础**   | 基于HTTP协议，利用长连接特性 | 通过HTTP升级协议建立新的TCP连接            |
| **连接方式**   | 标准HTTP请求，建立持久化连接 | 特殊的升级协议（HTTP/1.1 Upgrade或HTTP/2） |
| **实现复杂度** | 简单，基于现有HTTP基础设施   | 相对复杂，需要处理协议升级                 |

### 1.4.2. 数据通信模式

| 特性         | SSE                   | WebSocket              |
| ------------ | --------------------- | ---------------------- |
| **通信方向** | 单向（服务器→客户端） | 双向（客户端↔服务器） |
| **数据格式** | 主要支持文本格式      | 支持文本和二进制格式   |
| **消息大小** | 受HTTP限制            | 无严格限制             |
| **消息类型** | 支持自定义事件类型    | 支持任意消息类型       |

### 1.4.3. 连接状态管理

**SSE连接状态**：

- 已连接（CONNECTING）
- 连接中（OPEN）
- 已断开（CLOSED）

连接状态由浏览器自动维护，客户端无法手动关闭或重新打开连接。

**WebSocket连接状态**：

- 连接中（CONNECTING）
- 已连接（OPEN）
- 关闭中（CLOSING）
- 已关闭（CLOSED）

WebSocket连接状态更灵活，可以手动打开、关闭、重连等。

### 1.4.4. 兼容性和安全性

| 特性             | SSE                                | WebSocket                                         |
| ---------------- | ---------------------------------- | ------------------------------------------------- |
| **浏览器兼容性** | 现代浏览器支持良好，IE需要polyfill | 现代浏览器支持良好，部分老版本Android有兼容性问题 |
| **安全性**       | 基于HTTP，风险相对较低             | 需要额外安全措施（SSL/TLS）                       |
| **防火墙友好性** | 基于HTTP，穿透性好                 | 可能需要特殊配置                                  |

## 5. SSE适用场景详解

SSE特别适用于以下场景：

### 1.5.1. 实时数据展示

- **股票价格更新**：服务器根据股市变化，实时推送股票价格给客户端
- **新闻实时推送**：服务器根据新闻更新，实时推送新闻内容或标题
- **实时监控大屏**：展示设备状态、系统指标等实时数据

### 1.5.2. 单向通知系统

- **系统通知**：推送系统维护、更新等通知信息
- **状态更新**：推送任务进度、处理状态等信息
- **事件广播**：向多个客户端广播同一事件

### 1.5.3. AI对话应用

ChatGPT等AI应用就是使用SSE技术实现流式响应，让用户能够实时看到AI的回复过程。

### 1.5.4. SSE场景特点总结

- **数据更新频繁**：服务器需要不断推送最新数据
- **低延迟要求**：需要尽快推送数据，避免延迟
- **单向通信**：只需要服务器向客户端推送数据
- **简单实现**：基于HTTP，易于实现和维护

## 6. EventSource API详细用法

EventSource是用于接收服务器发送事件的Web API接口。以下是详细的使用方法：

### 1.6.1. 基本用法

```javascript
// 创建EventSource对象
const evtSource = new EventSource("sse.php");

// 监听连接打开事件
evtSource.addEventListener("open", (e) => {
  console.log("Connection opened");
});

// 监听消息事件
evtSource.addEventListener("message", (e) => {
  console.log("Data: " + e.data);
});

// 监听错误事件
evtSource.addEventListener("error", (e) => {
  console.log("Error: " + e.message);
});

// 监听自定义事件
evtSource.addEventListener("notice", (e) => {
  console.log("Notice: " + e.data);
});

// 关闭连接
evtSource.close();
```

### 1.6.2. 服务器端实现

在服务器端，需要使用`text/event-stream`作为响应的Content-Type，并按照特定格式发送数据：

```javascript
// Node.js Express示例
app.get("/sse", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
  });

  // 发送数据
  res.write(`event: notice\ndata: Hello, world!\nid: 1\n\n`);

  // 定期发送数据
  const interval = setInterval(() => {
    res.write(`data: ${new Date().toISOString()}\n\n`);
  }, 1000);

  // 客户端断开连接时清理
  req.on("close", () => {
    clearInterval(interval);
  });
});
```

### 1.6.3. 数据格式规范

SSE消息格式包含以下字段：

- **event**：事件名称（可选）
- **data**：数据内容（必需）
- **id**：事件标识符（可选）
- **retry**：重连时间间隔（可选）

每个字段必须以换行符（`\n`）结尾，消息之间用两个换行符（`\n\n`）分隔。

## 7. 实际应用示例

### 1.7.1. 实时股票价格推送

```javascript
// 客户端代码
const stockSource = new EventSource("/api/stock-prices");

stockSource.addEventListener("price-update", (e) => {
  const data = JSON.parse(e.data);
  updateStockPrice(data.symbol, data.price);
});

// 服务器端代码
app.get("/api/stock-prices", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  // 模拟股票价格更新
  setInterval(() => {
    const stockData = {
      symbol: "AAPL",
      price: Math.random() * 200 + 100,
    };

    res.write(`event: price-update\ndata: ${JSON.stringify(stockData)}\n\n`);
  }, 1000);
});
```

### 1.7.2. AI对话流式响应

```javascript
// 客户端代码
const chatSource = new EventSource("/api/chat-stream");

chatSource.addEventListener("message", (e) => {
  const chunk = e.data;
  if (chunk === "[DONE]") {
    chatSource.close();
    return;
  }

  appendToChat(chunk);
});

// 服务器端代码
app.post("/api/chat-stream", async (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const { message } = req.body;

  // 模拟AI响应
  const response = "这是一个AI的回复，将会逐字显示...";

  for (let i = 0; i < response.length; i++) {
    res.write(`data: ${response[i]}\n\n`);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  res.write("data: [DONE]\n\n");
});
```

## 8. 最佳实践和注意事项

### 1.8.1. 错误处理

```javascript
evtSource.addEventListener("error", (e) => {
  if (e.target.readyState === EventSource.CLOSED) {
    console.log("Connection closed");
  } else if (e.target.readyState === EventSource.CONNECTING) {
    console.log("Attempting to reconnect...");
  }
});
```

### 1.8.2. 重连机制

SSE内置了自动重连机制，但可以通过retry字段控制重连间隔：

```javascript
// 服务器端设置重连时间
res.write("retry: 5000\n\n"); // 5秒后重连
```

### 1.8.3. 性能优化

- 合理设置数据推送频率
- 避免发送过大的数据块
- 及时关闭不需要的连接

### 1.8.4. 安全性考虑

- 使用HTTPS确保数据传输安全
- 实现适当的身份验证机制
- 限制连接数量和频率

## 9. 总结

SSE和WebSocket都是优秀的实时通信技术，但它们适用于不同的场景：

**选择SSE的场景**：

- 只需要服务器向客户端推送数据
- 基于HTTP协议，实现简单
- 需要良好的浏览器兼容性
- 对安全性要求不是特别高

**选择WebSocket的场景**：

- 需要双向通信
- 需要传输二进制数据
- 对性能要求较高
- 需要自定义协议

在实际开发中，应该根据具体的业务需求、技术栈和性能要求来选择合适的方案。对于大多数单向数据推送场景，SSE是一个更加轻量级、易于实现和维护的选择。

## 10. 扩展阅读

- [MDN EventSource文档](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)
- [WebSocket API文档](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Server-Sent Events规范](https://html.spec.whatwg.org/multipage/server-sent-events.html)
