import React from "react";
import { render, screen } from "@testing-library/react";
import { Table } from ".";
import { ITableProps } from "./types";
import { TABLE_COLUMNS, TABLE_DATA } from "./data";

const DEFAULT_TABLE_PROPS: ITableProps<unknown> = {
  overridePaginatedDataState: {
    pageSize: 10,
    pageIndex: 1,
    sortBy: [{ id: "name", desc: true }],
  },
  syncPaginatedDataStateOut: jest.fn(),
  columns: TABLE_COLUMNS,
  tableData: TABLE_DATA,
};

describe("Table", () => {
  it("should render data rows", async () => {
    render(<Table {...DEFAULT_TABLE_PROPS} />);

    expect(
      screen.getByRole("row", {
        name: "Id Sort By Id Filter Id By Id Name Header Sort By Name Header Desc Filter Name Header By Search Age Sort By Age Filter Age By Number Verified Filter Verified By Boolean Role Filter Role By Status Author Sort By Author Filter Author By List Registered Sort By Registered Filter Registered By Date Actions",
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
