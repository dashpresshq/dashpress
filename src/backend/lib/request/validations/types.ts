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
    | "anyBody"
    | "crudEnabled"
    | "requestBody"
    | "requestQuery"
    | "entityId"
    | "entityRequestBody"
    | "queryFilters"
    | "withPassword"
    | "configBody";
  method?: RequestMethod[];
  body?: unknown;
};

export const FOR_CODE_COV = 1;
