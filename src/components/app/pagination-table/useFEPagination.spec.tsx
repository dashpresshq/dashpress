import fetchMock from "jest-fetch-mock";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { waitFor } from "@testing-library/react";
import type { FieldQueryFilter } from "shared/types/data";
import { FilterOperators } from "shared/types/data";
import { renderHook } from "__tests__/_/lib/renderHook";
import { useFEPagination } from "./useFEPagination";

fetchMock.enableMocks();

const END_POINT = "foo";

const TEST_DATA = [
  { name: "Lionel Messi", age: 23, position: "forward" },
  { name: "Neymar", age: 29, position: "winger" },
  { name: "Xavi", age: 12, position: "midfielder" },
  { name: "Luis Suarez", age: 45, position: "forward" },
];

const TEST_TABLE_STATE = {
  pageIndex: 1,
  pageSize: 1,
  filters: [],
  sortBy: [],
};

interface ITestData {
  name: string;
  age: number;
  position: string;
}

describe("useFEPagination =>", () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeAll(async () => {
    fetchMock.mockResponseOnce(JSON.stringify(TEST_DATA));
  });

  describe("Format", () => {
    it("should settle", async () => {
      const { result } = renderHook(
        () => useFEPagination(END_POINT, { ...TEST_TABLE_STATE }),
        { wrapper }
      );
      await waitFor(() => result.current.isSuccess);
      expect(1).toBe(1);
    });

    it("should return first 10 entries by default in standard format", async () => {
      const { result } = renderHook(
        () =>
          useFEPagination(END_POINT, {
            ...TEST_TABLE_STATE,
            pageSize: undefined,
          }),
        { wrapper }
      );
      expect(result.current.data).toMatchInlineSnapshot(`
              {
                "data": [
                  {
                    "age": 23,
                    "name": "Lionel Messi",
                    "position": "forward",
                  },
                  {
                    "age": 29,
                    "name": "Neymar",
                    "position": "winger",
                  },
                  {
                    "age": 12,
                    "name": "Xavi",
                    "position": "midfielder",
                  },
                  {
                    "age": 45,
                    "name": "Luis Suarez",
                    "position": "forward",
                  },
                ],
                "pageIndex": 1,
                "pageSize": 10,
                "totalRecords": 4,
              }
          `);
    });
  });

  describe("Ordering", () => {
    it("should order by numeric field ASC correctly", async () => {
      const { result } = renderHook(
        () =>
          useFEPagination<ITestData>(END_POINT, {
            ...TEST_TABLE_STATE,
            pageSize: 4,
            sortBy: [{ id: "age", desc: false }],
          }),
        { wrapper }
      );
      expect(result.current.data).toMatchInlineSnapshot(`
        {
          "data": [
            {
              "age": 12,
              "name": "Xavi",
              "position": "midfielder",
            },
            {
              "age": 23,
              "name": "Lionel Messi",
              "position": "forward",
            },
            {
              "age": 29,
              "name": "Neymar",
              "position": "winger",
            },
            {
              "age": 45,
              "name": "Luis Suarez",
              "position": "forward",
            },
          ],
          "pageIndex": 1,
          "pageSize": 4,
          "totalRecords": 4,
        }
      `);
    });

    it("should order by numeric field DESC correctly", async () => {
      const { result } = renderHook(
        () =>
          useFEPagination<ITestData>(END_POINT, {
            ...TEST_TABLE_STATE,
            pageSize: 4,
            sortBy: [{ id: "age", desc: true }],
          }),
        { wrapper }
      );

      expect(result.current.data).toMatchInlineSnapshot(`
        {
          "data": [
            {
              "age": 45,
              "name": "Luis Suarez",
              "position": "forward",
            },
            {
              "age": 29,
              "name": "Neymar",
              "position": "winger",
            },
            {
              "age": 23,
              "name": "Lionel Messi",
              "position": "forward",
            },
            {
              "age": 12,
              "name": "Xavi",
              "position": "midfielder",
            },
          ],
          "pageIndex": 1,
          "pageSize": 4,
          "totalRecords": 4,
        }
      `);
    });

    it("should order by string field ASC correctly", async () => {
      const { result } = renderHook(
        () =>
          useFEPagination<ITestData>(END_POINT, {
            ...TEST_TABLE_STATE,
            pageSize: 4,
            sortBy: [{ id: "name", desc: false }],
          }),
        { wrapper }
      );

      expect(result.current.data).toMatchInlineSnapshot(`
        {
          "data": [
            {
              "age": 23,
              "name": "Lionel Messi",
              "position": "forward",
            },
            {
              "age": 45,
              "name": "Luis Suarez",
              "position": "forward",
            },
            {
              "age": 29,
              "name": "Neymar",
              "position": "winger",
            },
            {
              "age": 12,
              "name": "Xavi",
              "position": "midfielder",
            },
          ],
          "pageIndex": 1,
          "pageSize": 4,
          "totalRecords": 4,
        }
      `);
    });

    it("should order by string field DESC correctly", async () => {
      const { result } = renderHook(
        () =>
          useFEPagination<ITestData>(END_POINT, {
            ...TEST_TABLE_STATE,
            pageSize: 4,
            sortBy: [{ id: "name", desc: true }],
          }),
        { wrapper }
      );

      expect(result.current.data).toMatchInlineSnapshot(`
        {
          "data": [
            {
              "age": 12,
              "name": "Xavi",
              "position": "midfielder",
            },
            {
              "age": 29,
              "name": "Neymar",
              "position": "winger",
            },
            {
              "age": 45,
              "name": "Luis Suarez",
              "position": "forward",
            },
            {
              "age": 23,
              "name": "Lionel Messi",
              "position": "forward",
            },
          ],
          "pageIndex": 1,
          "pageSize": 4,
          "totalRecords": 4,
        }
      `);
    });
  });

  describe("Paging", () => {
    it("should return correct data for first page", async () => {
      const { result } = renderHook(
        () =>
          useFEPagination<ITestData>(END_POINT, {
            ...TEST_TABLE_STATE,
            pageIndex: 1,
            pageSize: 1,
          }),
        { wrapper }
      );

      expect(result.current.data).toMatchInlineSnapshot(`
        {
          "data": [
            {
              "age": 23,
              "name": "Lionel Messi",
              "position": "forward",
            },
          ],
          "pageIndex": 1,
          "pageSize": 1,
          "totalRecords": 4,
        }
      `);
    });

    it("should return correct data for second page", async () => {
      const { result } = renderHook(
        () =>
          useFEPagination<ITestData>(END_POINT, {
            ...TEST_TABLE_STATE,
            pageIndex: 2,
            pageSize: 1,
          }),
        { wrapper }
      );

      expect(result.current.data).toMatchInlineSnapshot(`
        {
          "data": [
            {
              "age": 29,
              "name": "Neymar",
              "position": "winger",
            },
          ],
          "pageIndex": 2,
          "pageSize": 1,
          "totalRecords": 4,
        }
      `);
    });

    it("should return correct data for last page", async () => {
      const { result } = renderHook(
        () =>
          useFEPagination<ITestData>(END_POINT, {
            ...TEST_TABLE_STATE,
            pageIndex: 4,
            pageSize: 1,
          }),
        { wrapper }
      );

      expect(result.current.data).toMatchInlineSnapshot(`
        {
          "data": [
            {
              "age": 45,
              "name": "Luis Suarez",
              "position": "forward",
            },
          ],
          "pageIndex": 4,
          "pageSize": 1,
          "totalRecords": 4,
        }
      `);
    });

    it("should return empty data for non-existent page", async () => {
      const { result } = renderHook(
        () =>
          useFEPagination(END_POINT, {
            ...TEST_TABLE_STATE,
            pageIndex: 49,
            pageSize: 1,
          }),
        { wrapper }
      );

      expect(result.current.data).toMatchInlineSnapshot(`
        {
          "data": [],
          "pageIndex": 49,
          "pageSize": 1,
          "totalRecords": 4,
        }
      `);
    });
  });

  describe("Filtering", () => {
    it("should filter correctly on EQUAL_TO", async () => {
      const { result } = renderHook(
        () =>
          useFEPagination(END_POINT, {
            ...TEST_TABLE_STATE,
            pageSize: undefined,
            filters: [
              {
                id: "position",
                value: { operator: FilterOperators.EQUAL_TO, value: "forward" },
              },
            ],
          }),
        { wrapper }
      );
      await waitFor(() => result.current.isSuccess);
      expect(result.current.data).toMatchInlineSnapshot(`
        {
          "data": [
            {
              "age": 23,
              "name": "Lionel Messi",
              "position": "forward",
            },
            {
              "age": 45,
              "name": "Luis Suarez",
              "position": "forward",
            },
          ],
          "pageIndex": 1,
          "pageSize": 10,
          "totalRecords": 2,
        }
      `);
    });

    it("should filter correctly on NOT_EQUAL", async () => {
      const { result } = renderHook(
        () =>
          useFEPagination(END_POINT, {
            ...TEST_TABLE_STATE,
            pageSize: undefined,
            filters: [
              {
                id: "position",
                value: {
                  operator: FilterOperators.NOT_EQUAL,
                  value: "forward",
                },
              },
            ],
          }),
        { wrapper }
      );
      await waitFor(() => result.current.isSuccess);
      expect(result.current.data).toMatchInlineSnapshot(`
        {
          "data": [
            {
              "age": 29,
              "name": "Neymar",
              "position": "winger",
            },
            {
              "age": 12,
              "name": "Xavi",
              "position": "midfielder",
            },
          ],
          "pageIndex": 1,
          "pageSize": 10,
          "totalRecords": 2,
        }
      `);
    });

    it("should filter correctly on CONTAINS case-insenstively and check inside texts", async () => {
      const { result } = renderHook(
        () =>
          useFEPagination(END_POINT, {
            ...TEST_TABLE_STATE,
            pageSize: undefined,
            filters: [
              {
                id: "name",
                value: { operator: FilterOperators.CONTAINS, value: "IONE" },
              },
            ],
          }),
        { wrapper }
      );
      await waitFor(() => result.current.isSuccess);
      expect(result.current.data).toMatchInlineSnapshot(`
        {
          "data": [
            {
              "age": 23,
              "name": "Lionel Messi",
              "position": "forward",
            },
          ],
          "pageIndex": 1,
          "pageSize": 10,
          "totalRecords": 1,
        }
      `);
    });

    it("should filter correctly on LESS_THAN", async () => {
      const { result } = renderHook(
        () =>
          useFEPagination(END_POINT, {
            ...TEST_TABLE_STATE,
            pageSize: undefined,
            filters: [
              {
                id: "age",
                value: { operator: FilterOperators.LESS_THAN, value: "25" },
              },
            ],
          }),
        { wrapper }
      );
      await waitFor(() => result.current.isSuccess);
      expect(result.current.data).toMatchInlineSnapshot(`
        {
          "data": [
            {
              "age": 23,
              "name": "Lionel Messi",
              "position": "forward",
            },
            {
              "age": 12,
              "name": "Xavi",
              "position": "midfielder",
            },
          ],
          "pageIndex": 1,
          "pageSize": 10,
          "totalRecords": 2,
        }
      `);
    });

    it("should filter correctly on GREATER_THAN", async () => {
      const { result } = renderHook(
        () =>
          useFEPagination(END_POINT, {
            ...TEST_TABLE_STATE,
            pageSize: undefined,
            filters: [
              {
                id: "age",
                value: { operator: FilterOperators.GREATER_THAN, value: "25" },
              },
            ],
          }),
        { wrapper }
      );
      await waitFor(() => result.current.isSuccess);
      expect(result.current.data).toMatchInlineSnapshot(`
        {
          "data": [
            {
              "age": 29,
              "name": "Neymar",
              "position": "winger",
            },
            {
              "age": 45,
              "name": "Luis Suarez",
              "position": "forward",
            },
          ],
          "pageIndex": 1,
          "pageSize": 10,
          "totalRecords": 2,
        }
      `);
    });

    it("should filter on multiple filters", async () => {
      const { result } = renderHook(
        () =>
          useFEPagination(END_POINT, {
            ...TEST_TABLE_STATE,
            pageSize: undefined,
            filters: [
              {
                id: "position",
                value: { operator: FilterOperators.EQUAL_TO, value: "forward" },
              },
              {
                id: "age",
                value: { operator: FilterOperators.LESS_THAN, value: "24" },
              },
            ] as FieldQueryFilter[],
          }),
        { wrapper }
      );
      await waitFor(() => result.current.isSuccess);
      expect(result.current.data).toMatchInlineSnapshot(`
        {
          "data": [
            {
              "age": 23,
              "name": "Lionel Messi",
              "position": "forward",
            },
          ],
          "pageIndex": 1,
          "pageSize": 10,
          "totalRecords": 1,
        }
      `);
    });

    it("should return all data on invalid filters", async () => {
      const { result } = renderHook(
        () =>
          useFEPagination(END_POINT, {
            ...TEST_TABLE_STATE,
            pageSize: undefined,
            filters: [
              {
                id: "position",
                value: { operator: "some-invalid-operator", value: "forward" },
              },
            ],
          }),
        { wrapper }
      );
      await waitFor(() => result.current.isSuccess);
      expect(result.current.data.data).toHaveLength(4);
    });

    it("should return all data on empty value", async () => {
      const { result } = renderHook(
        () =>
          useFEPagination(END_POINT, {
            ...TEST_TABLE_STATE,
            pageSize: undefined,
            filters: [
              {
                id: "position",
                value: { operator: FilterOperators.EQUAL_TO, value: "" },
              },
            ],
          }),
        { wrapper }
      );
      await waitFor(() => result.current.isSuccess);
      expect(result.current.data.data).toHaveLength(4);
    });

    it("should return empty data on bogus filters", async () => {
      const { result } = renderHook(
        () =>
          useFEPagination(END_POINT, {
            ...TEST_TABLE_STATE,
            pageSize: undefined,
            filters: [
              {
                id: "age",
                value: {
                  operator: FilterOperators.GREATER_THAN,
                  value: "200004",
                },
              },
            ] as FieldQueryFilter[],
          }),
        { wrapper }
      );
      await waitFor(() => result.current.isSuccess);
      expect(result.current.data).toMatchInlineSnapshot(`
        {
          "data": [],
          "pageIndex": 1,
          "pageSize": 10,
          "totalRecords": 0,
        }
      `);
    });
  });
});
