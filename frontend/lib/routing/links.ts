export const NAVIGATION_LINKS = {
  DASHBOARD: `/admin`,
  SETTINGS: `/admin/settings`,
  ENTITY: {
    CREATE: (entity: string) => `/admin/${entity}/create`,
    TABLE: (entity: string) => `/admin/${entity}`,
    DETAILS: (entity: string, id: string) => `/admin/${entity}/${id}`,
    UPDATE: (entity: string, id: string) => `/admin/${entity}/${id}/update`,
    CONFIG: {
      CRUD: (entity: string) => `/admin/${entity}/config/crud`,
      FIELDS: (entity: string) => `/admin/${entity}/config/fields`,
      ACTIONS: (entity: string) => `/admin/${entity}/config/actions`,
      DICTION: (entity: string) => `/admin/${entity}/config/diction`,
    },
  },
};
