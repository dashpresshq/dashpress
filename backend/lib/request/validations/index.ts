import { RequestMethod } from "../methods";

export type ValidationKeys = {
  _type:
    | "isAuthenticated"
    | "guest"
    | "isCreator"
    | "entity"
    | "authenticatedUser"
    | "configKey"
    | "paginationFilter"
    | "canUser"
    | "canCrud"
    | "requestBody"
    | "entityId"
    | "entityRequestBody"
    | "queryFilters"
    | "configBody";
  method?: RequestMethod[];
  body?: unknown;
};
