import {
  OffCanvas,
  Table,
  DEFAULT_TABLE_PARAMS,
  SoftButton,
  Spacer,
  TableSkeleton,
} from "@hadmean/chromista";
import {
  usePaginatedData,
  SLUG_LOADING_VALUE,
  IPaginatedDataState,
} from "@hadmean/protozoa";
import { useState } from "react";
import { QueryFilter } from "shared/types/data";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { NAVIGATION_LINKS } from "../../../lib/routing/links";
import {
  useEntityCrudSettings,
  useEntityDiction,
  useSelectedEntityColumns,
} from "../../../hooks/entity/entity.config";
import { useEntityFields } from "../../../hooks/entity/entity.store";
import { ENTITY_TABLE_PATH } from "../../../hooks/data/data.store";
import { useTableColumns } from "./useTableColumns";
import { useDetailsOffCanvasStore } from "./hooks/useDetailsOffCanvas.store";
import { EntityDetailsView } from "../Details/DetailsView";

interface IProps {
  entity: string;
  lean?: true;
  persitentFilters?: QueryFilter[];
  defaultTableState?: Pick<
    IPaginatedDataState<unknown>,
    "pageSize" | "sortBy" | "filters"
  >;
}

export function EntityTableView({
  entity,
  lean,
  persitentFilters = [],
  defaultTableState,
}: IProps) {
  const entityFields = useEntityFields(entity);
  const entityCrudSettings = useEntityCrudSettings(entity);
  const hiddenTableColumns = useSelectedEntityColumns(
    "hidden_entity_table_columns",
    entity
  );

  const [paginatedDataState, setPaginatedDataState] = useState<
    IPaginatedDataState<any>
  >({ ...DEFAULT_TABLE_PARAMS, ...defaultTableState });

  const tableData = usePaginatedData(
    ENTITY_TABLE_PATH(entity),
    {
      ...paginatedDataState,
      filters: [...paginatedDataState.filters, ...persitentFilters],
    },
    {
      enabled: entity && entity !== SLUG_LOADING_VALUE,
    }
  );

  const [closeDetailsCanvas, detailsCanvasEntity, detailsCanvasId] =
    useDetailsOffCanvasStore((state) => [state.close, state.entity, state.id]);

  const canvasEntityDiction = useEntityDiction(detailsCanvasEntity);

  const columns = useTableColumns(entity, lean);

  const error =
    entityCrudSettings.error || entityFields.error || hiddenTableColumns.error;

  const isLoading =
    entityCrudSettings.isLoading ||
    entityFields.isLoading ||
    entity === SLUG_LOADING_VALUE ||
    hiddenTableColumns.isLoading;

  return (
    <>
      <ViewStateMachine
        error={error}
        loading={isLoading}
        loader={<TableSkeleton lean={lean} />}
      >
        <Table
          {...{
            tableData,
            setPaginatedDataState,
            paginatedDataState,
          }}
          lean={lean}
          columns={columns}
        />
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
