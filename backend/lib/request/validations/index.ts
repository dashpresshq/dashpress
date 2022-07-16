import { RequestMethod } from "../methods";

export type ValidationKeys = {
  _type:
    | "isAuthenticated"
    | "isDeveloper"
    | "entity"
    | "configKey"
    | "paginationFilter"
    | "canCrud"
    | "requestBody"
    | "entityId"
    | "queryFilters"
    | "configBody";
  method?: RequestMethod[];
};
