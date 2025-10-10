// 加载环境变量
require("dotenv").config({ path: ".env.production" });

module.exports = {
  apps: [
    {
      name: "spring-lament-blog",
      script: "npm",
      args: "start",
      cwd: "/www/wwwroot/my-next-app",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        // 从 .env.production 加载的环境变量
        DATABASE_URL: process.env.DATABASE_URL,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};
