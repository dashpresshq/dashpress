import { RequestMethod } from "../methods";
import { PortalValidationKeys } from "./implementations/portal";

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

export const FOR_CODE_COV = 1;
