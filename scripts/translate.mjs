import gettextParser from "gettext-parser";

import fs from "fs";
import path from "path";

const translateText = async (input, language) => {
  const response = await fetch(
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${language}&dt=t&q=${encodeURI(
      input
    )}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to translate text: ${JSON.stringify(error)}`);
  }

  return (await response.json())[0][0][0];
};

const cleanUpTranslation = (translation) => {
  return translation;
};

const getFileMessages = (folderPath, file) => {
  const poContent = fs.readFileSync(path.join(folderPath, file), "utf8");
  const po = gettextParser.po.parse(poContent);

  return [
    po,
    Object.values(po.translations[""]).map((message) => ({
      id: message.msgid,
      translation: message.msgstr[0],
    })),
  ];
};

async function translatePoFiles(folderPath) {
  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    if (path.extname(file) !== ".po") {
      continue;
    }

    const language = file.split(".")[0];

    if (["pseudo", "en-us"].includes(language)) {
      continue;
    }

    const [po, fileMessages] = getFileMessages(folderPath, file);

    for (const message of fileMessages) {
      if (message.translation) {
        continue;
      }

      if (!message.id) {
        continue;
      }

      const translation = cleanUpTranslation(
        await translateText(message.id, language)
      );

      console.log(`${language}: ${message.id} => ${translation}`);

      po.translations[""][message.id] = {
        msgid: message.id,
        msgstr: [translation],
      };

      fs.writeFileSync(
        path.join(folderPath, file),
        gettextParser.po.compile(po)
      );
    }
  }
}

translatePoFiles("./src/translations/locales");
