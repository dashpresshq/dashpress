import { useSlug } from "../../lib/routing/useSlug";
import { capitalCase } from "change-case";

export function useEntitySlug() {
  return useSlug("entity");
}

export function useEntityDiction() {
  const entity = useEntitySlug();
  return {
    singular: capitalCase(entity),
    plural: capitalCase(entity),
  }
}