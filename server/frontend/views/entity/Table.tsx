import { AppLayout } from "../../_layouts/app";
import {
  DeleteButton,
  SoftButton,
  Stack,
  Table,
} from "@gothicgeeks/design-system";
import { NAVIGATION_LINKS } from "../../lib/routing/links";
import {
  useEntityDiction,
  useEntitySlug,
} from "../../hooks/entity/entity.config";
import {
  useEntityIdField,
  useEntityScalarFields,
} from "../../hooks/entity/entity.store";
import { Download, Plus, Save } from "react-feather";
import { useRouter } from "next/router";
import { SLUG_LOADING_VALUE } from "../../lib/routing/constants";
import { ITableColumn } from "@gothicgeeks/design-system/dist/components/Table/Table.types";
import { capitalCase } from "change-case";
import Link from "next/link";
import {
  ENTITY_TABLE_PATH,
  useEntityDataDeletionMutation,
} from "../../hooks/data/data.store";
import { EntityActionTypes, useEntityActionMenuItems } from "./Configure/constants";

// TODO sync table to url

export function EntityTable() {
  const entity = useEntitySlug();
  const entityDiction = useEntityDiction();
  const entityScalarFields = useEntityScalarFields(entity);
  const idField = useEntityIdField(entity);
  const router = useRouter();
  const entityDataDeletionMutation = useEntityDataDeletionMutation(entity);
  const actionItems = useEntityActionMenuItems([
    EntityActionTypes.CRUD, EntityActionTypes.Diction
  ]);

  const columns: ITableColumn[] = (entityScalarFields.data || []).map(
    ({ name, isId }) => ({
      Header: capitalCase(name),
      accessor: name,
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
    })
  );

  columns.push({
    Header: "Actions",
    accessor: "__actions__",
    disableSortBy: true,
    Cell: ({ row }) => {
      const idValue = row.original[idField.data] as string;
      return (
        <Stack spacing={4} align="center">
          <div>
            <SoftButton
              to={NAVIGATION_LINKS.ENTITY.UPDATE(entity, idValue)}
              label="Edit"
              icon="edit"
              color="primary"
              justIcon={true}
              onClick={() => {}}
            />
          </div>
          <div>
            <SoftButton
              to={NAVIGATION_LINKS.ENTITY.DETAILS(entity, idValue)}
              label="Details"
              color="theme"
              justIcon={true}
              icon="eye"
            />
          </div>
          <div>
            <DeleteButton
              onDelete={() => entityDataDeletionMutation.mutate(idValue)}
              isMakingDeleteRequest={entityDataDeletionMutation.isLoading}
              shouldConfirmAlert={true}
            />
          </div>
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
          {/* // inline -edit // related entities */}
        </Stack>
      );
    },
  });

  const menuItems = [
    {
      label: `Add New ${entityDiction.singular}`,
      IconComponent: Plus,
      onClick: () => router.push(NAVIGATION_LINKS.ENTITY.CREATE(entity)),
    },
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
