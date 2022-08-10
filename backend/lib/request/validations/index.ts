import { RequestMethod } from "../methods";

export type ValidationKeys = {
  _type:
    | "isAuthenticated"
    | "guest"
    | "entity"
    | "authenticatedUser"
    | "configKey"
    | "paginationFilter"
    | "canUser"
    | "canCrud"
    | "requestBody"
    | "requestQuery"
    | "entityId"
    | "entityRequestBody"
    | "queryFilters"
    | "configBody";
  method?: RequestMethod[];
  body?: unknown;
};
