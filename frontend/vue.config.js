const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: "../dist",
  publicPath: "/",
  devServer: {
    proxy: {
      "/ask": {
        target: "http://localhost:3000", // Express server URL
        changeOrigin: true,
      },
    },
  },
});
