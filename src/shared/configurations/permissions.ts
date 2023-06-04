import { DataCrudKeys } from "shared/types/data";
import { AppConfigurationKeys } from "./constants";

export const CRUD_KEY_CONFIG: Record<DataCrudKeys, AppConfigurationKeys> = {
  create: "hidden_entity_create_columns",
  update: "hidden_entity_update_columns",
  details: "hidden_entity_details_columns",
  table: "hidden_entity_table_columns",
};
