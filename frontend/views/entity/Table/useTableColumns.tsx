import { ITableColumn } from "@gothicgeeks/design-system/dist/components/Table/Table.types";
import {
  useEntityCrudSettings,
  useEntityFieldLabels,
  useEntitySlug,
  useSelectedEntityColumns,
} from "frontend/hooks/entity/entity.config";
import {
  useEntityReferenceFields,
  useEntityScalarFields,
} from "frontend/hooks/entity/entity.store";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import Link from "next/link";
import { fitlerOutHiddenScalarColumns } from "../utils";
import { TableActions } from "./Actions";
import { ReferenceComponent } from "./ReferenceComponent";

export const useTableColumns = () => {
  const entity = useEntitySlug();
  const getEntityFieldLabels = useEntityFieldLabels();
  const entityCrudSettings = useEntityCrudSettings();
  const entityScalarFields = useEntityScalarFields(entity);
  const entityReferenceFields = useEntityReferenceFields(entity);
  const hiddenTableColumns = useSelectedEntityColumns(
    "hidden_entity_table_columns"
  );

  const columns: ITableColumn[] = fitlerOutHiddenScalarColumns(
    entityScalarFields,
    hiddenTableColumns
  ).map(({ name, isId }, index) => ({
    Header: getEntityFieldLabels(name),
    accessor: name,
    filter: {
      _type: "status",
      bag: [
        {
          label: "Processed",
          value: "processed",
          color: "red",
        },
        {
          label: "In Order",
          value: "in-order",
          color: "yellow",
        },
        {
          label: "Shipped",
          value: "shipped",
          color: "green",
        },
      ],
    },
    // filter: {_type: index % 2 === 0 ? "string" : "number"},
    // disableSortBy?: boolean;
    Cell: ({ value }) => {
      if (!value) {
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

      return <>{value as string}</>;
    },
  }));
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
