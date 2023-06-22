import { TableFilterType } from "@hadmean/chromista/dist/components/Table/filters/types";
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
import { DataStateKeys, StringUtils } from "@hadmean/protozoa";
import { ITableColumn } from "@hadmean/chromista";
import { useMemo } from "react";
import { IColorableSelection } from "shared/types/ui";
import { ENTITY_LIST_PATH } from "frontend/hooks/data/data.store";
import {
  useAppConfiguration,
  useEntityConfiguration,
} from "frontend/hooks/configuration/configuration.store";
import { filterOutHiddenScalarColumns } from "../utils";
import { TableActions } from "./Actions";
import { viewSpecialDataTypes } from "../viewSpecialDataTypes";
import { usePortalTableColumns } from "./portal";
import { evalutePresentationScript } from "../evaluatePresentationScript";
import { IEntityPresentationScript } from "../types";
import { useCanUserPerformCrudAction } from "../useCanUserPerformCrudAction";

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
      if (!referenceField) {
        return undefined;
      }
      filterType.bag = ENTITY_LIST_PATH(referenceField);
      return filterType;
  }
};

export const useTableColumns = (
  entity: string,
  lean?: true
): Partial<DataStateKeys<ITableColumn[]>> => {
  const portalTableColumns = usePortalTableColumns(entity, !!lean);
  const getEntityFieldLabels = useEntityFieldLabels(entity);
  const canUserPerformCrudAction = useCanUserPerformCrudAction(entity);
  const entityFields = useEntityFields(entity);
  const entityToOneReferenceFields = useEntityToOneReferenceFields(entity);
  const hiddenTableColumns = useHiddenEntityColumns("table", entity);
  const defaultDateFormat = useAppConfiguration<string>("default_date_format");
  const entityPresentationScript =
    useEntityConfiguration<IEntityPresentationScript>(
      "entity_presentation_script",
      entity
    );

  const idField = useEntityIdField(entity);

  const entityFieldTypes = useProcessedEntityFieldTypes(entity);
  const entityFieldSelections = useEntityFieldSelections(entity);

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
        lean,
      }),
      disableSortBy: lean
        ? true
        : !FIELD_TYPES_CONFIG_MAP[entityFieldTypes[name]]?.sortable,
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
    canUserPerformCrudAction("details") ||
    canUserPerformCrudAction("delete") ||
    canUserPerformCrudAction("update")
  ) {
    if (!lean) {
      columns.push({
        Header: "Actions",
        accessor: ACTIONS_ACCESSOR,
        disableSortBy: true,
        Cell: ({ row }: { row: { original: Record<string, unknown> } }) => (
          <TableActions row={row} entity={entity} />
        ),
      });
    }
  }

  return { data: portalTableColumns(columns) };
};
