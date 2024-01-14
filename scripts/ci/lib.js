const path = require("path");
const fs = require("fs");

const listAllFilesInDir = (dir, files = []) => {
  const directoryPath = dir.startsWith("/")
    ? dir
    : path.join(process.cwd(), dir);
  const filesInDir = fs.readdirSync(directoryPath);

  filesInDir.forEach((file) => {
    const filePath = path.join(directoryPath, file);

    const isDirectory = fs.statSync(filePath).isDirectory();

    if (isDirectory) {
      listAllFilesInDir(filePath, files);
    } else {
      files.push(filePath);
    }
  });

  return files;
};

module.exports = {
  listAllFilesInDir,
};
