const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0"; // 监听所有网络接口，适用于服务器部署
const port = process.env.PORT || 3000;

// 初始化 Next.js 应用
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // 解析请求 URL
      const parsedUrl = parse(req.url, true);

      // 处理请求
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  })
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, hostname, () => {
      console.log(
        `✅ Spring Lament Blog 服务器已启动: http://${hostname}:${port}`
      );
      console.log(`📝 管理后台: http://${hostname}:${port}/admin`);
      console.log(`🔐 登录页面: http://${hostname}:${port}/login`);
      console.log(`🌍 环境: ${process.env.NODE_ENV}`);
    });
});
