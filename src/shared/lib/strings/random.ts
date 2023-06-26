import * as randomstring from "randomstring";

export const generateRandomString = (length = 12): string => {
  return randomstring.generate(length);
};
