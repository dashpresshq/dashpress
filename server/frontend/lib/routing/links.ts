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
      CREATE: (entity: string) => `/admin/${entity}/config/create`,
      DETAILS: (entity: string) => `/admin/${entity}/config/details`,
      FIELDS: (entity: string) => `/admin/${entity}/config/fields`,
      TABLE: (entity: string) => `/admin/${entity}/config/table`,
      UPDATE: (entity: string) => `/admin/${entity}/config/update`,
      DICTION: (entity: string) => `/admin/${entity}/config/diction`,
    },
  },
};
