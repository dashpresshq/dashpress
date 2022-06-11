import { useSlug } from "../../lib/routing/useSlug";
import { noCase } from "change-case";

export function useEntitySlug() {
  return useSlug("entity");
}

export function useEntityDiction() {
  const entity = useEntitySlug();
  return {
    singular: noCase(entity),
    plural: noCase(entity),
  }
}