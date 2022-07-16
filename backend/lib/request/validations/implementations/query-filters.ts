import { QueryFilter } from "backend/data/data.service";
import qs from "qs";
import { ValidationImplType } from "./types";
import { entityValidationImpl } from "./entity";
import { validateEntityFields } from "./_validateEntityField";

export const queryFilterValidationImpl: ValidationImplType<
  QueryFilter[]
> = async (req) => {
  const filters = (qs.parse(
    Object.entries(req.query)
      .map(([key, value]) => `${key}=${value}`)
      .join("&")
  )?.filters || []) as unknown as QueryFilter[];

  const entity = await entityValidationImpl(req);

  await validateEntityFields(
    entity,
    filters.map(({ id }) => id)
  );
  return filters;
};
