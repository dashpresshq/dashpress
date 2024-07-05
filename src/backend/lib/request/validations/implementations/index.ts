import type { ValidationKeys } from "../types";
import { anyBodyValidationImpl as anyBody } from "./any-body";
import { authenticatedUserValidationImpl as authenticatedUser } from "./authenticated-user";
import { canUserValidationImpl as canUser } from "./can-user";
import { crudEnabledValidationImpl as crudEnabled } from "./crud-enabled";
import { entityValidationImpl as entity } from "./entity";
import { entityIdFilterValidationImpl as entityId } from "./entity-id";
import { guestValidationImpl as guest } from "./guest";
import { isAuthenticatedValidationImpl as isAuthenticated } from "./is-authenticated";
import { notAllowedOnDemoValidationImpl as notAllowedOnDemo } from "./not-allowed-on-demo";
import { paginationFilterValidationImpl as paginationFilter } from "./pagination-filter";
import { PortalValidationImpl } from "./portal";
import { queryFilterValidationImpl as queryFilters } from "./query-filters";
import { rawRequestValidationImpl as rawRequest } from "./raw-request";
import { requestBodyValidationImpl as requestBody } from "./request-body";
import { requestQueriesValidationImpl as requestQueries } from "./request-queries";
import { requestQueryValidationImpl as requestQuery } from "./request-query";
import type { ValidationImplType } from "./types";
import { withPasswordValidationImpl as withPassword } from "./with-password";

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
  notAllowedOnDemo,
  requestQueries,
  authenticatedUser,
  entity,
  paginationFilter,
  queryFilters,
  entityId,
  withPassword,
};
