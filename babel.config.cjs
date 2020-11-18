// .cjs b/c "You appear to be using a native ECMAScript module configuration
// file, which is only supported when running Babel asynchronously."
module.exports = {
  sourceMaps: true,
  presets: [
    // jest requires preset-env
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current",
        },
      },
    ],
    // making babel typescript friendly
    "@babel/preset-typescript",
  ],
};
;
