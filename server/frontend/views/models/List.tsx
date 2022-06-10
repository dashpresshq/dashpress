import {
  useEntityScalarFields,
} from "../../data-store/entities.data-store";
import { useSlug } from "../../lib/routing/useSlug";
import { AppLayout } from "../../_layouts/app";
import { Table } from "@gothicgeeks/design-system";

export function ListModel() {
  const model = useSlug("model");
  const entityScalarFields = useEntityScalarFields(model);

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
        { label: model, value: `/admin/${model}` },
      ]}
    >
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
