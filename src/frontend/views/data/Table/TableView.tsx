import {
  OffCanvas,
  Table,
  SoftButton,
  Spacer,
  TableSkeleton,
} from "@hadmean/chromista";
import { usePaginatedData, SLUG_LOADING_VALUE } from "@hadmean/protozoa";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { NAVIGATION_LINKS } from "../../../lib/routing/links";
import { useEntityDiction } from "../../../hooks/entity/entity.config";
import { ENTITY_TABLE_PATH } from "../../../hooks/data/data.store";
import { useTableColumns } from "./useTableColumns";
import { useDetailsOffCanvasStore, useTableState } from "./hooks";
import { EntityDetailsView } from "../Details/DetailsView";
import { TableViewComponent } from "./portal";
import { ITableViewProps } from "./types";

export function EntityTableView({
  entity,
  lean,
  persitentFilters = [],
  defaultTableState,
}: ITableViewProps) {
  // TODO Use Record<entity, columns> to store this, else you will be using old columns for new entity
  const columns = useTableColumns(entity, lean);

  const [currentState, overridePaginatedDataState, setPaginatedDataState] =
    useTableState(entity, persitentFilters, defaultTableState);

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
      <TableViewComponent />
    </>
  );
}
