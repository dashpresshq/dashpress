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
import { SLUG_LOADING_VALUE } from "../../lib/routing/constants";

// TODO sync table to url
// actions
// eyes
// edit
// delete
// inline -edit
// related models

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

  if(entity === SLUG_LOADING_VALUE){
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
        // Loading indicator
        singular={entityDiction.singular}
        createPath={NAVIGATION_LINKS.ENTITY.CREATE(entity)}
      />
    </AppLayout>
  );
}


// Data Actions will be on the table
// Multi Select
// Export
// Download
// Create
