import { ITableColumn } from "@gothicgeeks/design-system/dist/components/Table/Table.types";
import {
  useEntityCrudSettings,
  useEntityFieldLabels,
  useEntitySlug,
  useSelectedEntityColumns,
} from "frontend/hooks/entity/entity.config";
import { useEntityScalarFields } from "frontend/hooks/entity/entity.store";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import Link from "next/link";
import { fitlerOutHiddenScalarColumns } from "../utils";
import { TableActions } from "./Actions";

export const useTableColumns = (
  setShowDetailsOffCanvas: (id: string) => void
) => {
  const entity = useEntitySlug();
  const getEntityFieldLabels = useEntityFieldLabels();
  const entityCrudSettings = useEntityCrudSettings();
  const entityScalarFields = useEntityScalarFields(entity);
  const hiddenTableColumns = useSelectedEntityColumns(
    "hidden_entity_table_columns"
  );

  const columns: ITableColumn[] = fitlerOutHiddenScalarColumns(
    entityScalarFields,
    hiddenTableColumns
  ).map(({ name, isId }) => ({
    Header: getEntityFieldLabels(name),
    accessor: name,
    // filter: {_type: index % 2 === 0 ? "string" : "number"},
    // disableSortBy?: boolean;
    Cell: ({ value }) => {
      if (!isId) {
        return <>{value as string}</>;
      }
      return (
        <Link
          href={NAVIGATION_LINKS.ENTITY.DETAILS(entity, value as string)}
          passHref={true}
        >
          {value as string}
        </Link>
      );
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
          <TableActions
            row={row}
            crudSettings={entityCrudSettings.data}
            setShowDetailsOffCanvas={setShowDetailsOffCanvas}
          />
        );
      },
    });
  }
  return columns;
};
