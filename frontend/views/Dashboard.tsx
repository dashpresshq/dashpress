import { ErrorAlert } from "@gothicgeeks/design-system";
import { useEntitiesMenuItems } from "../hooks/entity/entity.store";
import { AppLayout } from "../_layouts/app";

// Improvement, being able to add dashboard items here

export function Dashboard() {
  const entitiesMenuItems = useEntitiesMenuItems();

  if (entitiesMenuItems.isFetching) {
    return "Loading";
  }

  return (
    <AppLayout breadcrumbs={[]}>
      <ErrorAlert message={entitiesMenuItems.error} />
      {entitiesMenuItems.data.map((field) => (
        <div key={field.link}>{field.title}</div>
      ))}
    </AppLayout>
  );
}
