import { msg } from "@lingui/macro";
import type { ITableView, QueryFilterSchema } from "shared/types/data";
import type { IColorableSelection } from "shared/types/ui";
import type {
  FormFieldTypes,
  IFieldValidationItem,
} from "shared/validations/types";

import type { BaseAppConfigurationKeys } from "./base-types";
import type { PortalAppConfigurationKeys } from "./portal";
import { PORTAL_APP_CONFIGURATION_CONFIG } from "./portal";
import { DEFAULT_SYSTEM_SETTINGS } from "./system";
import type { IEntityCrudSettings } from "./types";

export type AppConfigurationKeys =
  | BaseAppConfigurationKeys
  | PortalAppConfigurationKeys;

export const APP_CONFIGURATION_CONFIG = {
  ...PORTAL_APP_CONFIGURATION_CONFIG,
  hidden_entity_table_columns: {
    label: msg`Table Columns Settings`,
    requireEntity: true,
    defaultValue: [] as string[],
  },
  hidden_entity_create_columns: {
    label: msg`Create Columns Settings`,
    requireEntity: true,
    defaultValue: [] as string[],
  },
  hidden_entity_update_columns: {
    label: msg`Update Columns Settings`,
    requireEntity: true,
    defaultValue: [] as string[],
  },
  hidden_entity_details_columns: {
    label: msg`Details Columns Settings`,
    requireEntity: true,
    defaultValue: [] as string[],
  },
  entity_fields_orders_table: {
    label: msg`Table Fields Order`,
    requireEntity: true,
    defaultValue: [] as string[],
  },
  entity_fields_orders_create: {
    label: msg`Create Fields Order`,
    requireEntity: true,
    defaultValue: [] as string[],
  },
  entity_fields_orders_update: {
    label: msg`Update Fields Order`,
    requireEntity: true,
    defaultValue: [] as string[],
  },
  entity_fields_orders_details: {
    label: msg`Details Fields Order`,
    requireEntity: true,
    defaultValue: [] as string[],
  },
  entity_columns_labels: {
    label: msg`Column Labels Settings`,
    requireEntity: true,
    defaultValue: {} as Record<string, string>,
  },
  entity_columns_types: {
    label: msg`Column Types Settings`,
    requireEntity: true,
    defaultValue: {} as Record<string, FormFieldTypes>,
  },
  entity_validations: {
    label: msg`Validations`,
    requireEntity: true,
    defaultValue: {} as Record<string, IFieldValidationItem[]>,
  },
  entity_selections: {
    label: msg`Selections Settings`,
    requireEntity: true,
    defaultValue: {} as Record<string, IColorableSelection[]>,
  },
  entity_diction: {
    label: msg`Diction Settings`,
    requireEntity: true,
    defaultValue: { singular: "", plural: "" },
  },
  entity_form_extension: {
    label: msg`Form Scripts`,
    requireEntity: true,
    defaultValue: {
      fieldsState: "",
      beforeSubmit: "",
      initialValues: "",
    },
  },
  file_upload_settings: {
    label: msg`File Uploads Settings`,
    defaultValue: {
      defaultMaxFileSizeInMB: 5,
      fileNameFormat: "{{random_letters}}-{{file_name}}-{{file_extension}}",
      filePathFormat: "/uploads/{{entity}}/{{current_date}}",
    },
  },
  entity_presentation_script: {
    label: msg`Presentation Scripts`,
    requireEntity: true,
    defaultValue: {
      script: "",
    },
  },
  entity_crud_settings: {
    label: msg`CRUD Settings`,
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
    label: msg`Table Views`,
    requireEntity: true,
    defaultValue: [] as ITableView[],
  },
  persistent_query: {
    label: msg`Persistent Query`,
    requiresEntity: true,
    defaultValue: {
      children: [],
      operator: "and",
    } as QueryFilterSchema,
  },
  entity_relations_order: {
    label: msg`Relations Order`,
    requireEntity: true,
    defaultValue: [] as string[],
  },
  hidden_entity_relations: {
    label: msg`Enabled Relations`,
    requireEntity: true,
    defaultValue: [] as string[],
  },
  metadata_columns: {
    label: msg`Metadata Columns`,
    defaultValue: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
  entity_relation_template: {
    label: msg`Relation Template`,
    requireEntity: true,
    defaultValue: { format: "", fields: [] } as {
      format: string;
      fields: string[];
    },
  },
  entity_relations_labels: {
    label: msg`Relation Labels`,
    requireEntity: true,
    defaultValue: {} as Record<string, string>,
  },
  disabled_entities: {
    label: msg`Enabled Entities Settings`,
    defaultValue: [] as string[],
  },
  disabled_menu_entities: {
    label: msg`Menu Settings`,
    defaultValue: [] as string[],
  },
  menu_entities_order: {
    label: msg`Menu Settings`,
    defaultValue: [] as string[],
  },
  default_date_format: {
    label: msg`Date Format`,
    defaultValue: "do MMM yyyy, h:MM aa",
  },
  system_settings: {
    label: msg`System Settings`,
    defaultValue: DEFAULT_SYSTEM_SETTINGS,
  },
  users_to_database_link: {
    label: msg`Users to Database Link`,
    defaultValue: { table: "", field: "" },
  },
  theme_color: {
    label: msg`Theme Settings`,
    guest: true,
    defaultValue: {
      primary: "#4b38b3",
    },
  },
  site_settings: {
    label: msg`Site Settings`,
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
