import { AppLayout } from "../../_layouts/app";
import { Table } from "@gothicgeeks/design-system";
import { NAVIGATION_LINKS } from "../../lib/routing/links";
import {
  useEntityDiction,
  useEntitySlug,
} from "../../hooks/entity/entity.config";
import { useEntityScalarFields } from "../../hooks/entity/entity.store";
import { Plus, Save } from "react-feather";
import { useRouter } from "next/router";

export function EntityTable() {
  const entity = useEntitySlug();
  const entityDiction = useEntityDiction();
  const entityScalarFields = useEntityScalarFields(entity);
  const router = useRouter();

  const columns = (entityScalarFields.data || []).map(({ name }) => ({
    Header: name,
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
  }));

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
          onClick: () => router.push(NAVIGATION_LINKS.ENTITY.CONFIG.CRUD(entity)),
        },
        {
          label: "Table Settings",
          IconComponent: Plus,
          onClick: () => router.push(NAVIGATION_LINKS.ENTITY.CONFIG.TABLE(entity)),
        },
        {
          label: "Entity Diction",
          IconComponent: Plus,
          onClick: () => router.push(NAVIGATION_LINKS.ENTITY.CONFIG.DICTION(entity)),
        },
      ]}
    >
      <Table
        url={`/api/data/${entity}/table`}
        title={entityDiction.plural}
        columns={columns}
        singular={entityDiction.singular}
        createPath={NAVIGATION_LINKS.ENTITY.CREATE(entity)}
      />
    </AppLayout>
  );
}

/*
CRUD Settings

Table Settings
// Show, orderable, filterable, order

Hidden Create Columns
Hidden Update Columns
Hidden Details Columns

Entity Columns Labels
Entity Diction
Entity Validations

Comuted Columns
*/

// Actions will be on the table
// Multi Select
// Export
// Download
// Create
