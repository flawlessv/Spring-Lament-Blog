# 2025 年还有前端不会 Nodejs ？大家好，我是双越老师。很多前端同学想做 AI 开发但是不会 Nodejs ，本 - 掘金

## 开始

[Nodejs](https://link.juejin.cn/?target=https%3A%2F%2Fnodejs.org%2Fzh-cn "https://nodejs.org/zh-cn") 于 2009 年发布，现在 2025 年 8 月已经更新到 v24 版本，现在几乎所有的开放平台、云服务、Serverless 等都支持 Nodejs 。它早已经成为最热门的开发语言之一，而且随着国外对于 SSR 全栈的推广，还在继续扩展它的影响范围。

还有，如果你作为前端人员想接触 AI 开发，最便捷的方式就是使用 Nodejs 作为开发语言，学习成本最低。

接下来我试图用一篇文章，用最简单的方式，帮助各位前端开发人员入门 Nodejs ，其他它很简单。你先不要看 Nodejs 文档，你先按照我的学习方式来。

学习要求：

- 熟悉 JS 语法，熟悉 npm 使用
- 熟悉 HTTP 协议，做过 ajax 请求

## JS runtime 运行时

一段 JS 代码或其他编程代码，本质上就是一段字符串，就跟我们随便写一句话、一段话一样，都是字符串。

```javascript
console.log("hello world");
```

一段字符串能干嘛？能看，能读，能写，能复制，能粘贴。如果是富文本能设置一下颜色字体大小等...

它能被执行吗？

如果我们拷贝一段 JS 代码，穿越到 JS 语言发明之前的 90 年代（那会儿 PC 技术已经很发达了，盖茨早就世界首富了），你如何执行它？不能。

最开始 JS 代码（字符串）是在浏览器中执行的。浏览器中内置了 JS 解释器，然后你在 html 代码中通过特定的语法 `<script>` 标签内嵌 JS 代码，浏览器识别以后执行这段 JS 代码。

**一个语言的执行环境，我们就称为 runtime “运行时”**，没有 runtime 代码就无法被执行，就是一堆字符串，任何语言都需要 runtime 。

Nodejs 就是继浏览器以后第二个 JS 代码的 runtime 运行时。从此以后，JS 代码不只能运行在浏览器了，它还可以运行在 Nodejs 环境。而 Nodejs 可以被安装在任何操作系统中（windows mac linux 等），也就是说 JS 代码可以在任何电脑上运行，即便没有浏览器也可以运行。

现在的 JS 运行时除了浏览器、Nodejs 之外还有 Deno Bun ，这俩用途都和 Nodejs 类似，而且目前尚未全面流行，你可以先保持观察，不用深入。

## 安装 Nodejs 并写 demo

现代前端开发都是用 npm 管理插件，用 nodejs 支持打包工具，所以你应该是安装了 nodejs 的。

如果没有安装，就[下载](https://link.juejin.cn/?target=https%3A%2F%2Fnodejs.org%2Fzh-cn%2Fdownload "https://nodejs.org/zh-cn/download")安装一下，安装完以后打开控制台输入一下命令，可以看到 Nodejs 的版本。

```css
node --version
npm --version
```

然后在控制台输入 `node` 即可进入 nodejs 环境，可输入任何 JS 代码，按 `ctrl+c` 退出

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/3547ddcc531840a584ddd855891a9b89~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5Y-M6LaK6ICB5biI:q75.awebp?rk3s=f64ab15b&x-expires=1761696653&x-signature=S9WfN0UfdOEVpf8wdeyQeaJASWk%3D)

你可以创建一个 `.js` 文件，然后使用 `node` 命令来执行它。例如我在当前的 `src` 目录下创建了 `test.js` 文件

```php
// src/test.js
function fn() {
  console.log('this is a test file')
}

fn()
```

然后使用 `node` 命令执行它，即可打印预期的结果

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/d829d05ad347464684290b994e833413~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5Y-M6LaK6ICB5biI:q75.awebp?rk3s=f64ab15b&x-expires=1761696653&x-signature=9BY%2BTDoJkZBrCMJH36Vt1Tkd2hs%3D)

