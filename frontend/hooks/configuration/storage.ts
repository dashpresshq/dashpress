const PREFIX = "__cardinal_app_config__";

export const ConfigrationStorage = {
  getKey: (key: string, entity?: string) => {
    return `${PREFIX}${key}_${entity}`;
  },
  set: (
    value: Record<string, unknown> | unknown[],
    key: string,
    entity?: string
  ) => {
    window.localStorage.setItem(
      ConfigrationStorage.getKey(key, entity),
      JSON.stringify(value)
    );
  },
  get: (key: string, entity?: string) => {
    if (typeof window === "undefined") {
      return undefined;
    }
    const data = window.localStorage.getItem(
      ConfigrationStorage.getKey(key, entity)
    );
    if (!data) {
      return undefined;
    }
    return JSON.parse(data);
  },
};