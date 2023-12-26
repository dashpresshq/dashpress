import {
  useEntityFieldLabels,
  useEntityFieldSelections,
  useProcessedEntityFieldTypes,
  useHiddenEntityColumns,
} from "frontend/hooks/entity/entity.config";
import {
  useEntityIdField,
  useEntityFields,
  useEntityToOneReferenceFields,
} from "frontend/hooks/entity/entity.store";
import { FIELD_TYPES_CONFIG_MAP } from "shared/validations";
import { useMemo } from "react";
import { IColorableSelection } from "shared/types/ui";
import { ENTITY_LIST_PATH } from "frontend/hooks/data/constants";
import {
  useAppConfiguration,
  useEntityConfiguration,
} from "frontend/hooks/configuration/configuration.store";
import { DataStateKeys } from "frontend/lib/data/types";
import { ellipsis } from "shared/lib/strings";
import { TableFilterType } from "frontend/design-system/components/Table/filters/types";
import { ITableColumn } from "frontend/design-system/components/Table/types";
import { ActionButtons } from "frontend/design-system/components/Button/ActionButtons";
import { filterOutHiddenScalarColumns } from "../utils";
import { viewSpecialDataTypes } from "../viewSpecialDataTypes";
import { usePortalTableColumns } from "./portal";
import { evalutePresentationScript } from "../evaluatePresentationScript";
import { useEntityActionButtons } from "../hooks/useEntityActionButtons";
import { usePortalActionButtons } from "../Details/portal";

export const ACTIONS_ACCESSOR = "__actions__";

function TableActionButtons({
  row,
  entity,
}: {
  entity: string;
  row: {
    original: Record<string, unknown>;
  };
}) {
  const idField = useEntityIdField(entity);

  const idValue = row.original[idField.data || "id"] as string;

  const actionButtons = useEntityActionButtons({
    entity,
    entityId: idValue,
  });

  const portalActionButtons = usePortalActionButtons({
    entity,
    entityId: idValue,
    baseActionButtons: actionButtons,
  });

  return <ActionButtons actionButtons={portalActionButtons} justIcons />;
}

const buildFilterConfigFromType = (prop: {
  entityType: keyof typeof FIELD_TYPES_CONFIG_MAP;
  entityFieldSelections: IColorableSelection[];
  isIdField: boolean;
  referenceField?: string;
}): TableFilterType | undefined => {
  const { entityType, entityFieldSelections, isIdField, referenceField } = prop;

  if (isIdField) {
    return {
      _type: "idField",
      bag: undefined,
    };
  }
  const filterType$1 =
    FIELD_TYPES_CONFIG_MAP[entityType]?.tableFilterType || "not-filterable";

  if (filterType$1 === "not-filterable") {
    return undefined;
  }

  const filterType: TableFilterType = JSON.parse(JSON.stringify(filterType$1));

  switch (filterType._type) {
    case "date":
    case "string":
    case "number":
    case "idField":
      return filterType;
    case "boolean":
    case "status":
      filterType.bag = entityFieldSelections;
      return filterType;
    case "list":
      if (!referenceField) {
        return undefined;
      }
      filterType.bag = ENTITY_LIST_PATH(referenceField);
      return filterType;
  }
};

export const useTableColumns = (
  entity: string
): Partial<DataStateKeys<ITableColumn[]>> => {
  const portalTableColumns = usePortalTableColumns(entity);
  const getEntityFieldLabels = useEntityFieldLabels(entity);
  const entityFields = useEntityFields(entity);
  const entityToOneReferenceFields = useEntityToOneReferenceFields(entity);
  const hiddenTableColumns = useHiddenEntityColumns("table", entity);
  const defaultDateFormat = useAppConfiguration("default_date_format");
  const entityPresentationScript = useEntityConfiguration(
    "entity_presentation_script",
    entity
  );

  const idField = useEntityIdField(entity);

  const entityFieldTypes = useProcessedEntityFieldTypes(entity);
  const entityFieldSelections = useEntityFieldSelections(entity);

  const actionButtons = useEntityActionButtons({
    entity,
    entityId: "doesnt-matter-any-value-will-do-here",
  });

  const columnsToShow = useMemo(() => {
    return filterOutHiddenScalarColumns(
      entityFields.data,
      hiddenTableColumns.data
    );
  }, [entityFields.data.length, hiddenTableColumns.data.length]);

  if (
    entityToOneReferenceFields.isLoading ||
    defaultDateFormat.isLoading ||
    entityFields.isLoading ||
    idField.isLoading ||
    hiddenTableColumns.isLoading
  ) {
    return {
      isLoading: true,
    };
  }

  const error =
    entityToOneReferenceFields.error ||
    defaultDateFormat.error ||
    entityFields.error ||
    idField.error ||
    hiddenTableColumns.error;

  if (error) {
    return {
      error,
    };
  }

  const columns: ITableColumn[] = columnsToShow.map(({ name, isId }) => {
    const tableColumn: ITableColumn = {
      Header: getEntityFieldLabels(name),
      accessor: name,
      filter: buildFilterConfigFromType({
        entityType: entityFieldTypes[name],
        entityFieldSelections: entityFieldSelections[name],
        isIdField: idField.data === name,
        referenceField: entityToOneReferenceFields.data[name],
      }),
      disableSortBy: !FIELD_TYPES_CONFIG_MAP[entityFieldTypes[name]]?.sortable,
      Cell: ({ row }: { row: { original: Record<string, unknown> } }) => {
        const value$1 = row.original[name];
        if (isId) {
          return <span>{value$1 as string}</span>;
        }

        const value = evalutePresentationScript(
          entityPresentationScript.data.script,
          {
            field: name,
            from: "details",
            row: row.original,
            value: value$1,
          }
        );

        const specialDataTypeRender = viewSpecialDataTypes({
          fieldName: name,
          value,
          entityToOneReferenceFields: entityToOneReferenceFields.data,
          entityFieldSelections,
          entityFieldTypes,
          options: {
            displayFrom: "table",
            defaultDateFormat: defaultDateFormat.data,
          },
        });
        if (specialDataTypeRender) {
          return specialDataTypeRender;
        }
        if (typeof value === "string") {
          return <>{ellipsis(value as string, 50)}</>;
        }
        if (typeof value === "object") {
          return <>{JSON.stringify(value)}</>;
        }
        return <span>{value as string}</span>;
      },
    };
    return tableColumn;
  });

  if (actionButtons.length > 0) {
    columns.push({
      Header: "Actions",
      accessor: ACTIONS_ACCESSOR,
      disableSortBy: true,
      Cell: ({ row }: { row: { original: Record<string, unknown> } }) => (
        <TableActionButtons row={row} entity={entity} />
      ),
    });
  }

  return { data: portalTableColumns(columns) };
};
