import { TableFilterType } from "@hadmean/chromista/dist/components/Table/filters/types";
import {
  useEntityCrudSettings,
  useEntityFieldLabels,
  useEntityFieldSelections,
  useEntityFieldTypes,
  useSelectedEntityColumns,
} from "frontend/hooks/entity/entity.config";
import {
  useEntityIdField,
  useEntityFields,
  useEntityToOneReferenceFields,
} from "frontend/hooks/entity/entity.store";
import { FIELD_TYPES_CONFIG_MAP } from "shared/validations";
import { DataStateKeys, StringUtils } from "@hadmean/protozoa";
import { ITableColumn } from "@hadmean/chromista";
import { useMemo } from "react";
import { IColorableSelection } from "shared/types/ui";
import { ENTITY_LIST_PATH } from "frontend/hooks/data/data.store";
import { useAppConfiguration } from "frontend/hooks/configuration/configuration.store";
import { filterOutHiddenScalarColumns } from "../utils";
import { TableActions } from "./Actions";
import { viewSpecialDataTypes } from "../viewSpecialDataTypes";

export const ACTIONS_ACCESSOR = "__actions__";

const buildFilterConfigFromType = (prop: {
  entityType: keyof typeof FIELD_TYPES_CONFIG_MAP;
  entityFieldSelections: IColorableSelection[];
  isIdField: boolean;
  referenceField?: string;
  lean?: true;
}): TableFilterType | undefined => {
  const { entityType, entityFieldSelections, isIdField, referenceField, lean } =
    prop;

  if (lean) {
    return undefined;
  }
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
      filterType.bag = ENTITY_LIST_PATH(referenceField);
      return filterType;
  }
};

export const useTableColumns = (
  entity: string,
  lean?: true
): Partial<DataStateKeys<ITableColumn[]>> => {
  const getEntityFieldLabels = useEntityFieldLabels(entity);
  const entityCrudSettings = useEntityCrudSettings(entity);
  const entityFields = useEntityFields(entity);
  const entityToOneReferenceFields = useEntityToOneReferenceFields(entity);
  const hiddenTableColumns = useSelectedEntityColumns(
    "hidden_entity_table_columns",
    entity
  );
  const defaultDateFormat = useAppConfiguration<string>("default_date_format");

  const idField = useEntityIdField(entity);

  const entityFieldTypes = useEntityFieldTypes(entity);
  const entityFieldSelections = useEntityFieldSelections(entity);

  const columnsToShow = useMemo(() => {
    return filterOutHiddenScalarColumns(
      entityFields.data,
      hiddenTableColumns.data
    );
  }, [
    (entityFields?.data || []).length,
    (hiddenTableColumns.data || []).length,
  ]);

  if (
    entityToOneReferenceFields.isLoading ||
    defaultDateFormat.isLoading ||
    entityFields.isLoading ||
    idField.isLoading ||
    hiddenTableColumns.isLoading ||
    entityCrudSettings.isLoading
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
    hiddenTableColumns.error ||
    entityCrudSettings.error;

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
        lean,
      }),
      disableSortBy: lean
        ? true
        : !FIELD_TYPES_CONFIG_MAP[entityFieldTypes[name]]?.sortable,
      Cell: ({ row }: { row: Record<string, unknown> }) => {
        const value = row.original[name];
        if (value === undefined || value === null) {
          return null;
        }
        if (isId) {
          return <span>{value as string}</span>;
        }
        const specialDataTypeRender = viewSpecialDataTypes(
          name,
          value,
          entityToOneReferenceFields.data || {},
          entityFieldSelections,
          entityFieldTypes,
          {
            displayFrom: "table",
            defaultDateFormat: defaultDateFormat.data,
          }
        );
        if (specialDataTypeRender) {
          return specialDataTypeRender;
        }
        if (typeof value === "string") {
          return <>{StringUtils.ellipsis(value as string, 50)}</>;
        }
        if (typeof value === "object") {
          return <>{JSON.stringify(value)}</>;
        }
        return <span>{value as string}</span>;
      },
    };
    return tableColumn;
  });
  if (
    entityCrudSettings.data?.details ||
    entityCrudSettings.data?.delete ||
    entityCrudSettings.data?.update
  ) {
    if (!lean) {
      columns.push({
        Header: "Actions",
        accessor: ACTIONS_ACCESSOR,
        disableSortBy: true,
        Cell: ({ row }: { row: { original: Record<string, unknown> } }) => (
          <TableActions
            row={row}
            crudSettings={entityCrudSettings.data}
            entity={entity}
          />
        ),
      });
    }
  }
  return { data: columns };
};
