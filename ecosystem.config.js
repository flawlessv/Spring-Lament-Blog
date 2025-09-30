module.exports = {
  apps: [
    {
      name: "spring-lament-blog",
      script: "server.js",
      cwd: "C:/www/spring-lament-blog", // Windows 路径格式
      instances: 1,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_file: "./logs/combined.log",
      time: true,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      // Windows 特定配置
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
    },
  ],
};
