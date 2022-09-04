import {
  ComponentIsLoading,
  OffCanvas,
  Table,
  DEFAULT_TABLE_PARAMS,
  SoftButton,
  Spacer,
} from "@hadmean/chromista";
import {
  IBEPaginatedDataState,
  usePaginatedData,
  SLUG_LOADING_VALUE,
  IFEPaginatedDataState,
} from "@hadmean/protozoa";
import { useState } from "react";
import { QueryFilter } from "shared/types";
import { ViewStateMachine } from "frontend/lib/ViewStateMachine";
import { NAVIGATION_LINKS } from "../../../lib/routing/links";
import {
  useEntityCrudSettings,
  useEntityDiction,
  useSelectedEntityColumns,
} from "../../../hooks/entity/entity.config";
import { useEntityFields } from "../../../hooks/entity/entity.store";
import { ENTITY_TABLE_PATH } from "../../../hooks/data/data.store";
import { useTableMenuItems } from "./useTableMenuItems";
import { useTableColumns } from "./useTableColumns";
import { useDetailsOffCanvasStore } from "./hooks/useDetailsOffCanvas.store";
import { EntityDetailsView } from "../Details/DetailsView";

interface IProps {
  entity: string;
  persitentFilters?: QueryFilter[];
}

export function EntityTableView({ entity, persitentFilters = [] }: IProps) {
  const menuItems = useTableMenuItems(entity);
  const entityFields = useEntityFields(entity);
  const entityCrudSettings = useEntityCrudSettings(entity);
  const hiddenTableColumns = useSelectedEntityColumns(
    "hidden_entity_table_columns",
    entity
  );

  const [paginatedDataState, setPaginatedDataState] = useState<
    IBEPaginatedDataState | IFEPaginatedDataState<any>
  >(DEFAULT_TABLE_PARAMS);

  const tableData = usePaginatedData(
    ENTITY_TABLE_PATH(entity),
    {
      ...paginatedDataState,
      filters: [
        ...(paginatedDataState.filters as Array<
          IBEPaginatedDataState | IFEPaginatedDataState<any>
        >),
        ...persitentFilters,
      ],
    },
    {
      enabled: entity && entity !== SLUG_LOADING_VALUE,
    }
  );

  const [closeDetailsCanvas, detailsCanvasEntity, detailsCanvasId] =
    useDetailsOffCanvasStore((state) => [state.close, state.entity, state.id]);

  const canvasEntityDiction = useEntityDiction(detailsCanvasEntity);

  const columns = useTableColumns(entity);

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
        loader={<ComponentIsLoading />}
      >
        <Table
          title=""
          {...{
            tableData,
            setPaginatedDataState,
            paginatedDataState,
          }}
          columns={columns}
          menuItems={menuItems}
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
