module.exports = {
  "*.{ts,tsx}": (filenames) => {
    const allFilename = filenames.join(" ");
    return [
      `organize-imports-cli ${allFilename}`,
      "yarn type-check",
      `eslint --fix ${allFilename}`,
      `prettier --write ${allFilename}`,
    ];
  },
  "*.{js,json}": ["eslint --fix", "prettier --write"],
};
