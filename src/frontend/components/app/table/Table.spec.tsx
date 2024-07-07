import { msg } from "@lingui/macro";
import { render, screen } from "@testing-library/react";

import { USE_ROUTER_PARAMS } from "@/tests/constants";
import { TestProviders } from "@/tests/Provider";

import { Table } from ".";
import { TABLE_COLUMNS, TABLE_DATA } from "./data";
import type { ITableProps } from "./types";

const DEFAULT_TABLE_PROPS: ITableProps<unknown> = {
  overridePaginatedDataState: {
    pageSize: 10,
    pageIndex: 1,
    sortBy: [{ id: "name", desc: true }],
  },
  syncPaginatedDataStateOut: jest.fn(),
  columns: TABLE_COLUMNS,
  empty: {
    text: msg`Empty Table`,
  },
  tableData: TABLE_DATA,
};

const useRouter = jest.spyOn(require("next/router"), "useRouter");

useRouter.mockImplementation(USE_ROUTER_PARAMS({}));

describe("Table", () => {
  it("should render data rows", async () => {
    render(
      <TestProviders>
        <Table {...DEFAULT_TABLE_PROPS} />
      </TestProviders>
    );

    expect(
      screen.getByRole("row", {
        name: "Id Sort By Id Name Header Sort By Name Header Desc Age Sort By Age Verified Role Author Sort By Author Registered Sort By Registered Actions",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("row", {
        name: "3 Vue 29 false User Evan Yue 2021-08-17T11:29:57.330Z Some Action",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("row", {
        name: "1 React 27 true Admin Facbook 2032-08-17T11:29:57.330Z Some Action",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("row", {
        name: "2 Angular 28 true Editor Goggle 2022-08-17T11:29:57.330Z Some Action",
      })
    ).toBeInTheDocument();
  });
});
