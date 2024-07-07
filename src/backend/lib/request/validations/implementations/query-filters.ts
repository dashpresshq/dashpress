import qs from "qs";

import { typescriptSafeObjectDotEntries } from "@/shared/lib/objects";
import type { FieldQueryFilter, QueryFilterSchema } from "@/shared/types/data";

import { validateEntityFields } from "./_validateEntityField";
import { entityValidationImpl } from "./entity";
import type { ValidationImplType } from "./types";

export const queryFilterValidationImpl: ValidationImplType<
  QueryFilterSchema
> = async (req, ignoreFieldsValidation) => {
  const filters = (qs.parse(
    typescriptSafeObjectDotEntries(req.query)
      .map(([key, value]) => `${key}=${value}`)
      .join("&")
  )?.filters || []) as unknown as FieldQueryFilter[];

  const entity = await entityValidationImpl(req);

  if (!ignoreFieldsValidation) {
    await validateEntityFields(
      entity,
      filters.map(({ id }) => id)
    );
  }

  return { operator: "and", children: filters };
};
