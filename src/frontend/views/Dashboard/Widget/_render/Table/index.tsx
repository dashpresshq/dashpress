import { ITableColumn, Table } from "@hadmean/chromista";
import { TableWidgetSchema } from "./types";

interface IProps {
  data: unknown;
}
export function TableWidget({ data }: IProps) {
  const tableChartData = TableWidgetSchema.parse(data);

  const columns: ITableColumn[] = Object.keys(tableChartData[0]).map(
    (column) => ({
      Header: column,
      accessor: column,
      disableSortBy: true,
    })
  );

  return (
    <Table
      tableData={{
        data: {
          data: tableChartData,
          pageIndex: 0,
          pageSize: 5,
          totalRecords: tableChartData.length,
        },
        error: "",
        isLoading: false,
        isPreviousData: false,
      }}
      syncPaginatedDataStateOut={() => {}}
      border
      lean
      columns={columns}
    />
  );
}
