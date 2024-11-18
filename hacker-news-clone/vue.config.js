const { defineConfig } = require("@vue/cli-service");
const { InjectManifest, GenerateSW } = require("workbox-webpack-plugin");

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === "production") {
      config.plugins.push(
        new GenerateSW({
          swDest: "sw.js",
          clientsClaim: true,
          skipWaiting: true,
          runtimeCaching: [
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
              handler: "CacheFirst",
              options: {
                cacheName: "images",
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 30 * 24 * 60 * 60,
                },
              },
            },
            {
              urlPattern: /^https:\/\/hacker-news\.firebaseio\.com/,
              handler: "NetworkFirst",
              options: {
                cacheName: "api",
                networkTimeoutSeconds: 5,
              },
            },
          ],
        })
      );
    } else {
      config.plugins.push(
        new InjectManifest({
          swSrc: "./src/sw-dev.js",
          swDest: "sw.js",
        })
      );
    }
  },
  devServer: {
    host: "localhost",
    port: 8083,
  },
});
