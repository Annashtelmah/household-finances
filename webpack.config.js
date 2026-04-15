import path from "node:path";
import { fileURLToPath } from "node:url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: "./src/app.ts",
  mode: "development",
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    port: 9000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
    new CopyPlugin({
      patterns: [
        { from: "./src/templates", to: "templates" },
        {
          from: "./node_modules/bootstrap/dist/css/bootstrap.min.css",
          to: "css",
        },
        { from: "./node_modules/jquery/dist/jquery.min.js", to: "js" },
        { from: "./node_modules/bootstrap/dist/js/bootstrap.min.js", to: "js" },
        { from: "./images", to: "images" },
        { from: "./src/styles", to: "styles" },
        {
          from: "./node_modules/bootstrap-icons/font",
          to: "font",
        },
        { from: "./node_modules/chart.js/auto", to: "js/auto" },
        {
          from: "./node_modules/bootstrap-datepicker/dist/js/bootstrap-datepicker.js",
          to: "js",
        },
        {
          from: "./node_modules/bootstrap-datepicker/dist/locales/bootstrap-datepicker.ru.min.js",
          to: "js",
        },
        {
          from: "./node_modules/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css",
          to: "css",
        },

      ],
    }),
  ],
};
