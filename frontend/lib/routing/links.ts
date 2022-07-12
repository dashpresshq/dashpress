// TODO unit-test
const queryObjectToQueryString = (
  queryObject?: Record<string, string>
): string => {
  if (!queryObject) {
    return "";
  }
  const querystring = Object.entries(queryObject)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return `?${querystring}`;
};

export const NAVIGATION_LINKS = {
  DASHBOARD: "/admin",
  SETTINGS: {
    DEFAULT: "/admin/settings",
    ENTITIES: "/admin/settings/entities",
  },
  ENTITY: {
    CREATE: (entity: string) => `/admin/${entity}/create`,
    TABLE: (entity: string) => `/admin/${entity}`,
    DETAILS: (entity: string, id: string) => `/admin/${entity}/${id}`,
    UPDATE: (entity: string, id: string) => `/admin/${entity}/${id}/update`,
    CONFIG: {
      CRUD: (entity: string, query?: Record<string, string>) =>
        `/admin/${entity}/config/crud${queryObjectToQueryString(query)}`,
      FIELDS: (entity: string, query?: Record<string, string>) =>
        `/admin/${entity}/config/fields${queryObjectToQueryString(query)}`,
      ACTIONS: (entity: string) => `/admin/${entity}/config/actions`,
      DICTION: (entity: string) => `/admin/${entity}/config/diction`,
      RELATIONS: (entity: string) => `/admin/${entity}/config/relations`,
    },
  },
};
