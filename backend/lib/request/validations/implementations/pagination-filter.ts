import { IPaginationFilters } from "../../../../data/types";
import { entityValidationImpl } from "./entity";
import { ValidationImplType } from "./types";
import { validateEntityField } from "./_validateEntityField";

export const paginationFilterValidationImpl: ValidationImplType<
  IPaginationFilters
> = async (req) => {
  const take = Number(req.query.take) || 10;
  const page = Number(req.query.page) || 1;

  // TODO fix me
  const orderBy = (req.query.orderBy as string) ? "desc" : "asc";

  const entity = await entityValidationImpl(req);

  const sortBy = req.query.sortBy as string;

  await validateEntityField(entity, sortBy);

  return {
    take,
    page,
    orderBy,
    sortBy,
  };
};
