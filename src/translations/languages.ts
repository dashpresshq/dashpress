interface Languages {
  locale: string;
  msg: string;
  territory?: string;
  rtl?: true;
}

const languages: Languages[] = [
  {
    locale: "en-us",
    msg: `English`,
    territory: "US",
  },
  {
    locale: "fr-fr",
    msg: `Français`,
    territory: "FR",
  },
  {
    locale: "es-es",
    msg: "Español",
    territory: "ES",
  },
  {
    locale: "zh-cn",
    msg: `简体中文`,
    territory: "CN",
  },
  {
    locale: "zh-tw",
    msg: `繁體中文`,
    territory: "TW",
  },
  {
    locale: "de-de",
    msg: `Deutsch`,
    territory: "DE",
  },
  {
    locale: "it-it",
    msg: "Italiano",
    territory: "IT",
  },
  {
    locale: "ru-ru",
    msg: `русский язык`,
    territory: "RU",
  },
  {
    locale: "ja-jp",
    msg: `日本語`,
    territory: "JP",
  },
  {
    locale: "pt-br",
    msg: `Português`,
    territory: "BR",
  },
  {
    locale: "ko-kr",
    msg: `한국어`,
    territory: "KR",
  },
  // {
  //   locale: "nl-nl",
  //   msg: `Nederlands`,
  //   territory: "NL",
  // },
  // {
  //   locale: "bn-in",
  //   msg: `বাংলা`,
  //   territory: "IN",
  // },
  // {
  //   locale: "ar-sa",
  //   msg: `العربية`,
  //   territory: "SA",
  //   rtl: true,
  // },
  // {
  //   locale: "pl-pl",
  //   msg: `Polski`,
  //   territory: "PL",
  // },
  // {
  //   locale: "tr-tr",
  //   msg: `Türkçe`,
  //   territory: "TR",
  // },
  // {
  //   locale: "vi-vn",
  //   msg: `Tiếng Việt`,
  //   territory: "VN",
  // },
  // {
  //   locale: "id-id",
  //   msg: `Bahasa Indonesia`,
  //   territory: "ID",
  // },
  // {
  //   locale: "uk-ua",
  //   msg: `Українська`,
  //   territory: "UA",
  // },
  // {
  //   locale: "hu-hu",
  //   msg: `Magyar`,
  //   territory: "HU",
  // },
  // {
  //   locale: "ro-ro",
  //   msg: `Română`,
  //   territory: "RO",
  // },
  // {
  //   locale: "sv-se",
  //   msg: `Svenska`,
  //   territory: "SE",
  // },
  // {
  //   locale: "fa-ir",
  //   msg: `فارسی`,
  //   territory: "IR",
  // },
  // {
  //   locale: "cs-cz",
  //   msg: `Česky`,
  //   territory: "CZ",
  // },
  // {
  //   locale: "el-gr",
  //   msg: `Ελληνικά`,
  //   territory: "GR",
  // },
  // {
  //   locale: "th-th",
  //   msg: `ไทย`,
  //   territory: "TH",
  // },
  // {
  //   locale: "he-il",
  //   msg: `עברית`,
  //   territory: "IL",
  // },
];

if (process.env.NODE_ENV !== "production") {
  languages.push({
    locale: "pseudo",
    msg: `Pseudo`,
  });
}

export default languages;
