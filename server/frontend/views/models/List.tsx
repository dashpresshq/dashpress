import { useSchemaFields, useSchemaScalarFields } from "../../data-store/schema.data-store";
import { useSlug } from "../../lib/routing/useSlug";
import { AppLayout } from "../../_layouts/app";
import { Table } from "@gothicgeeks/design-system";

export function ListModel() {
  const model = useSlug("model");
  const schemaScalarFields = useSchemaScalarFields(model);

  console.log(schemaScalarFields);

  const columns = (schemaScalarFields.data || []).map(({ name }) => ({
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
    <AppLayout>
      <Table
        url={`/api/data/${model}/table`}
        title={model}
        columns={columns}
        singular={model}
        createPath={`/admin/${model}/create`}
      />
    </AppLayout>
  );
}
