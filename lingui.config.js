const { formatter } = require("@lingui/format-po");

const linguiConfigBase = require("./lingui.config.base");

if (process.env.NODE_ENV !== "production") {
  linguiConfigBase.locales.push("pseudo");
}

/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  ...linguiConfigBase,
  catalogs: [
    {
      path: "<rootDir>/src/translations/locales/{locale}",
      include: [
        "<rootDir>/src/components",
        "<rootDir>/src/frontend",
        "<rootDir>/src/shared",
        "<rootDir>/src/backend",
      ],
    },
  ],
  format: formatter({ origins: false }),
};
