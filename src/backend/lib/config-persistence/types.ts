import { PortalConfigDomain } from "./portal";

export type ConfigDomain =
  | PortalConfigDomain
  | "users" // Done
  | "schema"
  | "credentials"
  | "constants"
  | "environment-variables"
  | "dashboard-widgets" // Done
  | "app-config"
  | "packages"
  | "list-order" // X
  | "action_instances"
  | "activated_actions"
  | "activated_storage"
  | "roles"; // Done

export enum ConfigAdaptorTypes {
  JsonFile = "json-file",
  Database = "database",
  Memory = "memory",
  Redis = "redis",
}
