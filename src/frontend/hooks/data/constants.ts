import {
  DATA_MUTATION_QUERY_ENDPOINTS,
  SINGLE_DATA_MUTATION_QUERY_ENDPOINTS,
} from "./portal";

export const ENTITY_TABLE_PATH = (entity: string) =>
  `/api/data/${entity}/table`;

export const ENTITY_COUNT_PATH = (entity: string) =>
  `/api/data/${entity}/count`;

export const ENTITY_DETAILS_PATH = ({
  entity,
  entityId,
  column,
}: {
  entity: string;
  entityId: string;
  column?: string;
}) => {
  const baseLink = `/api/data/${entity}/${entityId}`;

  if (column) {
    return `${baseLink}?column=${column}`;
  }
  return baseLink;
};

export const ENTITY_REFERENCE_PATH = ({
  entity,
  entityId,
}: {
  entity: string;
  entityId: string;
}) => `/api/data/${entity}/${entityId}/reference`;

export const ENTITY_LIST_PATH = (entity: string) => `/api/data/${entity}/list`;

export const SINGLE_DATA_MUTATION_ENDPOINTS_TO_CLEAR = (params: {
  entity: string;
  entityId: string;
}) => [
  ENTITY_REFERENCE_PATH(params),
  ENTITY_DETAILS_PATH(params),
  ...SINGLE_DATA_MUTATION_QUERY_ENDPOINTS(params),
];

export const DATA_MUTATION_ENDPOINTS_TO_CLEAR = (entity: string) => [
  ENTITY_TABLE_PATH(entity),
  ENTITY_COUNT_PATH(entity),
  ENTITY_LIST_PATH(entity),
  ...DATA_MUTATION_QUERY_ENDPOINTS(entity),
];
