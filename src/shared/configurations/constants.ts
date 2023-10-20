import { ISingularPlural } from "shared/types/config";
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
    crudConfigLabel: "Table Columns Settings",
    requireEntity: true,
    defaultValue: [],
  },
  hidden_entity_create_columns: {
    crudConfigLabel: "Create Columns Settings",
    requireEntity: true,
    defaultValue: [],
  },
  hidden_entity_update_columns: {
    crudConfigLabel: "Update Columns Settings",
    requireEntity: true,
    defaultValue: [],
  },
  hidden_entity_details_columns: {
    crudConfigLabel: "Details Columns Settings",
    requireEntity: true,
    defaultValue: [],
  },
  entity_columns_labels: {
    crudConfigLabel: "Column Labels Settings",
    requireEntity: true,
    defaultValue: {},
  },
  entity_columns_types: {
    crudConfigLabel: "Column Types Settings",
    requireEntity: true,
    defaultValue: {},
  },
  entity_validations: {
    crudConfigLabel: "Validations",
    requireEntity: true,
    defaultValue: {},
  },
  entity_selections: {
    crudConfigLabel: "Selections Settings",
    requireEntity: true,
    defaultValue: {},
  },
  entity_diction: {
    crudConfigLabel: "Diction Settings",
    requireEntity: true,
    defaultValue: { singular: "", plural: "" } as ISingularPlural,
  },
  entity_form_extension: {
    crudConfigLabel: "Form Scripts",
    requireEntity: true,
    defaultValue: {
      fieldsState: "",
      beforeSubmit: "",
    },
  },
  entity_presentation_script: {
    crudConfigLabel: "Presentation Scripts",
    requireEntity: true,
    defaultValue: {
      script: "",
    },
  },
  entity_fields_orders: {
    crudConfigLabel: "Fields Order",
    requireEntity: true,
    defaultValue: [],
  },
  entity_crud_settings: {
    crudConfigLabel: "CRUD Settings",
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
    crudConfigLabel: "Views Settings",
    requireEntity: true,
    defaultValue: [],
  },
  entity_relations_order: {
    crudConfigLabel: "Relations Order",
    requireEntity: true,
    defaultValue: [],
  },
  hidden_entity_relations: {
    crudConfigLabel: "Enabled Relations",
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
    crudConfigLabel: "Menu Settings",
    defaultValue: [],
  },
  menu_entities_order: {
    crudConfigLabel: "Menu Settings",
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
      name: "DashPress",
      fullLogo: "/assets/images/full-logo.png",
      homeLink: "https://dashpress.io",
      logo: "/assets/images/logo.png",
    },
  },
};
