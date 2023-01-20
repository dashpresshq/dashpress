import { rest } from "msw";
import { reduceStringToNumber } from "shared/lib/templates/reduceStringToNumber";
import { BASE_TEST_URL } from "./_utils";

export const dataApiHandlers = [
  rest.get(BASE_TEST_URL("/api/data/:entity/count"), async (req, res, ctx) => {
    const searchParams = req.url.searchParams.toString();

    let filterCount = reduceStringToNumber(req.url.searchParams.toString());

    if (
      searchParams ===
      "filters%5B0%5D%5Bid%5D=verified&filters%5B0%5D%5Bvalue%5D%5Boperator%5D=e&filters%5B0%5D%5Bvalue%5D%5Bvalue%5D=true&filters%5B1%5D%5Bid%5D=entity-1-date-field&filters%5B1%5D%5Bvalue%5D%5Boperator%5D=d&filters%5B1%5D%5Bvalue%5D%5Bvalue%5D=bt&filters%5B1%5D%5Bvalue%5D%5Bvalue2%5D=3%3Am"
    ) {
      filterCount = 0 - 10000;
    }
    return res(
      ctx.json({
        count: reduceStringToNumber(req.params.entity as string) + filterCount,
      })
    );
  }),
  rest.get(BASE_TEST_URL("/api/data/:entity/table"), async (req, res, ctx) => {
    return res(
      ctx.json({
        data: [
          {
            [`${req.params.entity}-id-field`]: 1,
            [`${req.params.entity}-reference-field`]: 2,
            [`${req.params.entity}-string-field`]: "hello",
            [`${req.params.entity}-number-field`]: 34,
            [`${req.params.entity}-boolean-field`]: true,
            [`${req.params.entity}-date-field`]: new Date(2022, 4, 7),
            [`${req.params.entity}-enum-field`]: "foo",
          },
          {
            [`${req.params.entity}-id-field`]: 2,
            [`${req.params.entity}-reference-field`]: 3,
            [`${req.params.entity}-string-field`]: "there",
            [`${req.params.entity}-number-field`]: 21,
            [`${req.params.entity}-boolean-field`]: false,
            [`${req.params.entity}-date-field`]: new Date(2021, 4, 7),
            [`${req.params.entity}-enum-field`]: "foo",
          },
          {
            [`${req.params.entity}-id-field`]: 3,
            [`${req.params.entity}-reference-field`]: 2,
            [`${req.params.entity}-string-field`]: "today",
            [`${req.params.entity}-number-field`]: 18,
            [`${req.params.entity}-boolean-field`]: true,
            [`${req.params.entity}-date-field`]: new Date(2022, 1, 7),
            [`${req.params.entity}-enum-field`]: "bar",
          },
        ],
        pageIndex: 1,
        pageSize: 10,
        totalRecords: 10,
      })
    );
  }),
];
