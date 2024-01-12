import { PortalConfigDomain } from "./portal";

export type ConfigDomain =
  | PortalConfigDomain
  | "users"
  | "schema"
  | "credentials"
  | "constants"
  | "environment-variables"
  | "dashboard-widgets"
  | "app-config"
  | "users-preferences"
  | "list-order"
  | "temp-storage"
  | "key-value"
  | "action-instances"
  | "roles";

export enum ConfigAdaptorTypes {
  JsonFile = "json-file",
  Database = "database",
  Memory = "memory",
  Redis = "redis",
}
