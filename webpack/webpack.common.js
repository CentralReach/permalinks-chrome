const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const rootDist = "../dist/";

module.exports = {
  entry: {
    popup: path.join(__dirname, "../src/popup/popup.ts")
  },
  output: {
    path: path.join(__dirname, rootDist, "js"),
    filename: "[name].js"
  },
  optimization: {
    splitChunks: {
      name: "vendor",
      chunks: "initial"
    }
  },
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
    extensions: [".ts", ".tsx", ".js"]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: "./src/manifest.json",
        to: path.join(__dirname, rootDist)
      },
      {
        from: "./src/images/",
        to: path.join(__dirname, rootDist, "images"),
        flatten: true
      },
      {
        from: "./src/**/*.html",
        to: path.join(__dirname, rootDist),
        flatten: true
      }
    ])
  ]
};
