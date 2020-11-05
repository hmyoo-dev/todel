import HtmlWebpackPlugin from "html-webpack-plugin";
import { resolve } from "path";
import { Configuration } from "webpack";

const configuration: Configuration = {
  entry: {
    counter: "./counter/index.tsx",
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
  ],
};

export default configuration;
