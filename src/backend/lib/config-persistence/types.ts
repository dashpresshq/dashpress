export type ConfigDomain =
  | "users"
  | "schema"
  | "credentials"
  | "dashboard"
  | "app-config"
  | "roles";

export enum ConfigAdaptorTypes {
  JsonFile = "json-file",
  Database = "database",
  Memory = "memory",
  Redis = "redis",
}
