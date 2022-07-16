import { ValidationKeys } from "..";
import { canCrudValidationImpl as canCrud } from "./can-crud";
import { configBodyValidationImpl as configBody } from "./config-body";
import { configKeyFilterValidationImpl as configKey } from "./config-key";
import { entityValidationImpl as entity } from "./entity";
import { entityIdFilterValidationImpl as entityId } from "./entity-id";
import { isAuthenticatedValidationImpl as isAuthenticated } from "./is-authenticated";
import { isDeveloperValidationImpl as isDeveloper } from "./is-developer";
import { paginationFilterValidationImpl as paginationFilter } from "./pagination-filter";
import { queryFilterValidationImpl as queryFilters } from "./query-filters";
import { requestBodyValidationImpl as requestBody } from "./request-body";
import { ValidationImplType } from "./types";

export const ValidationImpl: Record<
  ValidationKeys["_type"],
  ValidationImplType<any>
> = {
  isAuthenticated,
  canCrud,
  isDeveloper,
  configBody,
  requestBody,
  entity,
  paginationFilter,
  queryFilters,
  entityId,
  configKey,
};
