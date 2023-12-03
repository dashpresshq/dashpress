import { sluggify } from "shared/lib/strings";
import { StorageService } from ".";

const PREFIX = "_app_config__";

const makeKey = (key: string): string => {
  return sluggify(`${PREFIX}${key}`, "_");
};

export const AppStorage = {
  set: (key: string, value: unknown) => {
    StorageService.setString(makeKey(key), JSON.stringify(value));
  },
  get: (key: string) => {
    if (typeof window === "undefined") {
      return undefined;
    }
    const data = StorageService.getString(makeKey(key));
    if (!data) {
      return undefined;
    }
    return JSON.parse(data);
  },
};
