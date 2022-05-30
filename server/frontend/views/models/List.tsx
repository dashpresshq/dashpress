import {
  useSchemaFields,
} from "../../data-store/schema.data-store";
import { useSlug } from "../../lib/routing/useSlug";
// import { DynamicTableStateless } from "@atlaskit/dynamic-table";
import { useState } from "react";
import { AppLayout } from "../../_layouts/app";

export function ListModel() {
  const model = useSlug("model");
  const schemaFields = useSchemaFields(model);

  const [pageNumber, setPageNumber] = useState(3);
  const navigateTo = (pageNumber: number) => {
    setPageNumber(pageNumber);
  };

  return (
    <AppLayout>
      {/* <DynamicTableStateless
        head={{
          cells: (schemaFields.data || []).map(({ name }) => ({
            key: name,
            content: name,
            isSortable: true,
          })),
        }}
        rows={[]}
        rowsPerPage={5}
        page={pageNumber}
        loadingSpinnerSize="large"
        isLoading={false}
        // isFixedSize
        // sortKey="term"
        // sortOrder="DESC"
        onSort={() => console.log("onSort")}
        onSetPage={() => console.log("onSetPage")}
      /> */}
    </AppLayout>
  );
}
