export const CONFIGURATION_KEYS: Record<
  | "hidden_entity_table_columns"
  | "hidden_entity_create_columns"
  | "hidden_entity_update_columns"
  | "hidden_entity_details_columns"
  | "entity_columns_labels"
  | "entity_verbiage"
  | "relations_label"
  | "entities_to_hide_from_menu"
  | "entity_table_config"
  | "entity_crud_settings"
  | "entity_validations",
  { requireEntity: boolean; defaultValue: unknown }
> = {
  hidden_entity_table_columns: { requireEntity: true, defaultValue: [] },
  hidden_entity_create_columns: { requireEntity: true, defaultValue: [] },
  hidden_entity_update_columns: { requireEntity: true, defaultValue: [] },
  hidden_entity_details_columns: { requireEntity: true, defaultValue: [] },
  entity_columns_labels: { requireEntity: true, defaultValue: {} }, // {key: label}
  entity_verbiage: {requireEntity: true, defaultValue: { singular: "", plural: "" }},
  entity_crud_settings: {requireEntity: true, defaultValue: { createAble: true, editAble: true, deleteAble: true, detailsAble: true } },
  entities_to_hide_from_menu: { requireEntity: false, defaultValue: [] },
  entity_table_config: {
    requireEntity: true,
    defaultValue:  {}, //{ orderable: true, filterable: true },
  },
  entity_validations: {
    requireEntity: true,
    defaultValue: {} // {key: []} //  type,
  },
  relations_label: { requireEntity: true, defaultValue: {} },
};

// Plugin System

/*

   Override label,
   // defaultValue

  // id column

Table Settings => 
  Columns to show, 
  add columns,
  order, 
  default sorting, 

// Filter Tables and / or 

Creator mode
User mode
*/
