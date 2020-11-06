import { Application } from "express";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { resolve } from "path";
import { Configuration } from "webpack";
import { notebookApi } from "./server/notebookApi";

const configuration: Configuration = {
  entry: {
    counter: "./counter/index.tsx",
    notebook: "./notebook/index.tsx",
  },
  output: {
    path: resolve(__dirname, "./dist"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  module: {
    rules: [{ test: /\.[tj]sx?/, loader: "babel-loader" }],
  },
  devtool: "source-map",
  plugins: [
    new HtmlWebpackPlugin({
      template: "view/index.html",
      chunks: [],
    }),
    new HtmlWebpackPlugin({
      title: "Counter",
      template: "view/view.html",
      filename: "counter.html",
      chunks: ["counter"],
    }),
    new HtmlWebpackPlugin({
      title: "Notebook",
      template: "view/view.html",
      filename: "notebook.html",
      chunks: ["notebook"],
    }),
  ],
  devServer: {
    before(app: Application): void {
      app.use("/api/notebook", notebookApi);
    },
  },
};

export default configuration;
