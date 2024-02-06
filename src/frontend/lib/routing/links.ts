import { queryObjectToQueryString } from "./queryObjectToQueryString";

export const NAVIGATION_LINKS = {
  DASHBOARD: {
    HOME: "/",
    MANAGE: "/dashboard/manage",
    WIDGET: {
      CREATE: (dashboardId: string) =>
        `/dashboard/${dashboardId}/widget/create`,
      UPDATE: (dashboardId: string, widgetId: string) =>
        `/dashboard/${dashboardId}/widget/${widgetId}`,
    },
    CUSTOM: {
      VIEW: (id: string) => `/custom-dashboards/${id}`,
      EDIT: (id: string) => `/custom-dashboards/${id}/update`,
      MANAGE: (id: string) => `/custom-dashboards/${id}/manage`,
      LIST: `/custom-dashboards`,
      CREATE: `/custom-dashboards/create`,
    },
  },
  AUTH_SIGNIN: "/auth",
  ACCOUNT: {
    PROFILE: "/account/profile",
    PASSWORD: "/account/password",
    PREFERENCES: "/account/preferences",
  },
  INTEGRATIONS: {
    VARIABLES: "/integrations/variables",
    ACTIONS: (actionId: string) => `/integrations/actions/${actionId}`,
    STORAGE: "/integrations/storage",
  },
  USERS: {
    LIST: "/users",
    CREATE: "/users/create",
    DETAILS: (username: string) => `/users/${username}`,
  },
  ROLES: {
    LIST: "/roles",
    CREATE: "/roles/create",
    DETAILS: (role: string) => `/roles/${role}`,
  },
  SETUP: {
    USER: "/setup/user",
    CREDENTIALS: "/setup/credentials",
  },
  SETTINGS: {
    DEFAULT: "/admin/settings/entities",
    ENTITIES: "/admin/settings/entities",
    MENU: "/admin/settings/menu",
    SYSTEM: "/admin/settings/system",
    DATA: "/admin/settings/data",
    SITE: "/admin/settings/site",
    THEME: "/admin/settings/theme",
    VARIABLES: "/admin/settings/variables",
    VERSIONS: "/admin/settings/versions",
  },
  ENTITY: {
    CREATE: (entity: string) => `/admin/${entity}/create`,
    TABLE: (entity: string) => `/admin/${entity}`,
    DETAILS: (entity: string, id: string) => `/admin/${entity}/${id}`,
    RELATION_TABLE: (
      entity: string,
      id: string,
      childEntity: string,
      relationship: "one" | "many"
    ) => `/admin/${entity}/${id}/relation/${childEntity}/${relationship}`,
    UPDATE: (entity: string, id: string) => `/admin/${entity}/${id}/update`,
    CONFIG: {
      CRUD: (entity: string, query?: Record<string, string>) =>
        `/admin/${entity}/config/crud${queryObjectToQueryString(query)}`,
      FIELDS: (entity: string, query?: Record<string, string>) =>
        `/admin/${entity}/config/fields${queryObjectToQueryString(query)}`,
      DICTION: (entity: string) => `/admin/${entity}/config/diction`,
      FORM: (entity: string) => `/admin/${entity}/config/form`,
      PRESENTATION: (entity: string) => `/admin/${entity}/config/presentation`,
      VIEWS: (entity: string) => `/admin/${entity}/config/views`,
      PERSISTENT_QUERY: (entity: string) =>
        `/admin/${entity}/config/persistent-query`,
      RELATIONS: (entity: string) => `/admin/${entity}/config/relations`,
      FORM_INTEGRATIONS: (entity: string) => `/admin/${entity}/config/actions`,
    },
  },
};
