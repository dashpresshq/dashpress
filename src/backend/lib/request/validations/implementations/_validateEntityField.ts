import { entitiesApiService } from "@/backend/entities/entities.service";
import { BadRequestError } from "@/backend/lib/errors";

export const validateEntityFields = async (
  entity: string,
  fields: string[]
) => {
  // If no entity is provided, we assume that the request is for the app itself
  if (!entity) {
    return;
  }

  const entityFields = await entitiesApiService.getEntityFields(entity);
  fields.forEach((field) => {
    if (!entityFields.find(({ name }) => name === field)) {
      throw new BadRequestError(`Invalid field '${field}' for '${entity}'`);
    }
    return field as string;
  });
};
