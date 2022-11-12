export const DEFAULT_SYSTEM_SETTINGS = {
  forceIntrospection: process.env.NODE_ENV === "production",
  tokenValidityDurationInDays: 14,
};

export const CONFIGURATION_KEYS: Record<
  | "hidden_entity_table_columns"
  | "hidden_entity_create_columns"
  | "hidden_entity_update_columns"
  | "hidden_entity_details_columns"
  | "entity_diction"
  | "entity_columns_types"
  | "theme_color"
  | "entity_fields_orders"
  | "entity_crud_settings"
  | "entity_views"
  | "entities_order"
  | "default_date_format"
  | "entity_columns_labels"
  | "disabled_entities"
  | "dashboard_entities"
  | "site_settings"
  | "entity_relation_template"
  | "entity_selections"
  | "entity_validations"
  | "entity_relations_labels"
  | "entity_form_extension"
  | "system_settings"
  | "hidden_entity_relations"
  | "entity_relations_order",
  { requireEntity?: true; defaultValue: unknown; guest?: true }
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
  entity_views: {
    requireEntity: true,
    defaultValue: [],
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
  disabled_entities: { defaultValue: [] },
  dashboard_entities: { defaultValue: [] },
  entities_order: { defaultValue: [] },
  default_date_format: {
    defaultValue: "do MMM yyyy, h:MM aa",
  },
  system_settings: {
    defaultValue: DEFAULT_SYSTEM_SETTINGS,
  },
  theme_color: {
    guest: true,
    defaultValue: {
      primary: "#4b38b3",
      primaryDark: "#8c68cd",
    },
  },
  site_settings: {
    guest: true,
    defaultValue: {
      name: "Hadmean",
      fullLogo: "/assets/images/full-logo.png",
      homeLink: "https://hadmean.com",
      logo: "/assets/images/logo.png",
    },
  },
};

export interface IEntityCrudSettings {
  create: boolean;
  details: boolean;
  update: boolean;
  delete: boolean;
}

export type ISystemSettings = {
  forceIntrospection: boolean;
  tokenValidityDurationInDays: number;
};
