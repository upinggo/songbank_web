module.exports = {
  lintOnSave: false,
  chainWebpack: config => {
    console.log(config)
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule.use("svg-inline-loader").loader("svg-inline-loader");
  }
};
