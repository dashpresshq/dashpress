import { FilterOperators } from "@hadmean/protozoa";
import { rest } from "msw";
import { ITableTab } from "shared/types/data";
import { BASE_TEST_URL } from "./_utils";

const ENTITY_CONFIG = {};

const ENTITY_VIEWS: ITableTab[] = [
  {
    id: "foo",
    title: "Foo Entity View",
    dataState: {
      pageSize: 15,
      sortBy: [{ id: "userName", desc: true }],
      filters: [
        {
          id: "username",
          value: {
            operator: FilterOperators.BETWEEN,
            value: "me",
          },
        },
      ],
    },
  },
  {
    id: "bar",
    title: "Bar Entity View",
    dataState: {
      pageSize: 16,
      sortBy: [{ id: "userName", desc: true }],
      filters: [
        {
          id: "username",
          value: {
            operator: FilterOperators.BETWEEN,
            value: "me",
          },
        },
      ],
    },
  },
  {
    id: "baz",
    title: "Baz Entity View",
    dataState: {
      pageSize: 17,
      sortBy: [{ id: "userName", desc: true }],
      filters: [
        {
          id: "username",
          value: {
            operator: FilterOperators.BETWEEN,
            value: "me",
          },
        },
      ],
    },
  },
];

const CONFIG_VALUES = {
  system_settings: {
    forceIntrospection: true,
    tokenValidityDurationInDays: 5,
  },
  site_settings: {
    name: "Hadmean",
    homeLink: "/",
    logo: "/assets/images/logo.png",
    fullLogo: "/assets/images/full-logo.png",
  },
  default_date_format: "do MMM yyyy",
  theme_color: {
    primary: `#459211`,
    primaryDark: `#111111`,
  },
  disabled_entities: ["disabled-entity-1", "disabled-entity-2"],
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
  entity_relations_labels: () => ({
    "related-entity-2": "Custom Label For Entity 2",
    "related-entity-4": "Custom Label For Entity 4",
  }),
  entity_views: () => ENTITY_VIEWS,
  hidden_entity_table_columns: () => ["hidden-field-1"],
  hidden_entity_create_columns: () => ["hidden-field-1"],
  hidden_entity_update_columns: () => ["hidden-field-1"],
  hidden_entity_details_columns: () => ["hidden-field-1"],
  hidden_entity_relations: () => ["hidden-related-entity-5"],
  entity_columns_labels: () => ({}),
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
