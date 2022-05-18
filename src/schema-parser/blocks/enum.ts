import { BlockHandlerType } from "./types";

export const EnumBlockHandler: BlockHandlerType = (input) => {
  return Object.fromEntries(
    input.map((inputItem) => {
      const inputTrim = inputItem.trim();
      if (inputTrim.includes("map")) {
        const mapPos = inputTrim.indexOf("@map(");
        const mapValue = inputTrim.substring(mapPos+ 6, inputTrim.length - 2);
        return [mapValue, mapValue];
      }
      return [inputTrim, inputTrim];
    })
  );
};
