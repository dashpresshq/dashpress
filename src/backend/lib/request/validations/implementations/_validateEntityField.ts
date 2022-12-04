import { entitiesService } from "../../../../entities/entities.service";
import { BadRequestError } from "../../../errors";

export const validateEntityFields = async (
  entity: string,
  fields: string[]
) => {
  const entityFields = await entitiesService.getEntityFields(entity);
  fields.forEach((field) => {
    if (!entityFields.find(({ name }) => name === field)) {
      throw new BadRequestError(`Invalid field '${field}' for ${entity}`);
    }
    return field as string;
  });
};