## 不能使用浏览器 API

Nodejs 运行时可以执行 JS 代码，但你不能使用浏览器 API ，因为这里根本没有浏览器

例如我在 Nodejs 环境执行 `alert('hello')` 就报错了 `alert is not defined` 即 `alert` 没有定义，Nodejs 中没有 `alert` ，只有浏览器中才有 `alert` 。

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/a5208b012a7b45c29de445771bd61482~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5Y-M6LaK6ICB5biI:q75.awebp?rk3s=f64ab15b&x-expires=1761696653&x-signature=z8ZEW6yVNg9sHy2OI7urjjKWL%2FI%3D)

所以，JS 语法和浏览器 API 要分开来看，他俩也压根不是一个东西，只是初学者一块学习就容易混在一块。

常见的浏览器 API 还有：

- DOM 操作，如 `document` `getElementById` `createElement` `appendChild` 等
- DOM 事件，如 `addEventListener`
- BOM 操作，如 `window` `navigation` `sreen` 等
- `XMLHTTPRequest` ，但 `fetch` 是可以在 Nodejs 中使用的

## Nodejs 内置的 API

Nodejs 不能使用浏览器 API ，这个好理解，因为不是浏览器环境。

但如果 Nodejs 只能执行 JS 语法，没有其他 API 这也不行啊。因为光有 JS 语法，写个函数、做个计算、打印个字符串等，解决不了具体的问题呀。

所以，Nodejs 也需要提供（内置）其他 API 让我们能开发具体的功能。

Nodejs 是作为一个软件安装在操作系统上的，所以 Nodejs 提供了关于操作系统的 API

新建一个文件 `os.js` 写入如下代码

```lua
// src/os.js

const os = require('os') // 和 import 语法类似

function getSystemInfo() {
  return {
    platform: os.platform(),
    type: os.type(),
    architecture: os.arch(),
    cpuCount: os.cpus().length,
    cpuModel: os.cpus()[0].model,
    totalMemoryGB: Math.round(os.totalmem() / 1024 / 1024 / 1024),
    hostname: os.hostname(),
  }
}

const systemInfo = getSystemInfo()
console.log(systemInfo)
```

然后在控制台使用 `node` 命令执行这个文件，即可打印我当前的系统信息

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/657c9ee3c3e14fd3b1bc6921d6a2045b~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5Y-M6LaK6ICB5biI:q75.awebp?rk3s=f64ab15b&x-expires=1761696653&x-signature=IZ5sNCu5jHUnZUWVBhNMvZazVeU%3D)

至此就能开始体现 Nodejs 和浏览器 JS 的区别了。你一定要注意去观察和思考这种区别，以及两者不同的用途，这个很重要。

像以上这些 OS 的信息，浏览器能获取吗？当然不能。浏览器是客户端，如果能轻松获取 OS 信息，那就是安全漏洞。而 Nodejs 是服务端或者本机，我自己获取我自己的 OS 信息，这肯定是没问题的。

获取 OS 信息这个功能不常用，这也只是一个简单的例子，接下来我们才正式开始写一些实际的功能。

## 文件 API

Nodejs 是作为一个软件安装在操作系统上的，文件是操作系统的数据组织方式，所以 Nodejs 作为服务端语言要能操作文件，如创建文件、读取文件、修改文件、删除文件、复制文件等操作。

新建一个 js 文件 `src/file.js` 写入如下代码

首先，引入 `fs` `path` 两个模块。其中 `fs` 就是 `file system` 文件系统，用于操作文件，`path` 用于操作文件路径。

```javascript
const fs = require("fs");
const path = require("path");
```

然后定义文件路径，我们计划在 `file` 目录下创建 `data.txt` 文件

