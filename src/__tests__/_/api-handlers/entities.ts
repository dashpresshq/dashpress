import { rest } from "msw";
import { IEntityField } from "shared/types";
import { BASE_TEST_URL } from "./_utils";

export const entitiesApiHandlers = [
  rest.get(BASE_TEST_URL("/api/entities/menu"), async (_, res, ctx) => {
    return res(
      ctx.json([
        {
          value: "entity-1",
          label: "entity-1",
        },
      ])
    );
  }),
  rest.get(BASE_TEST_URL("/api/entities/list"), async (_, res, ctx) => {
    return res(
      ctx.json([
        {
          value: "entity-1",
          label: "entity-1",
        },
        {
          value: "entity-2",
          label: "entity-2",
        },
        {
          value: "entity-3",
          label: "entity-3",
        },
        {
          value: "disabled-entity-1",
          label: "disabled-entity-1",
        },
        {
          value: "disabled-entity-2",
          label: "disabled-entity-2",
        },
      ])
    );
  }),

  rest.get(
    BASE_TEST_URL("/api/entities/:entity/relations"),
    async (_, res, ctx) => {
      return res(
        ctx.json([
          {
            table: "entity-2",
            label: "Entity 2 Label",
            type: "toMany",
          },
          {
            table: "entity-3",
            label: "Entity 3 Label",
            field: "foo-1",
            type: "toOne",
          },
          {
            table: "entity-4",
            label: "Entity 4 Label",
            field: "foo-1",
            type: "toOne",
          },
        ])
      );
    }
  ),

  rest.get(
    BASE_TEST_URL("/api/entities/:entity/relation-list"),
    async (_, res, ctx) => {
      return res(ctx.json(["entity-2", "entity-3"]));
    }
  ),

  rest.get(
    BASE_TEST_URL("/api/entities/:entity/fields"),
    async (req, res, ctx) => {
      const fields: IEntityField[] = [
        {
          name: `${req.params.entity}-field-1`,
          isRequired: true,
          isId: true,
          type: "number",
        },
        {
          name: `${req.params.entity}-field-2`,
          isReference: true,
          type: "string",
        },

        {
          name: `${req.params.entity}-field-3`,
          isRequired: true,
          type: "string",
          length: 30,
        },
        {
          name: `${req.params.entity}-field-4`,
          type: "number",
          length: 30,
        },
        {
          name: `${req.params.entity}-field-5`,
          type: "boolean",
        },
        {
          name: `${req.params.entity}-field-6`,
          type: "date",
        },
        {
          name: `${req.params.entity}-field-7`,
          type: "enum",
          enumeration: ["foo", "bar"],
        },
      ];
      return res(ctx.json(fields));
    }
  ),
];
