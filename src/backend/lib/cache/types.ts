import { PortalCacheDomain } from "./portal";

export enum CacheAdaptorTypes {
  Memory = "memory",
  Redis = "redis",
}

export type CacheDomain = PortalCacheDomain | "permission";
