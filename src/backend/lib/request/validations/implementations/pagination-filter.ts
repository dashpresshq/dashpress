import type { IPaginationFilters } from "../../../../data/types";
import { validateEntityFields } from "./_validateEntityField";
import { entityValidationImpl } from "./entity";
import type { ValidationImplType } from "./types";

export const paginationFilterValidationImpl: ValidationImplType<
  IPaginationFilters
> = async (req, ignoreFieldsValidation) => {
  const take = Number(req.query.take) || 10;
  const page = Number(req.query.page) || 1;

  const orderBy = req.query.orderBy === "desc" ? "desc" : "asc";

  const entity = await entityValidationImpl(req);

  const sortBy = req.query.sortBy as string;

  if (!ignoreFieldsValidation) {
    if (sortBy) {
      await validateEntityFields(entity, [sortBy]);
    }
  }

  return {
    take,
    page,
    orderBy,
    sortBy,
  };
};
