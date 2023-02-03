import {
  OffCanvas,
  Table,
  DEFAULT_TABLE_STATE,
  SoftButton,
  Spacer,
  TableSkeleton,
} from "@hadmean/chromista";
import {
  usePaginatedData,
  SLUG_LOADING_VALUE,
  IPaginatedDataState,
} from "@hadmean/protozoa";
import { useEffect, useState } from "react";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { NAVIGATION_LINKS } from "../../../lib/routing/links";
import { useEntityDiction } from "../../../hooks/entity/entity.config";
import { ENTITY_TABLE_PATH } from "../../../hooks/data/data.store";
import { useTableColumns } from "./useTableColumns";
import {
  useDetailsOffCanvasStore,
  useCurrentTableStateStore,
  useEntityPaginatedState,
} from "./hooks";

import { EntityDetailsView } from "../Details/DetailsView";
import { useSyncPaginatedDataState } from "./portal";
import { ITableViewProps } from "./types";

export function EntityTableView({
  entity,
  lean,
  persitentFilters = [],
  defaultTableState,
}: ITableViewProps) {
  const columns = useTableColumns(entity, lean);

  const setGlobalTableState = useCurrentTableStateStore(
    (state) => state.setTableState
  );

  const [paginatedDataState$1, setPaginatedDataState] = useEntityPaginatedState(
    entity,
    defaultTableState
  );

  const [overridePaginatedDataState, setOverridePaginatedDataState] =
    useState<IPaginatedDataState<unknown>>(DEFAULT_TABLE_STATE);

  useEffect(() => {
    if (paginatedDataState$1) {
      setOverridePaginatedDataState(paginatedDataState$1);
    }
  }, [entity]);

  const currentState: IPaginatedDataState<any> = {
    ...paginatedDataState$1,
    filters: [...paginatedDataState$1.filters, ...persitentFilters],
  };

  useSyncPaginatedDataState();

  useEffect(() => {
    setGlobalTableState(currentState);
  }, [JSON.stringify(currentState)]);

  const tableData = usePaginatedData(ENTITY_TABLE_PATH(entity), currentState, {
    enabled: entity && entity !== SLUG_LOADING_VALUE,
  });

  const [closeDetailsCanvas, detailsCanvasEntity, detailsCanvasId] =
    useDetailsOffCanvasStore((state) => [state.close, state.entity, state.id]);

  const canvasEntityDiction = useEntityDiction(detailsCanvasEntity);

  const { error } = columns;

  const isLoading = entity === SLUG_LOADING_VALUE || columns.isLoading;

  return (
    <>
      <ViewStateMachine
        error={error}
        loading={isLoading}
        loader={<TableSkeleton lean={lean} />}
      >
        {!isLoading && (
          <Table
            {...{
              tableData,
              syncPaginatedDataStateOut: setPaginatedDataState,
              overridePaginatedDataState,
            }}
            lean={lean}
            columns={columns.data || []}
          />
        )}
      </ViewStateMachine>

      <OffCanvas
        title={`${canvasEntityDiction.singular} Details`}
        onClose={closeDetailsCanvas}
        show={!!detailsCanvasEntity}
      >
        <EntityDetailsView
          id={detailsCanvasId}
          entity={detailsCanvasEntity}
          displayFrom="canvas"
        />
        <Spacer />
        <SoftButton
          label="View Full Details"
          block
          action={NAVIGATION_LINKS.ENTITY.DETAILS(
            detailsCanvasEntity,
            detailsCanvasId
          )}
        />
      </OffCanvas>
    </>
  );
}
