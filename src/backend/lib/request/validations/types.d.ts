import type { RequestMethod } from "../methods";
import type { PortalValidationKeys } from "./implementations/portal";

export type ValidationKeys = {
  _type:
    | PortalValidationKeys
    | "isAuthenticated"
    | "guest"
    | "entity"
    | "authenticatedUser"
    | "rawRequest"
    | "paginationFilter"
    | "canUser"
    | "notAllowedOnDemo"
    | "crudEnabled"
    | "requestBody"
    | "requestQuery"
    | "requestQueries"
    | "entityId"
    | "queryFilters"
    | "withPassword";
  method?: RequestMethod[];
  body?: unknown;
};
