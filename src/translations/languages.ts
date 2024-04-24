import { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/macro";

interface Languages {
  locale: string;
  msg: MessageDescriptor;
  territory?: string;
  rtl?: true;
}

export type LOCALES = "en-us" | "nl-nl" | "pseudo";

const languages: Languages[] = [
  {
    locale: "en-us",
    msg: msg`English`,
    territory: "US",
  },
  {
    locale: "fr-fr",
    msg: msg`French`,
    territory: "FR",
  },
  {
    locale: "es-es",
    msg: msg`Spanish`,
    territory: "ES",
  },
  {
    locale: "zh-cn",
    msg: msg`简体中文`,
    territory: "CN",
  },
  {
    locale: "zh-tw",
    msg: msg`繁體中文`,
    territory: "TW",
  },
  {
    locale: "de-de",
    msg: msg`German`,
    territory: "DE",
  },
  {
    locale: "it-it",
    msg: msg`Italian`,
    territory: "IT",
  },
  {
    locale: "ru-ru",
    msg: msg`Russian`,
    territory: "RU",
  },
  {
    locale: "nl-nl",
    msg: msg`Dutch`,
    territory: "NL",
  },
  {
    locale: "ja-jp",
    msg: msg`Japanese`,
    territory: "JP",
  },
  {
    locale: "pt-br",
    msg: msg`Portuguese`,
    territory: "BR",
  },
  {
    locale: "ko-kr",
    msg: msg`Korean`,
    territory: "KR",
  },
  {
    locale: "bn-in",
    msg: msg`Bengali`,
    territory: "IN",
  },
  {
    locale: "hi-in",
    msg: msg`Hindi`,
    territory: "IN",
  },
  {
    locale: "ar-sa",
    msg: msg`Arabic`,
    territory: "SA",
    rtl: true,
  },
  {
    locale: "pl-pl",
    msg: msg`Polish`,
    territory: "PL",
  },
  {
    locale: "tr-tr",
    msg: msg`Turkish`,
    territory: "TR",
  },
  {
    locale: "vi-vn",
    msg: msg`Vietnamese`,
    territory: "VN",
  },
  {
    locale: "id-id",
    msg: msg`Indonesian`,
    territory: "ID",
  },
  {
    locale: "uk-ua",
    msg: msg`Ukrainian`,
    territory: "UA",
  },
  {
    locale: "hu-hu",
    msg: msg`Hungarian`,
    territory: "HU",
  },
  {
    locale: "ro-ro",
    msg: msg`Romanian`,
    territory: "RO",
  },
  {
    locale: "sv-se",
    msg: msg`Swedish`,
    territory: "SE",
  },
  {
    locale: "fa-ir",
    msg: msg`Persian`,
    territory: "IR",
  },
  {
    locale: "cs-cz",
    msg: msg`Czech`,
    territory: "CZ",
  },
  {
    locale: "el-gr",
    msg: msg`Greek`,
    territory: "GR",
  },
  {
    locale: "th-th",
    msg: msg`Thai`,
    territory: "TH",
  },
  {
    locale: "he-il",
    msg: msg`Hebrew`,
    territory: "IL",
  },
];

if (process.env.NODE_ENV !== "production") {
  languages.push({
    locale: "pseudo",
    msg: msg`Pseudo`,
  });
}

export default languages;
