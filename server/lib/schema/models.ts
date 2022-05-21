import { loadJsonSchema } from "./load";
import { IJsonSchemaModel } from "./types";

const listJsonSchemaModels = (): IJsonSchemaModel[] =>
  loadJsonSchema()["models"];

export const getJsonSchemaModels = (): Record<string, IJsonSchemaModel> => {
  return Object.fromEntries(
    listJsonSchemaModels().map((model) => [model.name, model])
  );
};

export const getModelFields = (model: string): IJsonSchemaModel => {
  return getJsonSchemaModels()[model];
};

export const getAllModels = () => {
  return listJsonSchemaModels().map(({ name }) => ({
    value: name,
    label: name,
  }));
};

