module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { chrome: "55" } }],
    "@babel/preset-typescript",
    "@babel/preset-react",
  ],
  plugins: ["@babel/proposal-class-properties"],
};
