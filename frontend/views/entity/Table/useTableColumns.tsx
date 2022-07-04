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
import { lighten } from "polished";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import Link from "next/link";
import { ENTITY_TYPES_SELECTION_BAG } from "shared/validations.constants";
import { fitlerOutHiddenScalarColumns } from "../utils";
import { TableActions } from "./Actions";
import { ReferenceComponent } from "./ReferenceComponent";
import styled from "styled-components";

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
          console.log(availableOption);
          if (availableOption) {
            return (
              <OptionTag color={availableOption.color}>
                {availableOption.label}
              </OptionTag>
            );
          }
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

const DEFAULT_TAG_COLOR = "#000000";

const OptionTag = styled.div<{ color: string }>`
  display: inline-block;
  padding: 2px 4px;
  border-radius: 4px;
  border: 1px solid ${(props) => props.color || DEFAULT_TAG_COLOR};
  background: ${(props) => lighten(0.4, props.color || DEFAULT_TAG_COLOR)};
`;
