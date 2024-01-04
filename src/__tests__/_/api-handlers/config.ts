import { rest } from "msw";
import { FilterOperators, ITableTab } from "shared/types/data";
import { BASE_TEST_URL } from "./_utils";

const ENTITY_CONFIG = {};

const ENTITY_VIEWS = (entity: string): ITableTab[] => [
  {
    id: "foo",
    title: "Verified Entity View",
    dataState: {
      pageSize: 15,
      sortBy: [{ id: `${entity}-string-field`, desc: true }],
      filters: [
        {
          id: `${entity}-boolean-field`,
          value: {
            operator: FilterOperators.EQUAL_TO,
            value: true,
          },
        },
      ],
    },
  },
  {
    id: "bar",
    title: "User Entity View",
    dataState: {
      pageSize: 16,
      sortBy: [{ id: `${entity}-string-field`, desc: false }],
      filters: [
        {
          id: `${entity}-string-field`,
          value: {
            operator: FilterOperators.CONTAINS,
            value: "root",
          },
        },
      ],
    },
  },
  {
    id: "baz",
    title: "Age Entity View",
    dataState: {
      pageSize: 17,
      sortBy: [],
      filters: [
        {
          id: `${entity}-number-field`,
          value: {
            operator: FilterOperators.BETWEEN,
            value: 2,
            value2: 4,
          },
        },
      ],
    },
  },
];

const CONFIG_VALUES = {
  system_settings: {
    tokenValidityDurationInDays: 5,
  },
  site_settings: {
    name: "DashPress",
    homeLink: "/",
    logo: "/assets/images/logo.png",
    fullLogo: "/assets/images/full-logo.png",
  },
  default_date_format: "do MMM yyyy",
  theme_color: {
    primary: `#4b38b3`,
    primaryDark: `#111111`,
  },
  metadata_columns: {
    createdAt: `created_at`,
    updatedAt: `updated_at`,
  },
  disabled_entities: ["disabled-entity-1", "disabled-entity-2"],
  menu_entities_order: [],
  disabled_menu_entities: ["entity-3"],
};

const DEFAULT_ENTITY_CONFIG_VALUES: Record<
  string,
  (entity: string) => unknown
> = {
  entity_crud_settings: () => ({
    create: true,
    details: true,
    update: true,
    delete: true,
  }),
  entity_diction: (entity) => {
    return {
      singular: `Singular ${entity}`,
      plural: `Plural ${entity}`,
    };
  },
  entity_form_extension: () => ({
    fieldsState: "fieldsState",
    beforeSubmit: "beforeSubmit",
  }),
  entity_columns_types: () => ({}),
  entity_relations_labels: () => ({
    "related-entity-2": "Custom Label For Entity 2",
    "related-entity-4": "Custom Label For Entity 4",
  }),
  entity_views: (entity) => ENTITY_VIEWS(entity),
  hidden_entity_table_columns: () => ["hidden-field-1"],
  hidden_entity_create_columns: () => ["hidden-field-1"],
  hidden_entity_update_columns: () => ["hidden-field-1"],
  hidden_entity_details_columns: () => ["hidden-field-1"],

  entity_fields_orders_table: () => [],
  entity_fields_orders_create: () => [],
  entity_fields_orders_details: () => [],
  entity_fields_orders_update: () => [],

  hidden_entity_relations: () => ["hidden-related-entity-5"],
  entity_columns_labels: () => ({}),
  entity_presentation_script: () => "",
  entity_relation_template: (entity) => ({
    format: `${entity} - {{ name }}`,
    fields: ["name"],
  }),
};

export const configApiHandlers = [
  rest.get(
    BASE_TEST_URL("/api/config/theme_color/__guest"),
    async (_, res, ctx) => {
      return res(ctx.json(CONFIG_VALUES.theme_color));
    }
  ),
  rest.get(
    BASE_TEST_URL("/api/config/site_settings/__guest"),
    async (_, res, ctx) => {
      return res(ctx.json(CONFIG_VALUES.site_settings));
    }
  ),
  rest.get(BASE_TEST_URL("/api/config/:key"), async (req, res, ctx) => {
    return res(ctx.json(CONFIG_VALUES[req.params.key as string]));
  }),
  rest.put(BASE_TEST_URL("/api/config/:key"), async (req, res, ctx) => {
    CONFIG_VALUES[req.params.key as string] = (await req.json()).data;
    return res(ctx.status(201));
  }),
  rest.get(BASE_TEST_URL("/api/config/:key/:entity"), async (req, res, ctx) => {
    const mutatedData =
      ENTITY_CONFIG[req.params.entity as string]?.[req.params.key];
    if (mutatedData) {
      return res(ctx.json(mutatedData));
    }

    const defaultValue = DEFAULT_ENTITY_CONFIG_VALUES[req.params.key as string];
    if (defaultValue) {
      return res(ctx.json(defaultValue(req.params.entity as string)));
    }

    throw new Error(
      `Test API handler for config key (${req.params.key}) is not implemented`
    );
  }),
  rest.put(BASE_TEST_URL("/api/config/:key/:entity"), async (req, res, ctx) => {
    const entityConfig = ENTITY_CONFIG[req.params.entity as string] || {};
    ENTITY_CONFIG[req.params.entity as string] = {
      ...entityConfig,
      [req.params.key as string]: (await req.json()).data,
    };
    return res(ctx.status(201));
  }),
];
