const { formatter } = require("@lingui/format-po");

const locales = [
  "en-us", // english
  "zh-cn", // chinese (simplified)
  "zh-tw", // chinese (traditional)
  "fr-fr", // french
  "es-es", // spanish
  "de-de", // german
  "it-it", // italian
  "ru-ru", // russian
  "ja-jp", // japanese
  "pt-br", // portuguese
  "ko-kr", // korean

  // "bn-in", // bengali
  // "ar-sa", // arabic
  // "pl-pl", // polish
  // "tr-tr", // turkish
  // "vi-vn", // vietnamese
  // "id-id", // indonesian
  // "uk-ua", // ukrainian
  // "hu-hu", // hungarian
  // "ro-ro", // romanian
  // "sv-se", // swedish
  // "nl-nl", // dutch
  // "fa-ir", // persian
  // "cs-cz", // czech
  // "el-gr", // greek
  // "th-th", // thai
  // "he-il", // hebrew
];

if (process.env.NODE_ENV !== "production") {
  locales.push("pseudo");
}

/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales,
  sourceLocale: "en-us",
  pseudoLocale: "pseudo",
  catalogs: [
    {
      path: "<rootDir>/src/translations/locales/{locale}",
      include: ["<rootDir>/src/frontend", "<rootDir>/src/shared"],
    },
  ],
  format: formatter({ origins: false }),
};
