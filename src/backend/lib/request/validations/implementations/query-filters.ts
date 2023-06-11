import qs from "qs";
import { FieldQueryFilter, QueryFilterSchema } from "shared/types/data";
import { ValidationImplType } from "./types";
import { entityValidationImpl } from "./entity";
import { validateEntityFields } from "./_validateEntityField";

export const queryFilterValidationImpl: ValidationImplType<
  QueryFilterSchema
> = async (req) => {
  const filters = (qs.parse(
    Object.entries(req.query)
      .map(([key, value]) => `${key}=${value}`)
      .join("&")
  )?.filters || []) as unknown as FieldQueryFilter[];

  const entity = await entityValidationImpl(req);

  await validateEntityFields(
    entity,
    filters.map(({ id }) => id)
  );

  return { operator: "and", children: filters };
};
