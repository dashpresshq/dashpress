import { RequestMethod } from "../methods";

export type ValidationKeys = {
  _type:
    | "isAuthenticated"
    | "guest"
    | "isCreator"
    | "entity"
    | "configKey"
    | "paginationFilter"
    | "canCrud"
    | "requestBody"
    | "entityId"
    | "dataRequestBody"
    | "queryFilters"
    | "configBody";
  method?: RequestMethod[];
  body?: unknown;
};
