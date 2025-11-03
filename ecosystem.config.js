// 加载环境变量
require("dotenv").config({ path: ".env.production" });

module.exports = {
  apps: [
    {
      name: "spring-lament-blog",
      script: "./node_modules/.bin/next",
      args: "start -p 3000",
      cwd: "/www/wwwroot/my-next-app",
      instances: 1,
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      min_uptime: "10s", // 最小运行时间
      max_restarts: 10, // 最大重启次数
      restart_delay: 4000, // 重启延迟
      kill_timeout: 5000, // 强制杀死进程的超时时间
      wait_ready: false, // Next.js 不需要等待就绪信号
      listen_timeout: 30000, // 监听超时时间
      env_production: {
        NODE_ENV: "production",
        PORT: "3000",
        // 这些环境变量将从 .env.production 文件加载
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_file: "./logs/combined.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
    },
  ],
};