```csharp
// 定义文件路径
const fileDir = path.join(__dirname, '../file')
const filePath = path.join(fileDir, 'data.txt')
```

然后创建文件

```javascript
// 功能1: 在 /file 目录下创建 data.txt 文件并写入内容
function createAndWriteFile() {
  // 确保文件目录存在，否则先目录和文件
  if (!fs.existsSync(fileDir)) {
    fs.mkdirSync(fileDir, { recursive: true }); // 创建目录和文件
    console.log("创建目录:", fileDir);
  }

  // 写入文件内容
  fs.writeFileSync(filePath, content, "utf8"); // 写入内容
  console.log("文件创建成功:", filePath);
  console.log("写入内容:", content);
}

createAndWriteFile();
```

在控制台执行 `node src/file.js` 可以看到 `data.txt` 文件被创建出来了

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/2180f52bc5454ac3b2a1f113b5bea7cd~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5Y-M6LaK6ICB5biI:q75.awebp?rk3s=f64ab15b&x-expires=1761696653&x-signature=07v8%2FG10vjmdxyMbgFzbCaz5MFA%3D)

然后继续写代码，读取文件内容

```kotlin
// 功能2: 读取文件内容
function readFile() {
  try {
    const data = fs.readFileSync(filePath, 'utf8') // 读取文件内容
    console.log('读取的文件内容:', data)
    return data
  } catch (error) {
    console.error('读取文件失败:', error.message)
    return null
  }
}
readFile()
```

在控制台执行 `node src/file.js` 可以看到读取了正确的文件内容

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/d7fc2eaaca3040eaa7bc0b55c63c47ac~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5Y-M6LaK6ICB5biI:q75.awebp?rk3s=f64ab15b&x-expires=1761696653&x-signature=Ouc%2FSs3d6qTNGpD89agydWR4V%2BQ%3D)

Nodejs 还有更多文件操作的 API ，你可以咨询 AI 或让 AI 给你写出 demo

## HTTP 服务

Nodejs 对前端人员最大的赋能就是：可以开发服务端，可以前后端都做，可以做全栈开发。

前端主要开发 HTML CSS JS ，通过 ajax 访问服务端 API 接口获取 JSON 数据，然后渲染到页面上。

服务端开发，最主要的就是 API 接口，接收前端 ajax 请求，获取数据，最后返回数据给前端。

新建一个 js 文件 `src/http.js` 写入如下内容

- 引入 Nodejs 内置的 `http` 模块，用于启动 HTTP 服务
- 通过 `createServer` 创建一个 HTTP 服务，函数内的两个参数分别代表 `Request` 和 `Response` ，这两个是 HTTP 协议的基础知识 —— 你写前端 ajax 也用得着，默认你已经熟知
- 函数内，通过 `res.setHeader` 设置 HTTP header（前端 ajax 也需要设置 header），返回格式为 JSON
- 函数内，通过 `res.end` 返回本次请求的内容，要返回字符串格式
- 通过 `server.listen` 监听 3000 端口

```javascript
const http = require("http");

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
  // 设置响应头为 JSON 格式
  res.setHeader("Content-Type", "application/json");

  // 创建要返回的 JSON 数据
  const response = {
    message: "Hello World!",
    time: new Date().toLocaleString(),
    status: "success",
  };

  // 返回 JSON 响应
  res.end(JSON.stringify(response, null, 2));
});

// 监听 300 端口
server.listen(3000, () => {
  console.log("HTTP 服务器已启动，监听端口: 3000");
  console.log("访问地址: http://localhost:3000");
});
```

在控制台运行 `node src/http.js` 可启动本地的 HTTP 服务，并监听 3000 端口

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/493d7b555ee24415a8071b879db52350~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5Y-M6LaK6ICB5biI:q75.awebp?rk3s=f64ab15b&x-expires=1761696653&x-signature=%2BpijduETDf1i4FXLfDTBX94TSKU%3D)

