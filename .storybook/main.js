module.exports = {
  stories: ["../**/(*.)?Stories.@(tsx)"],
  staticDirs: ["../public"],
  // stories: ['../**/*.stories.@(ts|tsx|js|jsx)'],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  // https://storybook.js.org/docs/react/configure/typescript#mainjs-configuration,
  webpackFinal: async (config) => {
    const assetRule = config.module.rules.find(({ test }) => test.test(".svg"));
    // exclude svg from the default storybook file-loader
    assetRule.exclude = /\.svg$/;

    // add svgr loader to handle svgs
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};
