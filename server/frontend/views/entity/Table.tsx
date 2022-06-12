import { AppLayout } from "../../_layouts/app";
import { SoftButton, Spacer, Stack, Table } from "@gothicgeeks/design-system";
import { NAVIGATION_LINKS } from "../../lib/routing/links";
import {
  useEntityDiction,
  useEntitySlug,
} from "../../hooks/entity/entity.config";
import { useEntityScalarFields } from "../../hooks/entity/entity.store";
import { Download, Plus, Save } from "react-feather";
import { useRouter } from "next/router";
import { SLUG_LOADING_VALUE } from "../../lib/routing/constants";
import { ITableColumn } from "@gothicgeeks/design-system/dist/components/Table/Table.types";
import { capitalCase } from "change-case";

// TODO sync table to url

export function EntityTable() {
  const entity = useEntitySlug();
  const entityDiction = useEntityDiction();
  const entityScalarFields = useEntityScalarFields(entity);
  const router = useRouter();

  const columns: ITableColumn[] = (entityScalarFields.data || []).map(
    ({ name }) => ({
      Header: capitalCase(name),
      accessor: name,
      // disableSortBy?: boolean;
      // disableFilters?: boolean;
      // Filter?: (input: {
      //   columns: { filterValue: unknown; setFilter: (filter: unknown) => void };
      // }) => JSX.Element;
      // Cell?: (cellProps: {
      //   value: unknown;
      //   row: { original: Record<string, unknown> };
      // }) => JSX.Element;
    })
  );

  columns.push({
    Header: "Actions",
    accessor: "__actions__",
    disableFilters: true,
    disableSortBy: true,
    Cell: ({ value, row }) => (
      <Stack spacing={2}>
        <div>
          <SoftButton
            to={`/edit/foo`}
            pushLeft={true}
            label="Edit"
            icon="edit"
            color="primary"
            justIcon={true}
            onClick={() => {}}
          />
          <Spacer />
        </div>
        <div>
          <SoftButton
            to={`/edit/foo`}
            pushLeft={true}
            label="Details"
            color="theme"
            justIcon={true}
            icon="eye"
          />
          <Spacer />
        </div>{" "}
        <div>
          <SoftButton
            pushLeft={true}
            label="Delete"
            icon="close"
            color="danger"
            justIcon={true}
            onClick={() => {}}
          />
          <Spacer />
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
        {/* // inline -edit // related models */}
      </Stack>
    ),
  });

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
      actionItems={[
        {
          label: "CRUD Settings",
          IconComponent: Save,
          onClick: () =>
            router.push(NAVIGATION_LINKS.ENTITY.CONFIG.CRUD(entity)),
        },
        {
          label: "Table Settings",
          IconComponent: Plus,
          onClick: () =>
            router.push(NAVIGATION_LINKS.ENTITY.CONFIG.TABLE(entity)),
        },
        {
          label: "Entity Diction",
          IconComponent: Plus,
          onClick: () =>
            router.push(NAVIGATION_LINKS.ENTITY.CONFIG.DICTION(entity)),
        },
      ]}
    >
      <Table
        url={`/api/data/${entity}/table`}
        title={entityDiction.plural}
        columns={columns}
        // Loading indicator
        menuItems={[
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
        ]}
      />
    </AppLayout>
  );
}
