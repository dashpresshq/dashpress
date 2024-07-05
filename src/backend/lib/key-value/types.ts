import type { PortalKeyValueDomain } from "./portal";

export type KeyValueDomain =
  | PortalKeyValueDomain
  | "current-storage"
  | "activated-integrations";
