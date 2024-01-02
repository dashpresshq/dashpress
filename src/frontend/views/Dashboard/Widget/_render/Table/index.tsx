import { ITableColumn } from "frontend/design-system/components/Table/types";
import { Table } from "frontend/design-system/components/Table";
import { userFriendlyCase } from "shared/lib/strings/friendly-case";
import { TableWidgetSchema } from "./types";

interface IProps {
  data: unknown;
}
export function TableWidget({ data }: IProps) {
  const tableData = TableWidgetSchema.parse(data);

  const columns: ITableColumn[] = Object.keys(tableData[0]).map((column) => ({
    Header: userFriendlyCase(column),
    accessor: column,
    disableSortBy: true,
  }));

  return (
    <Table
      tableData={{
        data: {
          data: tableData,
          pageIndex: 0,
          pageSize: 5,
          totalRecords: tableData.length,
        },
        error: "",
        isLoading: false,
        isPreviousData: false,
      }}
      syncPaginatedDataStateOut={() => {}}
      border
      empty={{ text: "No Data" }}
      lean
      columns={columns}
    />
  );
}
