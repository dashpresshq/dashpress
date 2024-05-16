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
];

/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales,
  sourceLocale: "en-us",
  pseudoLocale: "pseudo",
};
