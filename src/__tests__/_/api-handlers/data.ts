import { rest } from "msw";
import { reduceStringToNumber } from "shared/lib/templates/reduceStringToNumber";
import { BASE_TEST_URL } from "./_utils";

const allData = ({
  entity,
  idPrefix,
  stringPrefix,
}: {
  entity: string;
  stringPrefix: string;
  idPrefix: number;
}) => {
  const data: [number, number, string, number, boolean, Date, "foo" | "bar"][] =
    [
      [1, 2, "hello", 34, true, new Date(2022, 4, 7), "foo"],
      [2, 3, "there", 21, false, new Date(2021, 4, 7), "foo"],
      [3, 2, "today", 18, true, new Date(2022, 1, 7), "bar"],
    ];
  return data.map(
    ([id, reference, string$1, number$1, bool, date, enum$1]) => ({
      [`${entity}-id-field`]: id + idPrefix,
      [`${entity}-reference-field`]: reference,
      [`${entity}-string-field`]: `${string$1}${stringPrefix}`,
      [`${entity}-number-field`]: number$1,
      [`${entity}-boolean-field`]: bool,
      [`${entity}-date-field`]: date,
      [`${entity}-enum-field`]: enum$1,
    })
  );
};

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
    const searchParams = req.url.searchParams.toString();
    const { entity } = req.params;
    let idPrefix = 0;

    let stringPrefix = "";

    if (searchParams) {
      idPrefix = searchParams.length;

      const page = req.url.searchParams.get("page");
      const take = req.url.searchParams.get("take");
      const orderBy = req.url.searchParams.get("orderBy");

      stringPrefix = ` > p-${page},t=${take},o=${orderBy.at(0)} < `;
    }

    return res(
      ctx.json({
        data: allData({ entity: entity as string, idPrefix, stringPrefix }),
        pageIndex: 1,
        pageSize: 10,
        totalRecords: 10,
      })
    );
  }),
  rest.get(BASE_TEST_URL("/api/data/:entity/list"), async (req, res, ctx) => {
    // const searchParams = req.url.searchParams.toString();
    const { entity } = req.params;

    return res(
      ctx.json(
        allData({ entity: entity as string, idPrefix: 1, stringPrefix: "" })
      )
    );
  }),
  rest.get(BASE_TEST_URL("/api/data/:entity/:id"), async (req, res, ctx) => {
    const { entity, id } = req.params;

    return res(
      ctx.json(
        allData({
          entity: entity as string,
          idPrefix: id as unknown as number,
          stringPrefix: "",
        })[0]
      )
    );
  }),
];
