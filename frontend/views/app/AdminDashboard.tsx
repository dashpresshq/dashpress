import { useEntitiesList } from "../../hooks/entity/entity.store";
import { AppLayout } from "../../_layouts/app";

// Improvement, being able to add dashboard items here

export function AdminDashboard() {
  const entitiesList = useEntitiesList();

  if (entitiesList.isFetching) {
    return "Loading";
  }

  return (
    <AppLayout breadcrumbs={[]}>
      {entitiesList.data.map((field) => (
        <div key={field.value}>{field.label}</div>
      ))}
    </AppLayout>
  );
}
