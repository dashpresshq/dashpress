import {
  ITableColumn,
  TableFilterType,
} from "@gothicgeeks/design-system/dist/components/Table/Table.types";
import {
  useEntityCrudSettings,
  useEntityFieldLabels,
  useEntityFieldSelections,
  useEntityFieldTypes,
  useEntitySlug,
  useSelectedEntityColumns,
} from "frontend/hooks/entity/entity.config";
import {
  useEntityReferenceFields,
  useEntityScalarFields,
} from "frontend/hooks/entity/entity.store";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import Link from "next/link";
import { ENTITY_TYPES_SELECTION_BAG } from "shared/validations.constants";
import { fitlerOutHiddenScalarColumns } from "../utils";
import { TableActions } from "./Actions";
import { ReferenceComponent } from "./ReferenceComponent";
import { StringUtils } from "@gothicgeeks/shared";
import { OptionTag } from "../OptionTag";
import { Text } from "@gothicgeeks/design-system";

export const buildFilterConfigFromType = (
  entityType: keyof typeof ENTITY_TYPES_SELECTION_BAG
): TableFilterType | undefined => {
  const filterType =
    ENTITY_TYPES_SELECTION_BAG[entityType]?.tableFilterType || "not-filterable";

  if (filterType === "not-filterable") {
    return undefined;
  }

  switch (filterType._type) {
    case "string":
    case "number":
      return filterType;
    case "status":
      filterType.bag = [];
      return filterType;
    case "list":
      filterType.bag = [];
      return filterType;
  }
};

export const useTableColumns = () => {
  const entity = useEntitySlug();
  const getEntityFieldLabels = useEntityFieldLabels();
  const entityCrudSettings = useEntityCrudSettings();
  const entityScalarFields = useEntityScalarFields(entity);
  const entityReferenceFields = useEntityReferenceFields(entity);
  const hiddenTableColumns = useSelectedEntityColumns(
    "hidden_entity_table_columns"
  );

  const entityFieldTypes = useEntityFieldTypes();
  const entityFieldSelections = useEntityFieldSelections();

  const columns: ITableColumn[] = fitlerOutHiddenScalarColumns(
    entityScalarFields,
    hiddenTableColumns
  ).map(({ name, isId }) => {
    const tableColumn: ITableColumn = {
      Header: getEntityFieldLabels(name),
      accessor: name,
      filter: buildFilterConfigFromType(entityFieldTypes[name]),
      disableSortBy:
        !ENTITY_TYPES_SELECTION_BAG[entityFieldTypes[name]].sortable,
      Cell: ({ value }) => {
        if (value === undefined || value === null) {
          return <></>;
        }
        if (isId) {
          return (
            <Link
              href={NAVIGATION_LINKS.ENTITY.DETAILS(entity, value as string)}
              passHref={true}
            >
              {value as string}
            </Link>
          );
        }

        if (entityReferenceFields.data?.[name]) {
          return (
            <ReferenceComponent
              entity={entityReferenceFields.data?.[name]}
              id={value as string}
            />
          );
        }

        if (entityFieldSelections[name]) {
          const availableOption = entityFieldSelections[name].find(
            (option) => option.value === value
          );
          if (availableOption) {
            return <OptionTag {...availableOption} />;
          }
        }

        if (typeof value === "string") {
          // TODO change to ellipsis
          return <>{StringUtils.limitTo(value as string, 50)}</>;
        }

        return <>{value as string}</>;
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
      Cell: ({ row }) => {
        return (
          <TableActions row={row} crudSettings={entityCrudSettings.data} />
        );
      },
    });
  }
  return columns;
};
