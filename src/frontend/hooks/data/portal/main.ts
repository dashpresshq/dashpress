import { noop } from "shared/lib/noop";

export const DATA_MUTATION_QUERY_ENDPOINTS = (entity: string) => {
  noop(entity);
  return [];
};

export const SINGLE_DATA_MUTATION_QUERY_ENDPOINTS = (params: {
  entity: string;
  entityId: string;
}) => {
  noop(params);
  return [];
};

export const useEntityMetadataDetails = (params: {
  entity: string;
  entityId: string;
  column?: string;
}) => {
  noop(params);

  return {};
};
