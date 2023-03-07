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
  | "packages"
  | "list-order"
  | "action_instances"
  | "activated_actions"
  | "activated_storage"
  | "roles";

export enum ConfigAdaptorTypes {
  JsonFile = "json-file",
  Database = "database",
  Memory = "memory",
  Redis = "redis",
}
