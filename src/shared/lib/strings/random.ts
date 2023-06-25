import * as randomstring from "randomstring";

export const generateRandomString = (length = 12): string => {
  return randomstring.generate(length);
};

export const generateRandomNumbers = (length: number): string => {
  return randomstring.generate({
    length,
    charset: "numeric",
  });
};

export const generateRandomGibberish = (length = 12): string => {
  return randomstring.generate({
    length,
    charset:
      "!#$%&()*:;<>?{|}0123456789@ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz",
  });
};
