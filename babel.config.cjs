// .cjs b/c "You appear to be using a native ECMAScript module configuration
// file, which is only supported when running Babel asynchronously."
module.exports = {
  env: {
    test: {
      plugins: ["@babel/plugin-transform-modules-commonjs"]
    }
  }
};
