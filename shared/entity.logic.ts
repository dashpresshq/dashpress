import { IEntityField } from "backend/entities/types";

export const filterScalarEntity = ({ kind }: IEntityField) =>
  kind === "scalar" || kind === "enum";
