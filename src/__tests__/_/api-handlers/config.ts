import { rest } from "msw";
import { BASE_TEST_URL } from "./_utils";

const ENTITY_CONFIG = {};

const CONFIG_VALUES = {
  system_settings: {
    forceIntrospection: true,
    tokenValidityDurationInDays: 5,
  },
  default_date_format: "do MMM yyyy",
  theme_color: {
    primary: `#459211`,
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
  hidden_entity_table_columns: () => [],
  hidden_entity_create_columns: () => [],
  hidden_entity_update_columns: () => [],
  hidden_entity_details_columns: () => [],
  entity_columns_labels: () => ({}),
};

export const configApiHandlers = [
  rest.get(
    BASE_TEST_URL("/api/config/theme_color/__guest"),
    async (_, res, ctx) => {
      return res(ctx.json(CONFIG_VALUES.theme_color));
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
