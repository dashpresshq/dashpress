/* eslint-disable react/function-component-definition */
import { TestProviders } from "__tests__/_/Provider";
import { msg } from "@lingui/macro";
import { action } from "@storybook/addon-actions";
import type { Story } from "@storybook/react";
import { useState } from "react";
import type { IPaginatedDataState } from "shared/types/data";

import { DEFAULT_TABLE_STATE, Table } from ".";
import { TABLE_COLUMNS, TABLE_DATA } from "./data";
import type { ITableProps } from "./types";

export default {
  title: "Components/Table",
  component: Table,
  args: {
    overridePaginatedDataState: {
      pageSize: 10,
      pageIndex: 1,
      sortBy: [{ id: "id", desc: false }],
      filters: [
        {
          id: "name",
          value: {
            value: "React",
            operator: "e",
          },
        },
      ],
    },
    syncPaginatedDataStateOut: action("setPaginatedDataState"),
    columns: TABLE_COLUMNS,
    empty: {
      text: msg`Empty Table`,
    },
    tableData: TABLE_DATA,
  } as ITableProps<unknown>,
};

const Template: Story<ITableProps<unknown>> = (args) => {
  const [paginatedDataState, setPaginatedDataState] = useState<
    IPaginatedDataState<any>
  >({ ...DEFAULT_TABLE_STATE });

  return (
    <TestProviders>
      <button
        type="button"
        onClick={() => {
          setPaginatedDataState({
            pageSize: 10,
            pageIndex: 4,
            sortBy: [{ id: "id", desc: false }],
            filters: [
              {
                id: "name",
                value: {
                  value: new Date(),
                  operator: "e",
                },
              },
            ],
          });
        }}
      >
        Click Me
      </button>
      <Table {...args} overridePaginatedDataState={paginatedDataState} />
    </TestProviders>
  );
};

export const Default = Template.bind({});
Default.args = {};

export const WithBorder = Template.bind({});
WithBorder.args = {
  border: true,
};

export const Empty = Template.bind({});
Empty.args = {
  tableData: {
    data: {
      data: [],
      pageIndex: 1,
      pageSize: 10,
      totalRecords: 0,
    },
    isLoading: false,
    error: false,
    isPlaceholderData: false,
  },
};

export const Error = Template.bind({});
Error.args = {
  tableData: {
    data: {
      data: [],
      pageIndex: 1,
      pageSize: 10,
      totalRecords: 0,
    },
    isLoading: false,
    error: "Some Error Occured",
    isPlaceholderData: false,
  },
};

export const Loading = Template.bind({});
Loading.args = {
  tableData: {
    data: {
      data: [],
      pageIndex: 1,
      pageSize: 10,
      totalRecords: 0,
    },
    isLoading: true,
    error: false,
    isPlaceholderData: false,
  },
};

export const PreviousData = Template.bind({});
PreviousData.args = {
  tableData: {
    ...TABLE_DATA,
    isPlaceholderData: true,
  },
};
