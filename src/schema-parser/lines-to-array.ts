export const splitFilesLinesIntoArray = (data: string) =>
  data.split(/\r?\n/).filter((line) => line);