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
  | "default_date_format"
  | "entity_columns_labels"
  | "disabled_entities"
  | "dashboard_entities"
  | "entity_relation_template"
  | "entity_selections"
  | "entity_validations"
  | "entity_relations_labels"
  | "entity_form_extension"
  | "hidden_entity_relations"
  | "entity_relations_order",
  { requireEntity: boolean; defaultValue: unknown }
> = {
  hidden_entity_table_columns: { requireEntity: true, defaultValue: [] },
  default_date_format: {
    requireEntity: false,
    defaultValue: "do MMM yyyy, h:MM aa",
  },
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
  entity_form_extension: {
    requireEntity: true,
    defaultValue: {
      fieldsState: "",
      beforeSubmit: "",
      afterSubmit: "",
    },
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
  entity_relations_order: {
    requireEntity: true,
    defaultValue: [],
  },
  hidden_entity_relations: {
    requireEntity: true,
    defaultValue: [],
  },
  entity_relation_template: {
    requireEntity: true,
    defaultValue: { format: "", fields: [] },
  },
  entity_relations_labels: { requireEntity: true, defaultValue: {} },
  disabled_entities: { requireEntity: false, defaultValue: [] },
  dashboard_entities: { requireEntity: false, defaultValue: [] },
  entities_order: { requireEntity: false, defaultValue: [] },
};

export interface IEntityCrudSettings {
  create: boolean;
  details: boolean;
  update: boolean;
  delete: boolean;
}
