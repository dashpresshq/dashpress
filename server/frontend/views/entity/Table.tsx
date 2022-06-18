import { AppLayout } from "../../_layouts/app";
import {
  DeleteButton,
  ErrorAlert,
  SoftButton,
  Stack,
  Table,
} from "@gothicgeeks/design-system";
import { NAVIGATION_LINKS } from "../../lib/routing/links";
import {
  useEntityCrudSettings,
  useEntityDiction,
  useEntityFieldLabels,
  useEntitySlug,
  useSelectedEntityColumns,
} from "../../hooks/entity/entity.config";
import {
  useEntityIdField,
  useEntityScalarFields,
} from "../../hooks/entity/entity.store";
import { Download, Plus } from "react-feather";
import { useRouter } from "next/router";
import { SLUG_LOADING_VALUE } from "../../lib/routing/constants";
import { ITableColumn } from "@gothicgeeks/design-system/dist/components/Table/Table.types";
import Link from "next/link";
import {
  ENTITY_TABLE_PATH,
  useEntityDataDeletionMutation,
} from "../../hooks/data/data.store";
import {
  EntityActionTypes,
  useEntityActionMenuItems,
} from "./Configure/constants";
// import Offcanvas from 'react-bootstrap/Offcanvas'

// TODO sync table to url
// TODO when table passes a limit then a non synced columns to show
export function EntityTable() {
  const entity = useEntitySlug();
  const entityDiction = useEntityDiction();
  const entityScalarFields = useEntityScalarFields(entity);
  const idField = useEntityIdField(entity);
  const router = useRouter();
  const entityCrudSettings = useEntityCrudSettings();
  const entityDataDeletionMutation = useEntityDataDeletionMutation(entity);
  const actionItems = useEntityActionMenuItems([
    EntityActionTypes.CRUD,
    EntityActionTypes.Diction,
  ]);
  const hiddenTableColumns = useSelectedEntityColumns(
    "hidden_entity_table_columns"
  );
  const getEntityFieldLabels = useEntityFieldLabels();

  if (entityCrudSettings.isLoading || entityScalarFields.isLoading || entityCrudSettings.isLoading || hiddenTableColumns.isLoading) {
    return <>TODO Loading</>;
  }

  const error = entityCrudSettings.error || entityScalarFields.error || entityCrudSettings.error || hiddenTableColumns.error;

  if(error){
    return <ErrorAlert message={error} />
  }

  const columns: ITableColumn[] = (entityScalarFields.data || [])
    .filter(({ name }) => !(hiddenTableColumns.data || []).includes(name))
    .map(({ name, isId }) => ({
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
        const idValue = row.original[idField.data] as string;
        return (
          <Stack spacing={4} align="center">
            {entityCrudSettings.data.details && (
              <div>
                <SoftButton
                  to={NAVIGATION_LINKS.ENTITY.DETAILS(entity, idValue)}
                  label="Details"
                  color="primary"
                  justIcon={true}
                  icon="eye"
                />
              </div>
            )}
            {entityCrudSettings.data.update && (
              <div>
                <SoftButton
                  to={NAVIGATION_LINKS.ENTITY.UPDATE(entity, idValue)}
                  label="Edit"
                  icon="edit"
                  color="theme"
                  justIcon={true}
                  onClick={() => {}}
                />
              </div>
            )}
            {entityCrudSettings.data.delete && (
              <div>
                <DeleteButton
                  onDelete={() => entityDataDeletionMutation.mutate(idValue)}
                  isMakingDeleteRequest={entityDataDeletionMutation.isLoading}
                  shouldConfirmAlert={true}
                />
              </div>
            )}
            {/* <div>
          <SoftButton
            to={`/edit/foo`}
            pushLeft={true}
            label="Details"
            justIcon={true}
            icon="save"
          />
          <Spacer />
        </div> */}
            {/* Clone */}
            {/* // inline -edit // related entities */}
          </Stack>
        );
      },
    });
  }

  let menuItems = [
    {
      label: `Download as CSV`,
      IconComponent: Download,
      onClick: () => console.log("TODO"),
    },
    {
      label: `Multi Select Mode`,
      IconComponent: Download,
      onClick: () => console.log("TODO"),
    },
  ];

  if (entityCrudSettings.data?.create) {
    menuItems = [
      {
        label: `Add New ${entityDiction.singular}`,
        IconComponent: Plus,
        onClick: () => router.push(NAVIGATION_LINKS.ENTITY.CREATE(entity)),
      },
      ...menuItems,
    ];
  }

  if (entity === SLUG_LOADING_VALUE) {
    return "TODO Loading Indicator Here";
  }

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
      <Table
        url={ENTITY_TABLE_PATH(entity)}
        title=""
        columns={columns}
        // ovveride indicator
        menuItems={menuItems}
      />
    </AppLayout>
  );
}
