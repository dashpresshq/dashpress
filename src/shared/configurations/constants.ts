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
  disabled_menu_entities: { defaultValue: [] },
  dashboard_entities: { defaultValue: [] },
  menu_entities_order: { defaultValue: [] },
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
