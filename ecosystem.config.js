module.exports = {
  apps: [
    {
      name: "spring-lament-blog",
      script: "npm",
      args: "start",
      cwd: "/www/wwwroot/my-next-app",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