使用浏览器访问 `localhost:3000` 可以看到服务端返回的 JSON 内容，说明 API 接口成功了

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/f0d2d3cb6d064ec4a53890aec8d6ece4~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5Y-M6LaK6ICB5biI:q75.awebp?rk3s=f64ab15b&x-expires=1761696653&x-signature=equMbhJBCNmuoj0fO63ybFkJYIw%3D)

以上最简单的 get 请求，而且没有判断路由，下面再来一个稍微复杂一点的例子。

新建一个 JS 文件 `src/http-post.js` 代码如下，模拟一个创建用户的 API 接口

- 使用 `req.method` 可以获得前端 ajax 请求的 method ，这里规定必须是 `POST`
- 使用 `req.url` 可以获得前端 ajax 请求的路由，这里规定必须是 `/api/user`
- 使用 `req.on('data', (chunk) => { })` 可以接收到客户端传递过来的 request body 数据

```javascript
const http = require("http");

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
  // 设置响应头为 JSON 格式
  res.setHeader("Content-Type", "application/json");

  // 检查是否为 POST 请求且路由为 /api/user
  if (req.method === "POST" && req.url === "/api/user") {
    let body = "";

    // 接收数据
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    // 数据接收完成
    req.on("end", () => {
      try {
        // 解析 JSON 数据
        const userData = JSON.parse(body);

        // 打印接收到的数据
        console.log("接收到的用户数据:", userData);
        console.log("userId:", userData.userId);
        console.log("name:", userData.name);
        console.log("email:", userData.email);

        // TODO...

        // 返回成功响应
        const response = {
          status: "success",
        };

        res.statusCode = 200;
        res.end(JSON.stringify(response));
      } catch (error) {
        // 如果 JSON 解析失败，返回错误
        const response = {
          status: "error",
          message: "无效的 JSON 数据",
        };

        res.statusCode = 400;
        res.end(JSON.stringify(response));
      }
    });
  } else {
    // 其他请求返回简单提示
    const response = {
      message: "请发送 POST 请求到 /api/user",
    };

    res.end(JSON.stringify(response));
  }
});

// 监听 3000 端口
server.listen(3000, () => {
  console.log("HTTP 服务器已启动，监听端口: 3000");
  console.log("POST 请求地址: http://localhost:3000/api/user");
});
```

控制台运行 `node src/http-post.js` 启动服务并监听 3000 端口。

但 POST 请求我们不能直接使用浏览器访问测试，因为浏览器访问是 GET 请求。

测试 POST 请求一般有两种方式，如果你控制台支持 `curl` 命令，可以使用它来测试，在控制台运行

```ruby
curl -X POST http://localhost:3000/api/user \
  -H "Content-Type: application/json" \
  -d '{"userId": 123, "name": "张三", "email": "zhang@example.com"}'
```

或者，你安装 [Postman](https://link.juejin.cn/?target=https%3A%2F%2Fwww.postman.com%2F "https://www.postman.com/") 然后选择 POST 输入 url 和 body 信息，点击 Send 按钮，即可得到返回结果。

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/bf844b795548489d9087bd1684b56223~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5Y-M6LaK6ICB5biI:q75.awebp?rk3s=f64ab15b&x-expires=1761696653&x-signature=%2FVny3cICYXgyZv6PwgyOxPPFfxU%3D)

至此 HTTP 服务端的基础知识其实都已经包含了

- 启动 HTTP 服务，监听端口
- Request Reponse
- method
- url
- 获取 Request body
- 返回数据

通过这些知识搞一个基础的 HTTP 服务端是完全没有问题的，都在这个范围之内。例如你想要获取 JWT token 或者设置 cookie 都可以通过操作 HTTP header 来搞定，具体可以咨询 AI ，不看文档方便。

另，以上代码中的 `// TODO...` 位置，可以把 user 数据插入到数据库，这一点后面再说。

## Koa 框架

