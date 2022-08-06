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
  AUTH_SIGNIN: "/auth",
  ACCOUNT: {
    PROFILE: "/account/profile",
    PASSWORD: "/account/password",
  },
  USERS: {
    LIST: "/users",
    DETAILS: (username: string) => `/users/${username}`,
  },
  SETUP: {
    USER: "/setup/user",
    CREDENTIALS: "/setup/credentials",
  },
  SETTINGS: {
    DEFAULT: "/admin/settings",
    ENTITIES: "/admin/settings/entities",
  },
  ENTITY: {
    CREATE: (entity: string) => `/admin/${entity}/create`,
    TABLE: (entity: string) => `/admin/${entity}`,
    DETAILS: (entity: string, id: string) => `/admin/${entity}/${id}`,
    RELATION_DETAILS: (
      entity: string,
      id: string,
      childEntity: string,
      childId: string
    ) => `/admin/${entity}/${id}/relation/${childEntity}/${childId}`,
    RELATION_TABLE: (entity: string, id: string, childEntity: string) =>
      `/admin/${entity}/${id}/relation/${childEntity}`,
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
