import { IEntityField } from "shared/types";
import { entitiesService } from "../../../../entities/entities.service";
import { BadRequestError } from "../../../errors";

const _validateEntityField = (
  entities: IEntityField[],
  entity: string,
  field?: string
): string => {
  if (!entities.find(({ name }) => name === field)) {
    throw new BadRequestError(`Invalid field '${field}' for ${entity}`);
  }
  return field as string;
};

export const validateEntityField = async (
  entity: string,
  field: unknown
): Promise<string> => {
  if (!field) {
    return field as undefined;
  }
  const entities = await entitiesService.getEntityFields(entity);
  return _validateEntityField(entities, entity, field as string);
};

export const validateEntityFields = async (
  entity: string,
  fields: string[]
) => {
  const entities = await entitiesService.getEntityFields(entity);
  fields.forEach(async (field) => {
    _validateEntityField(entities, entity, field);
  });
};
