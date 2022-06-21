import { AppLayout } from "../../../_layouts/app";
import {
  ComponentIsLoading,
  ErrorAlert,
  OffCanvas,
  Table,
} from "@gothicgeeks/design-system";
import { NAVIGATION_LINKS } from "../../../lib/routing/links";
import {
  useEntityCrudSettings,
  useEntityDiction,
  useEntitySlug,
  useSelectedEntityColumns,
} from "../../../hooks/entity/entity.config";
import { useEntityScalarFields } from "../../../hooks/entity/entity.store";
import { SLUG_LOADING_VALUE } from "../../../lib/routing/constants";
import { ENTITY_TABLE_PATH } from "../../../hooks/data/data.store";
import {
  EntityActionTypes,
  useEntityActionMenuItems,
} from "../Configure/constants";
import { EntityDetailsView } from "../Details";
import { useState } from "react";
import { useTableMenuItems } from "./useTableMenuItems";
import { useTableColumns } from "./useTableColumns";

// TODO sync table to url
// TODO when table passes a limit then a non synced columns to show
export function EntityTable() {
  const entity = useEntitySlug();
  const entityDiction = useEntityDiction();
  const entityScalarFields = useEntityScalarFields(entity);
  const entityCrudSettings = useEntityCrudSettings();
  const actionItems = useEntityActionMenuItems([
    EntityActionTypes.CRUD,
    EntityActionTypes.Diction,
  ]);
  const menuItems = useTableMenuItems();
  const [showDetailsOffCanvas, setShowDetailsOffCanvas] = useState("");
  const hiddenTableColumns = useSelectedEntityColumns(
    "hidden_entity_table_columns"
  );
  const columns = useTableColumns(setShowDetailsOffCanvas);

  const error =
    entityCrudSettings.error ||
    entityScalarFields.error ||
    entityCrudSettings.error ||
    hiddenTableColumns.error;

  return (
    <AppLayout
      breadcrumbs={[
        {
          label: entityDiction.plural,
          value: NAVIGATION_LINKS.ENTITY.TABLE(entity),
        },
      ]}
      actionItems={actionItems}
    >
      {entityCrudSettings.isLoading ||
      entityScalarFields.isLoading ||
      entityCrudSettings.isLoading ||
      entity === SLUG_LOADING_VALUE ||
      hiddenTableColumns.isLoading ? (
        <ComponentIsLoading />
      ) : (
        <>
          {error ? (
            <ErrorAlert message={error} />
          ) : (
            <Table
              url={ENTITY_TABLE_PATH(entity)}
              title=""
              columns={columns}
              // ovveride indicator
              menuItems={menuItems}
            />
          )}
        </>
      )}
      <OffCanvas
        title="Details"
        onClose={() => setShowDetailsOffCanvas("")}
        show={!!showDetailsOffCanvas}
      >
        <EntityDetailsView id={showDetailsOffCanvas} />
      </OffCanvas>
    </AppLayout>
  );
}
