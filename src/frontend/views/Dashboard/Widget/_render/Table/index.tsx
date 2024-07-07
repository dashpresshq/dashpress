import { msg } from "@lingui/macro";

import { Table } from "@/components/app/table";
import type { ITableColumn } from "@/components/app/table/types";
import { typescriptSafeObjectDotKeys } from "@/shared/lib/objects";
import { userFriendlyCase } from "@/shared/lib/strings/friendly-case";

import { TableWidgetSchema } from "./types";

interface IProps {
  data: unknown;
}
export function TableWidget({ data }: IProps) {
  const tableData = TableWidgetSchema.parse(data);

  const columns: ITableColumn[] = typescriptSafeObjectDotKeys(tableData[0]).map(
    (column) => ({
      Header: msg`${userFriendlyCase(column)}`,
      accessor: column,
      disableSortBy: true,
    })
  );

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
        isPlaceholderData: false,
      }}
      syncPaginatedDataStateOut={() => {}}
      border
      empty={{ text: msg`No Data` }}
      lean
      columns={columns}
    />
  );
}
