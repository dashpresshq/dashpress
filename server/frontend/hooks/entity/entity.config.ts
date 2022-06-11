import { useSlug } from "../../lib/routing/useSlug";
import { capitalCase } from "change-case";
import { useEntityConfiguration } from "../configuration/configration.store";

export function useEntitySlug() {
  return useSlug("entity");
}

export function useEntityDiction() {
  const entity = useEntitySlug();
  const entityDiction = useEntityConfiguration<{
    plural: string;
    singular: string;
  }>("entity_diction", entity);
  return {
    singular: entityDiction.data?.singular || capitalCase(entity),
    plural: entityDiction.data?.plural || capitalCase(entity),
  };
}


export function useEntityCrudSettings() {
  const entity = useEntitySlug();
  const entityCrudSettings = useEntityConfiguration<{
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  }>("entity_crud_settings", entity);
  return entityCrudSettings;
}
