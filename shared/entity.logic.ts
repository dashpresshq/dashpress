import { IEntityField } from "backend/entities/types";

export const filterScalarEntity = ({ kind }: IEntityField) =>
  kind === "scalar" || kind === "enum";

export const getEntityReferencesMap = (
  input: IEntityField[]
): Record<string, string> =>
  Object.fromEntries(
    input
      .filter(({ relationFromFields }) => relationFromFields?.length === 1)
      .map(({ relationFromFields, type }) => [relationFromFields?.[0], type])
  );
