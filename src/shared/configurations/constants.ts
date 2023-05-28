import { BaseAppConfigurationKeys } from "./base-types";
import { PortalConfigurationKeys, PORTAL_CONFIGURATION_KEYS } from "./portal";
import { DEFAULT_SYSTEM_SETTINGS } from "./system";
import { IAppConfigurationBag } from "./types";

export type AppConfigurationKeys =
  | BaseAppConfigurationKeys
  | PortalConfigurationKeys;

export const CONFIGURATION_KEYS: Record<
  AppConfigurationKeys,
  IAppConfigurationBag
> = {
  ...PORTAL_CONFIGURATION_KEYS,
  hidden_entity_table_columns: {
    crudConfigLabel: "Entity Table Columns Settings",
    requireEntity: true,
    defaultValue: [],
  },
  hidden_entity_create_columns: {
    crudConfigLabel: "Create Entity Columns Settings",

    requireEntity: true,
    defaultValue: [],
  },
  hidden_entity_update_columns: {
    crudConfigLabel: "Update Entity Columns Settings",

    requireEntity: true,
    defaultValue: [],
  },
  hidden_entity_details_columns: {
    crudConfigLabel: "Entity Details Columns Settings",
    requireEntity: true,
    defaultValue: [],
  },
  entity_columns_labels: {
    crudConfigLabel: "Entity Column Labels Settings",
    requireEntity: true,
    defaultValue: {},
  },
  entity_columns_types: {
    crudConfigLabel: "Entity Column Types Settings",
    requireEntity: true,
    defaultValue: {},
  },
  entity_validations: {
    crudConfigLabel: "Entity Validations",
    requireEntity: true,
    defaultValue: {},
  },
  entity_selections: {
    crudConfigLabel: "Entity Selections Settings",
    requireEntity: true,
    defaultValue: {},
  },
  entity_diction: {
    crudConfigLabel: "Entity Diction Settings",
    requireEntity: true,
    defaultValue: { singular: "", plural: "" },
  },
  entity_form_extension: {
    crudConfigLabel: "Entity Form Extension",
    requireEntity: true,
    defaultValue: {
      fieldsState: "",
      beforeSubmit: "",
    },
  },
  entity_fields_orders: {
    crudConfigLabel: "Entity Fields Order",
    requireEntity: true,
    defaultValue: [],
  },
  entity_crud_settings: {
    crudConfigLabel: "Entity CRUD Settings",
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
    crudConfigLabel: "Entity Views Settings",
    requireEntity: true,
    defaultValue: [],
  },
  entity_relations_order: {
    crudConfigLabel: "Entity Relations Order",
    requireEntity: true,
    defaultValue: [],
  },
  hidden_entity_relations: {
    crudConfigLabel: "Enables Relation Settings",
    requireEntity: true,
    defaultValue: [],
  },
  entity_relation_template: {
    crudConfigLabel: "Relation Template",
    requireEntity: true,
    defaultValue: { format: "", fields: [] },
  },
  entity_relations_labels: {
    crudConfigLabel: "Relation Labels",
    requireEntity: true,
    defaultValue: {},
  },
  disabled_entities: {
    crudConfigLabel: "Enabled Entities Settings",
    defaultValue: [],
  },
  disabled_menu_entities: {
    crudConfigLabel: "Menu Entities Settings",
    defaultValue: [],
  },
  menu_entities_order: {
    crudConfigLabel: "Menu Entities Settings",
    defaultValue: [],
  },
  default_date_format: {
    crudConfigLabel: "Date Format",
    defaultValue: "do MMM yyyy, h:MM aa",
  },
  system_settings: {
    crudConfigLabel: "System Settings",
    defaultValue: DEFAULT_SYSTEM_SETTINGS,
  },
  theme_color: {
    crudConfigLabel: "Theme Settings",
    guest: true,
    defaultValue: {
      primary: "#4b38b3",
      primaryDark: "#8c68cd",
    },
  },
  site_settings: {
    crudConfigLabel: "Site Settings",
    guest: true,
    defaultValue: {
      name: "Hadmean",
      fullLogo: "/assets/images/full-logo.png",
      homeLink: "https://hadmean.com",
      logo: "/assets/images/logo.png",
    },
  },
};
