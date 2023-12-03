import { ValidationKeys } from "../types";
import { crudEnabledValidationImpl as crudEnabled } from "./crud-enabled";
import { entityValidationImpl as entity } from "./entity";
import { entityIdFilterValidationImpl as entityId } from "./entity-id";
import { isAuthenticatedValidationImpl as isAuthenticated } from "./is-authenticated";
import { paginationFilterValidationImpl as paginationFilter } from "./pagination-filter";
import { queryFilterValidationImpl as queryFilters } from "./query-filters";
import { requestBodyValidationImpl as requestBody } from "./request-body";
import { guestValidationImpl as guest } from "./guest";
import { anyBodyValidationImpl as anyBody } from "./any-body";
import { requestQueryValidationImpl as requestQuery } from "./request-query";
import { canUserValidationImpl as canUser } from "./can-user";
import { withPasswordValidationImpl as withPassword } from "./with-password";
import { authenticatedUserValidationImpl as authenticatedUser } from "./authenticated-user";
import { requestQueriesValidationImpl as requestQueries } from "./request-queries";
import { rawRequestValidationImpl as rawRequest } from "./raw-request";

import { ValidationImplType } from "./types";
import { PortalValidationImpl } from "./portal";

export const ValidationImpl: Record<
  ValidationKeys["_type"],
  ValidationImplType<any>
> = {
  ...PortalValidationImpl,
  isAuthenticated,
  crudEnabled,
  requestBody,
  guest,
  anyBody,
  requestQuery,
  canUser,
  rawRequest,
  requestQueries,
  authenticatedUser,
  entity,
  paginationFilter,
  queryFilters,
  entityId,
  withPassword,
};
