import {
  IBEPaginatedDataState,
  IFEPaginatedDataState,
  useFEPaginatedData,
} from "@hadmean/protozoa";
import { useState } from "react";

import {
  Table,
  DEFAULT_TABLE_PARAMS,
  TableSkeleton,
  ITableColumn,
} from "@hadmean/chromista";
import { ViewStateMachine } from "./ViewStateMachine";

interface IProps {
  columns: ITableColumn[];
  dataEndpoint: string;
  emptyMessage?: string;
}
// TODO FE search
export function FEPaginationTable<T extends Record<string, unknown>>({
  columns,
  dataEndpoint,
  emptyMessage,
}: IProps) {
  const [paginatedDataState, setPaginatedDataState] = useState<
    IFEPaginatedDataState<T> | IBEPaginatedDataState
  >(DEFAULT_TABLE_PARAMS);

  const tableData = useFEPaginatedData<T>(dataEndpoint, {
    ...paginatedDataState,
    sortBy: undefined,
    pageIndex: paginatedDataState.pageIndex + 1,
    filters: undefined,
  });

  return (
    <ViewStateMachine
      error={tableData.error}
      loading={tableData.isLoading}
      loader={<TableSkeleton />}
    >
      <Table
        {...{
          tableData,
          setPaginatedDataState,
          paginatedDataState,
        }}
        emptyMessage={emptyMessage}
        columns={columns}
      />
    </ViewStateMachine>
  );
}