在 Nodejs 刚开始流行的时候，早就有人总结了 Nodejs 作为服务端的通用能力，并且开发了框架，可以让我们更加便捷的开发 Nodejs 服务端，其中最出名的就是 [express](https://link.juejin.cn/?target=https%3A%2F%2Fexpressjs.com%2F "https://expressjs.com/") 和 [koa](https://link.juejin.cn/?target=https%3A%2F%2Fkoajs.bootcss.com%2F "https://koajs.bootcss.com/") 。

两者设计思路和使用方式都一样，而且很多年都没变，早已稳定了，我们以后者 koa 为例。

新建一个目录，执行 `npm init -y` 创建一个 package.json 文件，和做前端开发一样。

然后安装 koa 和 [nodemon](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fnodemon "https://www.npmjs.com/package/nodemon") ，后者用于启动服务，和代码逻辑没关系，可暂时不用管

```css
npm i koa
npm i nodemon -D
```

然后创建一个目录 `src` 再在里面创建一个文件 `index.js` 写入如下代码

```php
// src/index.js

const Koa = require('koa')
const app = new Koa()

app.use(async (ctx) => {
  ctx.body = 'Hello World'
})

app.listen(3000)
```

然后在 package.json 文件加入一个命令 `"dev": "nodemon src/index.js"`

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/01c13d21319b47519c5ab272087835a8~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5Y-M6LaK6ICB5biI:q75.awebp?rk3s=f64ab15b&x-expires=1761696653&x-signature=NhNesgQRS7lN60qAf%2F%2FYr8wzQWk%3D)

再执行 `npm run dev` 就可以启动 nodejs 服务，用浏览器访问 `localhost:3000` 就可以看到访问结果

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/ae614c0a82a84ac58bea581e6aa47d29~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5Y-M6LaK6ICB5biI:q75.awebp?rk3s=f64ab15b&x-expires=1761696653&x-signature=%2BZKtN5GJjQEhgr%2BU2Vgx4EJYKXw%3D)

如果你想返回一段 JSON 怎么办？直接给 `ctx.body` 赋值一段 JSON 即可，不用考虑转换为字符串格式

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/1f81010c323c49b48d7e66da969384e0~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5Y-M6LaK6ICB5biI:q75.awebp?rk3s=f64ab15b&x-expires=1761696653&x-signature=6FpvfKr61nLEvbPnwbf%2BHI3DM7k%3D)

如果想要支持 POST PUT 的 HTTP 请求方法，可如下修改代码

- 先安装 `npm i koa-body` 它可用于获取 request body 数据
- 使用 `ctx.method` 判断 Method ，其他就很简单了

```php
const Koa = require('koa')
const { koaBody } = require('koa-body')
const app = new Koa()

app.use(koaBody())
app.use(async (ctx) => {
  if (ctx.method === 'POST') {
    const { user, email } = ctx.request.body || {}
    console.log('user and email ', user, email)

    // 其他处理，如 await insertUserToDatabase(user, email)

    ctx.body = {
      status: 'success',
      user,
      email,
    }
  }
})

app.listen(3000)
```

启动 nodejs 服务端以后，我们使用 Postman 测试如下，而且服务端也打印了正确的结果

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/4b290f51d78643e6ba8010f0cbe786f7~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5Y-M6LaK6ICB5biI:q75.awebp?rk3s=f64ab15b&x-expires=1761696653&x-signature=mWs5JY5oeYOOm82ZR1%2B8elQPW3I%3D)

如果想使用路由，那就再安装 koa router

```bash
npm install @koa/router
```

代码如下

- 通过 `router.post` 即可定义method 和路由 path
- 还可以继续扩展其他路由

```javascript
const Koa = require("koa");
const koaBody = require("koa-body");
const Router = require("@koa/router");

const app = new Koa();
const router = new Router();

app.use(koaBody());

router.post("/api/user", (ctx) => {
  const { user, email } = ctx.request.body || {};
  console.log("user and email ", user, email);

  // 其他处理，如 await insertUserToDatabase(user, email)

  ctx.body = {
    status: "success",
    user,
    email,
  };
});

// 继续扩展其他路由...

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);
```

