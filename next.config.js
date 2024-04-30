const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const linguiConfig = require("./lingui.config");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    swcPlugins: [["@lingui/swc-plugin", {}]],
  },
  i18n: {
    locales: linguiConfig.locales,
    defaultLocale: linguiConfig.sourceLocale,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.po$/,
      use: {
        loader: "@lingui/loader", // https://github.com/lingui/js-lingui/issues/1782
      },
    });

    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
