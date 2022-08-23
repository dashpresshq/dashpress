import { TableFilterType } from "@adminator/chromista/dist/components/Table/filters/types";
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
import { StringUtils } from "@adminator/protozoa";
import { ITableColumn } from "@adminator/chromista";
import { useMemo } from "react";
import { IColorableSelection } from "shared/types";
import { ENTITY_LIST_PATH } from "frontend/hooks/data/data.store";
import { fitlerOutHiddenScalarColumns } from "../utils";
import { TableActions } from "./Actions";
import { ReferenceComponent } from "./ReferenceComponent";
import { OptionTag } from "../OptionTag";

const buildFilterConfigFromType = (
  entityType: keyof typeof FIELD_TYPES_CONFIG_MAP,
  entityFieldSelections: IColorableSelection[],
  referenceField?: string
): TableFilterType | undefined => {
  const filterType =
    FIELD_TYPES_CONFIG_MAP[entityType]?.tableFilterType || "not-filterable";

  if (filterType === "not-filterable") {
    return undefined;
  }

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

export const useTableColumns = (entity: string) => {
  const getEntityFieldLabels = useEntityFieldLabels(entity);
  const entityCrudSettings = useEntityCrudSettings(entity);
  const entityFields = useEntityFields(entity);
  const entityToOneReferenceFields = useEntityToOneReferenceFields(entity);
  const hiddenTableColumns = useSelectedEntityColumns(
    "hidden_entity_table_columns",
    entity
  );

  const idField = useEntityIdField(entity);

  const entityFieldTypes = useEntityFieldTypes(entity);
  const entityFieldSelections = useEntityFieldSelections(entity);

  const columnsToShow = useMemo(() => {
    return fitlerOutHiddenScalarColumns(entityFields, hiddenTableColumns);
  }, [
    (entityFields?.data || []).length,
    (hiddenTableColumns.data || []).length,
  ]);

  /* 
   A Fix for the Cell that is memoized internall and the value for this is not getting updated
   so we need to wait for things to load before we render it
   */
  if (entityToOneReferenceFields.isLoading) {
    return [];
  }
  const columns: ITableColumn[] = columnsToShow.map(({ name, isId }) => {
    const tableColumn: ITableColumn = {
      Header: getEntityFieldLabels(name),
      accessor: name,
      filter:
        idField.data === name
          ? {
              _type: "idField",
            }
          : buildFilterConfigFromType(
              entityFieldTypes[name],
              entityFieldSelections[name],
              entityToOneReferenceFields.data[name]
            ),
      disableSortBy: !FIELD_TYPES_CONFIG_MAP[entityFieldTypes[name]]?.sortable,
      Cell: ({ value }: { value: unknown }) => {
        if (value === undefined || value === null) {
          return null;
        }
        if (isId) {
          return <span>{value as string}</span>;
        }

        if (entityToOneReferenceFields.data?.[name]) {
          return (
            <ReferenceComponent
              entity={entityToOneReferenceFields.data?.[name]}
              id={value as string}
              displayFrom="table"
            />
          );
        }

        if (entityFieldSelections[name]) {
          const availableOption = entityFieldSelections[name].find(
            (option) => option.value === value
          );
          if (availableOption) {
            return (
              <OptionTag
                color={availableOption.color}
                label={availableOption.label}
                value={availableOption.value}
              />
            );
          }
        }

        if (typeof value === "string") {
          return <>{StringUtils.ellipsis(value as string, 50)}</>;
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
    columns.push({
      Header: "Actions",
      accessor: "__actions__",
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
  return columns;
};
