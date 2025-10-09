module.exports = {
  apps: [
    {
      name: "my-next-app",
      script: "npm",
      args: "start",
      cwd: "/www/wwwroot/my-next-app",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
