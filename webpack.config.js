const path = require("path");

module.exports = [
  {
    entry: "./backend/main.ts",
    mode: "development",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: [".ts", ".js"]
    },
    target: "electron-main",
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "backend/dist")
    }
  },
  {
    entry: "./frontend/renderer.ts",
    mode: "development",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: [".ts", ".js"]
    },
    target: "electron-renderer",
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "frontend/dist")
    }
  }
];
