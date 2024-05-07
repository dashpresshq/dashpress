const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfigBase = require("./next.config.base");

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...nextConfigBase,
  reactStrictMode: true,
  experimental: {
    swcPlugins: [["@lingui/swc-plugin", {}]],
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
