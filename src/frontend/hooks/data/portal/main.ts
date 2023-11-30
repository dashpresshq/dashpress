import { noop } from "shared/lib/noop";

export const DATA_MUTATION_QUERY_ENDPOINTS = (entity: string) => {
  noop(entity);
  return [];
};
