/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en", "fr", "zh"],
    defaultLocale: "en",
  },
};

// spanish
// Hindi
// Arabic
// japanese
// Russian
// porutugese
// german
// dutch
// urdu
// bengali
// korean
// italian

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
});

module.exports = withBundleAnalyzer(nextConfig);
