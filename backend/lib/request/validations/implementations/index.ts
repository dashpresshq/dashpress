import { ValidationKeys } from "..";
import { canCrudValidationImpl as canCrud } from "./can-crud";
import { configBodyValidationImpl as configBody } from "./config-body";
import { configKeyFilterValidationImpl as configKey } from "./config-key";
import { entityValidationImpl as entity } from "./entity";
import { entityIdFilterValidationImpl as entityId } from "./entity-id";
import { isAuthenticatedValidationImpl as isAuthenticated } from "./is-authenticated";
import { isCreatorValidationImpl as isCreator } from "./is-creator";
import { paginationFilterValidationImpl as paginationFilter } from "./pagination-filter";
import { queryFilterValidationImpl as queryFilters } from "./query-filters";
import { entityRequestBodyValidationImpl as entityRequestBody } from "./entity-request-body";
import { requestBodyValidationImpl as requestBody } from "./request-body";
import { guestValidationImpl as guest } from "./guest";

import { ValidationImplType } from "./types";

export const ValidationImpl: Record<
  ValidationKeys["_type"],
  ValidationImplType<any>
> = {
  isAuthenticated,
  canCrud,
  requestBody,
  guest,
  isCreator,
  configBody,
  entityRequestBody,
  entity,
  paginationFilter,
  queryFilters,
  entityId,
  configKey,
};
