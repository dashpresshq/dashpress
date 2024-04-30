/* eslint-disable */

export const CRUD_HIDDEN_KEY_CONFIG = {
  create: "hidden_entity_create_columns",
  update: "hidden_entity_update_columns",
  details: "hidden_entity_details_columns",
  table: "hidden_entity_table_columns",
} as const;
// } satisfies Record<DataCrudKeys, AppConfigurationKeys>;

export const ORDER_FIELD_CONFIG = {
  create: "entity_fields_orders_create",
  update: "entity_fields_orders_update",
  details: "entity_fields_orders_details",
  table: "entity_fields_orders_table",
} as const;
// } satisfies Record<DataCrudKeys, AppConfigurationKeys>;
