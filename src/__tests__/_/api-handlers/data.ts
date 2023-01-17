import { rest } from "msw";
import { reduceStringToNumber } from "shared/lib/templates/reduceStringToNumber";
import { BASE_TEST_URL } from "./_utils";

export const dataApiHandlers = [
  rest.get(BASE_TEST_URL("/api/data/:entity/count"), async (req, res, ctx) => {
    console.log({ foo: req.params });
    return res(
      ctx.json({
        count: reduceStringToNumber(req.params.entity as string),
      })
    );
  }),
  rest.get(BASE_TEST_URL("/api/data/:entity/table"), async (req, res, ctx) => {
    return res(
      ctx.json({
        data: [
          {
            [`${req.params.entity}-field-1`]: 1,
            [`${req.params.entity}-field-2`]: 2,
            [`${req.params.entity}-field-3`]: "hello",
            [`${req.params.entity}-field-4`]: 34,
            [`${req.params.entity}-field-5`]: true,
            [`${req.params.entity}-field-6`]: new Date(2022, 4, 7),
            [`${req.params.entity}-field-7`]: "foo",
          },
          {
            [`${req.params.entity}-field-1`]: 2,
            [`${req.params.entity}-field-2`]: 3,
            [`${req.params.entity}-field-3`]: "there",
            [`${req.params.entity}-field-4`]: 21,
            [`${req.params.entity}-field-5`]: false,
            [`${req.params.entity}-field-6`]: new Date(2021, 4, 7),
            [`${req.params.entity}-field-7`]: "foo",
          },
          {
            [`${req.params.entity}-field-1`]: 3,
            [`${req.params.entity}-field-2`]: 2,
            [`${req.params.entity}-field-3`]: "today",
            [`${req.params.entity}-field-4`]: 18,
            [`${req.params.entity}-field-5`]: true,
            [`${req.params.entity}-field-6`]: new Date(2022, 1, 7),
            [`${req.params.entity}-field-7`]: "bar",
          },
        ],
        pageIndex: 1,
        pageSize: 10,
        totalRecords: 10,
      })
    );
  }),
];