至此，你已经看到 koa 是如何启动 nodejs 服务并且处理基础的请求，其他更多的 API 你可以参考文档，也可以直接咨询 AI 更方便。

只要你熟悉前端 ajax 请求和 HTTP 协议，那这些知识点基本都难不倒你。

## 操作数据库

数据库最常见的操作就是增删改查 CRUD ，你可能之前听说过操作数据库需要专门的 SQL 语言，挺麻烦的。

其实现在做常见的 web 应用开发，基本不会使用 SQL 语句了，最常见的就是 ORM 工具，例如 [Prisma](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Fgetting-started "https://www.prisma.io/docs/getting-started")

你一开始看它的文档肯定是看不懂的，而且也不需要你立刻看懂所有的，你只需要知道它是如何增删改查的就可以入门了。

下面这段代码能看懂吗？不要管它如何执行，你能看懂语意就可以，仅语意。

- 数据库里有一个 `user` 表（就像一个 excel 表），这一点代码中没写
- 在 `user` 表中创建一行数据，两列 `name` 和 `email`
- 查询这个表中的所有数据，并打印

```javascript
async function main() {
  await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@prisma.io",
    },
  });

  const allUsers = await prisma.user.findMany();
  console.dir(allUsers, { depth: null });
}
```

我想大部分人应该都能看懂这几行代码的语意，其实现代 ORM 工具操作数据库就是使用 `create` `fined` `update` `delete` 等这些函数进行增删改查的操作，并不是 SQL 语句。

再来个复杂一点的例子，这个不要求看懂，当然能看懂最好

- 数据库中有三个表 `user` `profile` `posts`
- 在 `user` 表中创建一行，两列 `name` `email` ，同时：
  - 在 `posts` 表中插入一行，一列 `title`
  - 在 `profile` 表中插入一行，一列 `bio`
- 查询所有 `user` 表中的数据，同时查询出 `posts` 和 `profile` 两个表的相关数据

```php
async function main() {
  await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@prisma.io',
      posts: {
        create: { title: 'Hello World' },
      },
      profile: {
        create: { bio: 'I like turtles' },
      },
    },
  })

  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
      profile: true,
    },
  })
  console.dir(allUsers, { depth: null })
}
```

把数据库的增删改查结合到上面 nodejs 服务端代码中，就可以开发一个基础的数据服务 API 。

## 调用第三方服务

第三方服务一般都是 API 的形式，一般有两种调用方式，以 [deepseek API](https://link.juejin.cn/?target=https%3A%2F%2Fapi-docs.deepseek.com%2F "https://api-docs.deepseek.com/") 为例

第一种方式，直接发送 http 请求调用，deepseek API 文档是使用 curl 工具举例的

```cpp
curl https://api.deepseek.com/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <DeepSeek API Key>" \
  -d '{
        "model": "deepseek-chat",
        "messages": [
          {"role": "system", "content": "You are a helpful assistant."},
          {"role": "user", "content": "Hello!"}
        ],
        "stream": false
      }'
```

其实我们可以转换为 nodejs 内置的 `fetch` 方法去请求，这是我用 AI 生成的代码

```php
await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer <DeepSeek API Key>' // 请替换为你的实际 API Key
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "Hello!" }
        ],
        stream: false
      })
    });
```

第二种方式，有的第三方开放平台会开发一个 npm 插件，让你直接安装并调用它的方法。例如调用 deepseek API 可以安装 openai

```css
npm i openai
```

然后直接引入并调用它的方法即可。其实它背后也是发送 HTTP 请求，不过它封装了。

```php
// Please install OpenAI SDK first: `npm install openai`

import OpenAI from "openai";

const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: '<DeepSeek API Key>'
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "deepseek-chat",
  });

  console.log(completion.choices[0].message.content);
}

main();
```

把调用 deepseek API 结合到上面 nodejs 服务端代码中，就可以开发一个自己的 AI 接口服务。
