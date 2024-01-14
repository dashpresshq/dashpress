const fs = require("fs");
const { listAllFilesInDir } = require("./lib");

let files = process.argv.slice(2);

if (files.length === 0) {
  files = [
    ...listAllFilesInDir("./src/frontend"),
    ...listAllFilesInDir("./src/backend"),
    ...listAllFilesInDir("./src/shared"),
  ];
}

const errors = [];

const mustNotContain = (fileName, pathsToNotExist) => {
  const fileContent = fs.readFileSync(fileName, "utf8");

  pathsToNotExist.forEach((pathToNotExist) => {
    if (fileContent.includes(pathToNotExist)) {
      errors.push(`${fileName} contains invalid path to ${pathToNotExist}`);
    }
  });
};

const FILE_PATHS = { frontend: '"frontend/', backend: '"backend/' };

for (const fileName of files) {
  if (fileName.includes("src/backend")) {
    mustNotContain(fileName, [FILE_PATHS.frontend]);
  }
  if (fileName.includes("src/frontend")) {
    mustNotContain(fileName, [FILE_PATHS.backend]);
  }
  if (fileName.includes("src/shared")) {
    mustNotContain(fileName, [FILE_PATHS.backend, FILE_PATHS.frontend]);
  }
}

if (errors.length > 0) {
  console.error(`${errors.length} files not placed in the correct folders`);

  errors.forEach((error) => {
    console.error(error);
  });

  process.exit(1);
}
