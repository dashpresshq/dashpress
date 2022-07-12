export const CONFIGURATION_KEYS: Record<
  | "hidden_entity_table_columns"
  | "hidden_entity_create_columns"
  | "hidden_entity_update_columns"
  | "hidden_entity_details_columns"
  | "entity_diction"
  | "entity_columns_types"
  | "entity_fields_orders"
  | "entity_crud_settings"
  | "entities_order"
  | "entity_columns_labels"
  | "disabled_entities"
  | "dashboard_entities"
  | "relationship_settings"
  | "entity_selections"
  | "entity_validations",
  { requireEntity: boolean; defaultValue: unknown }
> = {
  hidden_entity_table_columns: { requireEntity: true, defaultValue: [] },
  hidden_entity_create_columns: { requireEntity: true, defaultValue: [] },
  hidden_entity_update_columns: { requireEntity: true, defaultValue: [] },
  hidden_entity_details_columns: { requireEntity: true, defaultValue: [] },
  entity_columns_labels: { requireEntity: true, defaultValue: {} },
  entity_columns_types: { requireEntity: true, defaultValue: {} },
  entity_validations: {
    requireEntity: true,
    defaultValue: {},
  },
  entity_selections: {
    requireEntity: true,
    defaultValue: {},
  },
  entity_diction: {
    requireEntity: true,
    defaultValue: { singular: "", plural: "" },
  },
  entity_fields_orders: {
    requireEntity: true,
    defaultValue: [],
  },
  entity_crud_settings: {
    requireEntity: true,
    defaultValue: {
      create: true,
      details: true,
      table: true,
      update: true,
      delete: true,
    },
  },
  relationship_settings: {
    requireEntity: true,
    defaultValue: { format: "", fields: [] },
  },
  disabled_entities: { requireEntity: false, defaultValue: [] },
  dashboard_entities: { requireEntity: false, defaultValue: [] },
  entities_order: { requireEntity: false, defaultValue: [] },
};

// Plugin System

/*

// Clone

   Override label,
   // defaultValue

  // id column

Table Settings =>
  add columns,
  default sorting,

// Filter Tables and / or

Creator mode
User mode
*/

export interface IEntityCrudSettings {
  create: boolean;
  details: boolean;
  update: boolean;
  delete: boolean;
}
