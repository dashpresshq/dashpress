import { IFieldValidationItem } from "shared/validations/types";
import { IColorableSelection } from "shared/types/ui";
import { FIELD_TYPES_CONFIG_MAP } from "shared/validations";
import { ITableView, QueryFilterSchema } from "shared/types/data";
import { BaseAppConfigurationKeys } from "./base-types";
import {
  PortalAppConfigurationKeys,
  PORTAL_APP_CONFIGURATION_CONFIG,
} from "./portal";
import { DEFAULT_SYSTEM_SETTINGS } from "./system";
import { IEntityCrudSettings } from "./types";

export type AppConfigurationKeys =
  | BaseAppConfigurationKeys
  | PortalAppConfigurationKeys;

export const APP_CONFIGURATION_CONFIG = {
  ...PORTAL_APP_CONFIGURATION_CONFIG,
  hidden_entity_table_columns: {
    label: "Table Columns Settings",
    requireEntity: true,
    defaultValue: [] as string[],
  },
  hidden_entity_create_columns: {
    label: "Create Columns Settings",
    requireEntity: true,
    defaultValue: [] as string[],
  },
  hidden_entity_update_columns: {
    label: "Update Columns Settings",
    requireEntity: true,
    defaultValue: [] as string[],
  },
  hidden_entity_details_columns: {
    label: "Details Columns Settings",
    requireEntity: true,
    defaultValue: [] as string[],
  },
  entity_fields_orders_table: {
    label: "Table Fields Order",
    requireEntity: true,
    defaultValue: [] as string[],
  },
  entity_fields_orders_create: {
    label: "Create Fields Order",
    requireEntity: true,
    defaultValue: [] as string[],
  },
  entity_fields_orders_update: {
    label: "Update Fields Order",
    requireEntity: true,
    defaultValue: [] as string[],
  },
  entity_fields_orders_details: {
    label: "Details Fields Order",
    requireEntity: true,
    defaultValue: [] as string[],
  },
  entity_columns_labels: {
    label: "Column Labels Settings",
    requireEntity: true,
    defaultValue: {} as Record<string, string>,
  },
  entity_columns_types: {
    label: "Column Types Settings",
    requireEntity: true,
    defaultValue: {} as Record<string, keyof typeof FIELD_TYPES_CONFIG_MAP>,
  },
  entity_validations: {
    label: "Validations",
    requireEntity: true,
    defaultValue: {} as Record<string, IFieldValidationItem[]>,
  },
  entity_selections: {
    label: "Selections Settings",
    requireEntity: true,
    defaultValue: {} as Record<string, IColorableSelection[]>,
  },
  entity_diction: {
    label: "Diction Settings",
    requireEntity: true,
    defaultValue: { singular: "", plural: "" },
  },
  entity_form_extension: {
    label: "Form Scripts",
    requireEntity: true,
    defaultValue: {
      fieldsState: "",
      beforeSubmit: "",
      initialValues: "",
    },
  },
  file_upload_settings: {
    label: "File Uploads Settings",
    defaultValue: {
      defaultMaxFileSizeInMB: 5,
      fileNameFormat: "{{random_letters}}-{{file_name}}-{{file_extension}}",
      filePathFormat: "/uploads/{{entity}}/{{current_date}}",
    },
  },
  entity_presentation_script: {
    label: "Presentation Scripts",
    requireEntity: true,
    defaultValue: {
      script: "",
    },
  },
  entity_crud_settings: {
    label: "CRUD Settings",
    requireEntity: true,
    defaultValue: {
      create: true,
      details: true,
      table: true,
      update: true,
      delete: true,
    } as IEntityCrudSettings,
  },
  table_views: {
    label: "Table Views",
    requireEntity: true,
    defaultValue: [] as ITableView[],
  },
  persistent_query: {
    label: "Persistent Query",
    requiresEntity: true,
    defaultValue: {
      children: [],
      operator: "and",
    } as QueryFilterSchema,
  },
  entity_relations_order: {
    label: "Relations Order",
    requireEntity: true,
    defaultValue: [] as string[],
  },
  hidden_entity_relations: {
    label: "Enabled Relations",
    requireEntity: true,
    defaultValue: [] as string[],
  },
  metadata_columns: {
    label: "Metadata Columns",
    defaultValue: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
  entity_relation_template: {
    label: "Relation Template",
    requireEntity: true,
    defaultValue: { format: "", fields: [] } as {
      format: string;
      fields: string[];
    },
  },
  entity_relations_labels: {
    label: "Relation Labels",
    requireEntity: true,
    defaultValue: {} as Record<string, string>,
  },
  disabled_entities: {
    label: "Enabled Entities Settings",
    defaultValue: [] as string[],
  },
  disabled_menu_entities: {
    label: "Menu Settings",
    defaultValue: [] as string[],
  },
  menu_entities_order: {
    label: "Menu Settings",
    defaultValue: [] as string[],
  },
  default_date_format: {
    label: "Date Format",
    defaultValue: "do MMM yyyy, h:MM aa",
  },
  system_settings: {
    label: "System Settings",
    defaultValue: DEFAULT_SYSTEM_SETTINGS,
  },
  theme_color: {
    label: "Theme Settings",
    guest: true,
    defaultValue: {
      primary: "#4b38b3",
      primaryDark: "#8c68cd",
    },
  },
  site_settings: {
    label: "Site Settings",
    guest: true,
    defaultValue: {
      name: "DashPress",
      fullLogo: "/assets/images/full-logo.png",
      homeLink: "https://dashpress.io",
      logo: "/assets/images/logo.png",
    },
  },
};

export type AppConfigurationValueType<T extends AppConfigurationKeys> =
  typeof APP_CONFIGURATION_CONFIG[T]["defaultValue"];
